/**
 * Публичная визитка агента (S-16b): `lumi.estate/agent/<slug>`.
 *
 * Две вещи, которые эта страница обязана не сломать, и обе уже ломались в
 * проде:
 *
 * 1. **Honeypot.** В этом репо он однажды был написан и не работал: поле на
 *    странице было, серверная проверка была, а клиент слал захардкоженный
 *    `hp: ""` — и защита не могла сработать ни разу (чинил `68efc7c`). Поэтому
 *    ниже проверяется не «поле существует», а что заполненный ботом honeypot
 *    доезжает до сервера значением и запрос отбивается.
 * 2. **Тихий отказ.** Waitlist уже отвечал «ты в списке» на лид, который не
 *    дошёл никуда (`2fdad05`). Здешний аналог — отдать 404 на живой профиль,
 *    когда прилёг BFF: для клиента это «агента не существует», для поисковика —
 *    сигнал выкинуть страницу из индекса.
 */
import { onRequestGet } from "../functions/agent/[slug]";
import {
  AGENT_DISCLAIMER,
  buildLeadPayload,
  buildVCard,
  emailHref,
  escapeHtml,
  initialsOf,
  renderProfileHtml,
  telegramHref,
  telHref,
  whatsappHref,
  type AgentProfileDto,
} from "../lib/agent-card";

// ─── Фикстуры ───────────────────────────────────────────────────────────

const PROFILE: AgentProfileDto = {
  slug: "maria-silva",
  full_name: "Maria Silva",
  role: "Buyer agent · Lisbon old town",
  bio: "Tenth year in Lisbon real estate.",
  areas: ["Alfama", "Graça"],
  theme: "mono",
  avatar_url: "https://cdn.example.com/a/maria.jpg",
  stats: [
    { label: "Closed in 2025", value: "17 deals" },
    { label: "Avg response", value: "< 2 h" },
  ],
  services: [{ title: "Relocation", subtitle: "Papers, NIF, bank account" }],
  contact: {
    phone: "+351 911 000 001",
    whatsapp: "+351911000001",
    telegram: "@maria_silva",
    email: "maria@example.com",
  },
  indexable: true,
  published_at: "2026-07-01T10:00:00Z",
};

const RENDER_OPTS = { apiOrigin: "https://lumi-bff.vercel.app" };

/** Тело, которое BFF отдаёт на `GET /api/agents/<slug>`. */
function bffResponse(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return {
    status,
    ok: status >= 200 && status < 300,
    json: async () => body,
    headers: new Map(Object.entries(headers)),
  };
}

function get(slug: string, url = `https://lumi.estate/agent/${slug}`, env = {}) {
  const request = new Request(url);
  return (onRequestGet as unknown as (c: unknown) => Promise<Response>)({
    request,
    env,
    params: { slug },
  });
}

const realFetch = global.fetch;
afterEach(() => {
  global.fetch = realFetch;
  jest.restoreAllMocks();
});

// ─── Honeypot ───────────────────────────────────────────────────────────

describe("honeypot — ловит бота, а не украшает форму", () => {
  /**
   * Ровно та регрессия, что была в проде: клиент слал константу, поэтому
   * серверная проверка `hp.trim() !== ""` не срабатывала никогда.
   */
  it("отправляет значение заполненного поля, а не пустую константу", () => {
    const payload = buildLeadPayload({
      name: "Bot",
      phone: "+351911000001",
      need: "",
      note: "",
      consent: true,
      hp: "http://spam.example.com",
    });

    expect(payload.hp).toBe("http://spam.example.com");
  });

  /**
   * Проверка сервера (BFF `parseLeadInput`) — `typeof hp === "string" &&
   * hp.trim() !== "" → spam`. Прогоняем через неё оба тела и убеждаемся, что
   * бот отбивается, а человек проходит: без этого «honeypot есть» ничего не
   * значит.
   */
  const serverRejectsAsSpam = (payload: Record<string, unknown>): boolean =>
    typeof payload.hp === "string" && payload.hp.trim() !== "";

  it("бот, заполнивший скрытое поле, отбивается сервером", () => {
    const fromBot = buildLeadPayload({
      name: "Bot",
      phone: "+351911000001",
      need: "",
      note: "",
      consent: true,
      hp: "buy-cheap-pills",
    });

    expect(serverRejectsAsSpam(fromBot)).toBe(true);
  });

  it("человек, оставивший скрытое поле пустым, проходит", () => {
    const fromHuman = buildLeadPayload({
      name: "Elena",
      phone: "+351911000002",
      need: "2 bedrooms in Alfama",
      note: "",
      consent: true,
      hp: "",
    });

    expect(serverRejectsAsSpam(fromHuman)).toBe(false);
    expect(fromHuman.name).toBe("Elena");
    expect(fromHuman.consent).toBe(true);
  });

  /**
   * Связка, которая и делает тесты выше не декоративными: в браузер уезжает
   * исходник ровно этой функции, а не её пересказ.
   */
  it("в страницу вставлен исходник протестированной функции", () => {
    const html = renderProfileHtml(PROFILE, RENDER_OPTS);
    expect(html).toContain(buildLeadPayload.toString());
  });

  it("клиентский код читает honeypot из поля, а не подставляет литерал", () => {
    const html = renderProfileHtml(PROFILE, RENDER_OPTS);
    expect(html).toContain("hp:f.hp.value");
    expect(html).not.toMatch(/hp:\s*['"]{2}/);
  });

  it("скрытое поле есть в DOM, но не на пути живого человека", () => {
    const html = renderProfileHtml(PROFILE, RENDER_OPTS);
    expect(html).toContain('name="hp"');
    expect(html).toContain('tabindex="-1"');
    expect(html).toContain('autocomplete="off"');
    expect(html).toContain('class="hp" aria-hidden="true"');
  });
});

// ─── Заявка ─────────────────────────────────────────────────────────────

describe("тело заявки", () => {
  it("несёт текст согласия, под которым подписался клиент", () => {
    const payload = buildLeadPayload({
      name: "Elena",
      phone: "+351911000002",
      need: "",
      note: "",
      consent: true,
      hp: "",
    });
    expect(typeof payload.consent_text).toBe("string");
    expect((payload.consent_text as string).length).toBeGreaterThan(20);
  });

  it("пустые необязательные поля уходят как null, а не пустой строкой", () => {
    const payload = buildLeadPayload({
      name: "Elena",
      phone: "+351911000002",
      need: "   ",
      note: "",
      consent: false,
      hp: "",
    });
    expect(payload.need).toBeNull();
    expect(payload.note).toBeNull();
    expect(payload.consent).toBe(false);
  });
});

// ─── Экранирование ──────────────────────────────────────────────────────

describe("XSS — контент визитки пишет агент, страница живёт на домене Lumi", () => {
  it("имя со скриптом не выходит из текста", () => {
    const html = renderProfileHtml(
      { ...PROFILE, full_name: '<script>alert(1)</script>' },
      RENDER_OPTS,
    );
    expect(html).not.toContain("<script>alert(1)</script>");
    expect(html).toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
  });

  it("кавычка в роли не разрывает атрибут og:title", () => {
    const html = renderProfileHtml(
      { ...PROFILE, role: '" onmouseover="alert(1)' },
      RENDER_OPTS,
    );
    expect(html).not.toContain('onmouseover="alert(1)"');
    expect(html).toContain("&quot;");
  });

  it("`</script>` в услугах не закрывает JSON-LD", () => {
    const html = renderProfileHtml(
      { ...PROFILE, bio: "</script><script>alert(1)</script>" },
      RENDER_OPTS,
    );
    // В JSON-LD `<` уходит как <, в теле — как &lt;
    expect(html).not.toContain("</script><script>alert(1)");
  });

  it("escapeHtml закрывает весь набор", () => {
    expect(escapeHtml(`<>&"'`)).toBe("&lt;&gt;&amp;&quot;&#39;");
  });
});

// ─── Контакты ───────────────────────────────────────────────────────────

describe("ссылки контактов", () => {
  it("телефон, WhatsApp и Telegram приводятся к рабочему виду", () => {
    expect(telHref("+351 911 000 001")).toBe("tel:+351911000001");
    expect(whatsappHref("+351 (911) 000-001")).toBe("https://wa.me/351911000001");
    expect(telegramHref("@maria_silva")).toBe("https://t.me/maria_silva");
    expect(telegramHref("https://t.me/maria_silva")).toBe("https://t.me/maria_silva");
    expect(emailHref("maria@example.com")).toBe("mailto:maria@example.com");
  });

  it("javascript: из поля агента не становится ссылкой", () => {
    // Схему задаём мы, поэтому «протокол» из поля попадает в номер, а не в href.
    expect(telHref("javascript:alert(1)")).toBeNull();
    expect(telegramHref("javascript:alert(1)")).toBeNull();
    expect(emailHref("javascript:alert(1)")).toBeNull();
    expect(whatsappHref("javascript:alert(1)")).toBeNull();
  });

  it("мусор вместо контакта не рендерит кнопку", () => {
    const html = renderProfileHtml(
      { ...PROFILE, contact: { phone: "—", telegram: "@@", email: "not-an-email" } },
      RENDER_OPTS,
    );
    expect(html).not.toContain("href=\"tel:");
    expect(html).not.toContain("t.me");
    expect(html).not.toContain("mailto:");
  });

  it("скрытый контакт не приходит от BFF и не рендерится", () => {
    // show_* фильтрует BFF (§6): скрытого поля в DTO просто нет.
    const html = renderProfileHtml(
      { ...PROFILE, contact: { phone: "+351911000001" } },
      RENDER_OPTS,
    );
    expect(html).toContain("tel:+351911000001");
    expect(html).not.toContain("wa.me");
    expect(html).not.toContain("mailto:");
  });
});

// ─── vCard ──────────────────────────────────────────────────────────────

describe("vCard", () => {
  it("собирается по RFC: CRLF, N/FN, телефон", () => {
    const vcf = buildVCard(PROFILE);
    expect(vcf.startsWith("BEGIN:VCARD\r\nVERSION:3.0\r\n")).toBe(true);
    expect(vcf).toContain("FN:Maria Silva");
    expect(vcf).toContain("N:Silva;Maria;;;");
    expect(vcf).toContain("TEL;TYPE=CELL:+351911000001");
    expect(vcf).toContain("URL:https://lumi.estate/agent/maria-silva");
    expect(vcf.endsWith("END:VCARD\r\n")).toBe(true);
  });

  it("запятая в имени не разъезжает контакт по полям", () => {
    const vcf = buildVCard({ ...PROFILE, full_name: "Silva, Maria" });
    expect(vcf).toContain("FN:Silva\\, Maria");
  });

  it("перевод строки в bio не ломает структуру", () => {
    const vcf = buildVCard({ ...PROFILE, bio: "line one\nline two" });
    expect(vcf).toContain("NOTE:line one\\nline two");
    // Единственные настоящие переводы строк — разделители полей.
    expect(vcf.split("\r\n").some((l) => l.startsWith("line two"))).toBe(false);
  });
});

// ─── Рендер ─────────────────────────────────────────────────────────────

describe("страница", () => {
  it("показывает то, что ввёл агент", () => {
    const html = renderProfileHtml(PROFILE, RENDER_OPTS);
    expect(html).toContain("Maria Silva");
    expect(html).toContain("Buyer agent · Lisbon old town");
    expect(html).toContain("Alfama");
    expect(html).toContain("17 deals");
    expect(html).toContain("Relocation");
  });

  it("несёт дисклеймер: claims — агента, не Lumi", () => {
    const html = renderProfileHtml(PROFILE, RENDER_OPTS);
    expect(html).toContain(escapeHtml(AGENT_DISCLAIMER));
  });

  it("без фото показывает инициалы", () => {
    const html = renderProfileHtml({ ...PROFILE, avatar_url: undefined }, RENDER_OPTS);
    expect(html).toContain(">MS<");
    expect(html).not.toContain("<img class=\"avatar\"");
  });

  it("инициалы работают не только на латинице", () => {
    expect(initialsOf("Иван Петров")).toBe("ИП");
    expect(initialsOf("محمد العلي")).toBe("ما");
    expect(initialsOf("Maria")).toBe("M");
  });

  /**
   * Формат, в котором аватар придёт из Supabase Storage (public bucket
   * `agent-photos`). Ссылка постоянная и без подписи — иначе она протухла бы
   * внутри страницы, которую CF держит на edge до суток, и в og:image,
   * который мессенджеры кэшируют неделями.
   */
  it("принимает постоянную ссылку из public-bucket Storage", () => {
    const url =
      "https://zxfolukuthecexxuolmd.supabase.co/storage/v1/object/public/agent-photos/user-42/a1b2c3.jpg";
    const html = renderProfileHtml({ ...PROFILE, avatar_url: url }, RENDER_OPTS);
    expect(html).toContain(`<img class="avatar" src="${url}"`);
    expect(html).toContain(`<meta property="og:image" content="${url}"/>`);
  });

  it("аватар не по https в src не попадает", () => {
    const html = renderProfileHtml(
      { ...PROFILE, avatar_url: "javascript:alert(1)" },
      RENDER_OPTS,
    );
    expect(html).not.toContain("javascript:alert(1)");
    // Фото нет — значит инициалы.
    expect(html).toContain(">MS<");
  });

  it("тумблер «скрыть от поисковиков» доезжает до robots", () => {
    expect(renderProfileHtml(PROFILE, RENDER_OPTS)).toContain('content="index, follow"');
    expect(renderProfileHtml({ ...PROFILE, indexable: false }, RENDER_OPTS)).toContain(
      'content="noindex, nofollow"',
    );
  });

  it("не размечает цифры агента рейтингом в JSON-LD", () => {
    // Цифры вводит агент и никто их не проверяет (§4): просить Google
    // показать их звёздами от имени Lumi нельзя.
    const html = renderProfileHtml(PROFILE, RENDER_OPTS);
    expect(html).toContain('"@type":"RealEstateAgent"');
    expect(html).not.toContain("aggregateRating");
    expect(html).not.toContain('"review"');
  });

  it("канон бренда: градиентов нет by design", () => {
    const html = renderProfileHtml(PROFILE, RENDER_OPTS);
    expect(html.toLowerCase()).not.toContain("gradient");
  });

  it("внешних ресурсов не грузит — ни шрифтов, ни скриптов", () => {
    const html = renderProfileHtml({ ...PROFILE, avatar_url: undefined }, RENDER_OPTS);
    expect(html).not.toContain("fonts.googleapis.com");
    expect(html).not.toContain("<script src=");
    expect(html).not.toContain("<link rel=\"stylesheet\"");
  });

  it("пустой профиль не роняет рендер", () => {
    const bare: AgentProfileDto = {
      slug: "new-agent",
      full_name: "New Agent",
      areas: [],
      stats: [],
      services: [],
      contact: {},
      indexable: true,
    };
    const html = renderProfileHtml(bare, RENDER_OPTS);
    expect(html).toContain("New Agent");
    // Даже без единого контакта остаётся «сохранить контакт» и форма.
    expect(html).toContain("Save contact");
    expect(html).toContain('id="leadForm"');
  });
});

// ─── Function ───────────────────────────────────────────────────────────

describe("GET /agent/<slug>", () => {
  it("отдаёт визитку живого профиля", async () => {
    global.fetch = jest.fn().mockResolvedValue(bffResponse(PROFILE)) as unknown as typeof fetch;
    const res = await get("maria-silva");

    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/html");
    expect(await res.text()).toContain("Maria Silva");
  });

  it("ходит в BFF за тем slug, что пришёл в пути", async () => {
    const fetchMock = jest.fn().mockResolvedValue(bffResponse(PROFILE));
    global.fetch = fetchMock as unknown as typeof fetch;
    await get("maria-silva");

    expect(fetchMock).toHaveBeenCalledWith(
      "https://lumi-bff.vercel.app/api/agents/maria-silva",
      expect.objectContaining({ redirect: "manual" }),
    );
  });

  it("неопубликованный и несуществующий отдают один и тот же 404", async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValue(bffResponse({ error: "not_found" }, 404)) as unknown as typeof fetch;
    const res = await get("kto-to");

    expect(res.status).toBe(404);
    expect(await res.text()).toContain("This page isn't here");
  });

  /** Ретайренный slug: ссылка уже у клиентов, она обязана вести на новую. */
  it("ведёт старую ссылку на новую страницу, а не на API", async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValue(bffResponse({ moved_to: "maria-silva-lisboa" }, 301)) as unknown as typeof fetch;
    const res = await get("maria-silva");

    expect(res.status).toBe(301);
    expect(res.headers.get("location")).toBe("/agent/maria-silva-lisboa");
  });

  /**
   * Главный тест этого блока. 404 на упавшем BFF — это тихий отказ: клиент
   * видит «агента нет», Google выкидывает живую страницу из индекса.
   */
  it("на упавший BFF отвечает 503, а не 404", async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValue(bffResponse({ error: "query_failed" }, 502)) as unknown as typeof fetch;
    jest.spyOn(console, "error").mockImplementation(() => {});
    const res = await get("maria-silva");

    expect(res.status).toBe(503);
    expect(res.headers.get("cache-control")).toBe("no-store");
  });

  it("на недоступный BFF отвечает 503, а не падает", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("ECONNREFUSED")) as unknown as typeof fetch;
    jest.spyOn(console, "error").mockImplementation(() => {});
    const res = await get("maria-silva");

    expect(res.status).toBe(503);
  });

  it("мусор вместо профиля — не 200 с пустой визиткой", async () => {
    global.fetch = jest.fn().mockResolvedValue(bffResponse({ nonsense: true })) as unknown as typeof fetch;
    jest.spyOn(console, "error").mockImplementation(() => {});
    const res = await get("maria-silva");

    expect(res.status).toBe(503);
  });

  it("кэшируется на edge — этим снимается хоп до Vercel", async () => {
    global.fetch = jest.fn().mockResolvedValue(bffResponse(PROFILE)) as unknown as typeof fetch;
    const res = await get("maria-silva");

    expect(res.headers.get("cache-control")).toContain("s-maxage=300");
  });

  it("отдаёт vCard на «сохранить контакт»", async () => {
    global.fetch = jest.fn().mockResolvedValue(bffResponse(PROFILE)) as unknown as typeof fetch;
    const res = await get("maria-silva", "https://lumi.estate/agent/maria-silva?contact=vcf");

    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/vcard");
    expect(res.headers.get("content-disposition")).toContain("maria-silva.vcf");
    expect(await res.text()).toContain("FN:Maria Silva");
  });

  it("origin BFF переопределяется для локального прогона", async () => {
    const fetchMock = jest.fn().mockResolvedValue(bffResponse(PROFILE));
    global.fetch = fetchMock as unknown as typeof fetch;
    await get("maria-silva", "https://lumi.estate/agent/maria-silva", {
      AGENT_API_ORIGIN: "http://127.0.0.1:8788",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "http://127.0.0.1:8788/api/agents/maria-silva",
      expect.anything(),
    );
  });

  it("slug с косой чертой не подделывает путь в BFF", async () => {
    const fetchMock = jest.fn().mockResolvedValue(bffResponse({ error: "not_found" }, 404));
    global.fetch = fetchMock as unknown as typeof fetch;
    await get("../me/leads");

    expect(fetchMock).toHaveBeenCalledWith(
      "https://lumi-bff.vercel.app/api/agents/..%2Fme%2Fleads",
      expect.anything(),
    );
  });
});
