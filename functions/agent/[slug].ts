/// <reference types="@cloudflare/workers-types" />
/**
 * `lumi.estate/agent/<slug>` — публичная визитка агента.
 *
 * Почему Function, а не страница Next: этот репо — `output: "export"`, SSR тут
 * нет и не планируется, а профиль обязан открываться сразу после публикации, не
 * дожидаясь билда. Pages Functions дают серверный рендер на apex рядом со
 * статикой — механизм уже в проде (`/api/waitlist`). Статика приоритетна,
 * Function ловит пути без статического файла, а `/agent/*` пуст.
 * Разбор альтернатив (прокси на Vercel, OpenNext, static export + deploy hook):
 * lumi-mobile `docs/design/PUBLIC-PROFILE.md` §2.
 *
 * Данные — из BFF `GET /api/agents/<slug>`; в Supabase эта Function не ходит
 * (иначе понадобился бы anon-ключ в CF и второй контракт чтения, §2 документа).
 */
import {
  buildVCard,
  renderNotFoundHtml,
  renderProfileHtml,
  renderUnavailableHtml,
  type AgentProfileDto,
} from "../../lib/agent-card";

interface Env {
  /** Origin BFF. Переопределяется для локального прогона (`wrangler pages dev`). */
  AGENT_API_ORIGIN?: string;
}

const DEFAULT_API_ORIGIN = "https://lumi-bff.vercel.app";

/** Как у BFF (§6): 5 минут на edge, сутки stale — этим снимается хоп CF → Vercel. */
const PAGE_CACHE = "public, s-maxage=300, stale-while-revalidate=86400";
const NOT_FOUND_CACHE = "public, s-maxage=60";

const HTML_HEADERS = { "content-type": "text/html; charset=utf-8" };

function notFound(): Response {
  return new Response(renderNotFoundHtml(), {
    status: 404,
    headers: { ...HTML_HEADERS, "cache-control": NOT_FOUND_CACHE },
  });
}

/**
 * BFF лёг — это не «профиля нет».
 *
 * 404 здесь означал бы для поисковика, что живая страница агента исчезла, а для
 * клиента с его ссылкой — что агента не существует. Пятисотка честнее: она
 * временная, её не индексируют и не кэшируют.
 */
function upstreamDown(): Response {
  return new Response(renderUnavailableHtml(), {
    status: 503,
    headers: { ...HTML_HEADERS, "cache-control": "no-store", "retry-after": "30" },
  });
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env, params } = context;

  // CF отдаёт сегмент строкой; массив приходит только у catch-all `[[slug]]`.
  const raw = params.slug;
  const slug = Array.isArray(raw) ? raw.join("/") : String(raw ?? "");
  if (!slug) return notFound();

  const apiOrigin = env.AGENT_API_ORIGIN || DEFAULT_API_ORIGIN;
  const endpoint = `${apiOrigin}/api/agents/${encodeURIComponent(slug)}`;

  let res: Response;
  try {
    // redirect:"manual" — 301 обязан долететь до браузера как смена URL.
    // С "follow" мы бы молча отрендерили новый профиль на старом адресе, и в
    // индексе осталось бы два URL одной визитки.
    res = await fetch(endpoint, {
      redirect: "manual",
      headers: { accept: "application/json" },
    });
  } catch (e) {
    console.error("[agent] BFF unreachable:", e instanceof Error ? e.message : String(e));
    return upstreamDown();
  }

  if (res.status === 301 || res.status === 308) {
    const body = (await res.json().catch(() => null)) as { moved_to?: string } | null;
    // Ведём на страницу, а не на API: `location` от BFF указывает на свой же
    // `/api/agents/<slug>` — для браузера это был бы JSON вместо визитки.
    if (body?.moved_to) {
      return new Response(null, {
        status: 301,
        headers: {
          location: `/agent/${encodeURIComponent(body.moved_to)}`,
          "cache-control": PAGE_CACHE,
        },
      });
    }
    return notFound();
  }

  // 404 — и несуществующий, и неопубликованный, и невалидный slug (§6).
  if (res.status === 404) return notFound();

  if (!res.ok) {
    console.error("[agent] BFF non-ok:", res.status, endpoint);
    return upstreamDown();
  }

  const dto = (await res.json().catch(() => null)) as AgentProfileDto | null;
  if (!dto || typeof dto.full_name !== "string" || !dto.full_name.trim()) {
    console.error("[agent] BFF returned a body without full_name:", endpoint);
    return upstreamDown();
  }

  // Нормализуем то, на что рендер опирается: BFF своё уже проверил, но пустой
  // массив вместо undefined дешевле, чем гарды на каждой секции.
  const profile: AgentProfileDto = {
    ...dto,
    slug: dto.slug || slug,
    areas: Array.isArray(dto.areas) ? dto.areas : [],
    stats: Array.isArray(dto.stats) ? dto.stats : [],
    services: Array.isArray(dto.services) ? dto.services : [],
    contact: dto.contact && typeof dto.contact === "object" ? dto.contact : {},
    indexable: dto.indexable !== false,
  };

  const url = new URL(request.url);

  // «Сохранить контакт» — серверный ответ, а не Blob в браузере: iOS Safari
  // открывает blob-vCard текстом вместо карточки контакта.
  if (url.searchParams.get("contact") === "vcf") {
    return new Response(buildVCard(profile), {
      headers: {
        "content-type": "text/vcard; charset=utf-8",
        "content-disposition": `attachment; filename="${encodeURIComponent(profile.slug)}.vcf"`,
        "cache-control": PAGE_CACHE,
      },
    });
  }

  const html = renderProfileHtml(profile, {
    apiOrigin,
    siteOrigin: url.origin,
  });

  return new Response(html, {
    headers: {
      ...HTML_HEADERS,
      "cache-control": PAGE_CACHE,
      // Страница целиком собрана нами: внешних скриптов нет, стили и скрипт —
      // инлайн, картинка только аватар из Storage.
      "referrer-policy": "strict-origin-when-cross-origin",
      "x-content-type-options": "nosniff",
    },
  });
};
