/**
 * Публичная визитка агента — чистая логика рендера (S-16b).
 *
 * Страница живёт на apex: `lumi.estate/agent/<slug>` отдаётся Pages Function
 * `functions/agent/[slug].ts`, данные она берёт из BFF `GET /api/agents/<slug>`.
 * Здесь — всё, что можно проверить юнитом: маппинг DTO в HTML, vCard, ссылки
 * контактов и сборка тела заявки. Function остаётся тонкой — конвенция репо
 * (см. `functions/api/waitlist.ts` + `__tests__/waitlist.test.ts`).
 *
 * Решение целиком: lumi-mobile `docs/design/PUBLIC-PROFILE.md` (ревизия 2).
 * Контракт данных: lumi-mobile `landing/lib/public-profile.ts`.
 */

/** DTO как его отдаёт `GET /api/agents/<slug>` (контракт S-16a, §6 документа). */
export interface AgentStat {
  label: string;
  value: string;
}
export interface AgentService {
  title: string;
  subtitle?: string;
}
export interface AgentProfileDto {
  slug: string;
  full_name: string;
  role?: string;
  bio?: string;
  areas: string[];
  theme?: string;
  avatar_url?: string;
  stats: AgentStat[];
  services: AgentService[];
  contact: {
    phone?: string;
    whatsapp?: string;
    telegram?: string;
    email?: string;
  };
  indexable: boolean;
  published_at?: string;
}

export const SITE_ORIGIN = "https://lumi.estate";

/**
 * Дисклеймер (решение Никиты 2026-07-17).
 *
 * Цифры и услуги вводит агент руками, а страница живёт на домене Lumi — эта
 * строка разделяет: claims принадлежат агенту, площадка Lumi их не проверяет.
 */
export const AGENT_DISCLAIMER =
  "This page was filled in by the agent. Lumi provides the tool for publishing it and does not verify the claims made here.";

/** Текст согласия уезжает в БД вместе с заявкой — версионируется вместе с формой. */
export const CONSENT_TEXT =
  "I agree that my name and phone number will be passed to this agent so they can contact me about my request.";

// ─── Экранирование ──────────────────────────────────────────────────────

/**
 * Весь контент визитки — свободный ввод агента, который уезжает в публичный
 * HTML. Экранируется всё без исключения: одно неэкранированное поле здесь —
 * это XSS на домене Lumi, с которого агент рассылает ссылку клиентам.
 */
export function escapeHtml(raw: string): string {
  return raw
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * JSON внутри `<script>`: `</script>` в данных закрыл бы тег и всё, что дальше,
 * браузер прочитал бы как разметку. Экранируем `<` — этого достаточно и для
 * JSON-LD, и для инлайн-конфига.
 */
export function jsonForScript(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

// ─── Контакты ───────────────────────────────────────────────────────────

/**
 * Контакты — свободные строки (BFF режет только длину), а отсюда они идут в
 * `href`. Схему всегда задаём сами (`tel:`, `https://`, `mailto:`), поэтому
 * `javascript:` из поля агента в атрибут не попадёт. Плюс вычищаем управляющие
 * символы и кавычки — остальное доделывает escapeHtml на выводе.
 */
function cleanContact(raw: string): string {
  // eslint-disable-next-line no-control-regex
  return raw.replace(/[\x00-\x1f\x7f"'<>]/g, "").trim();
}

/** Только цифры — для tel/wa.me, где всё прочее ломает набор номера. */
function digitsOf(raw: string): string {
  const cleaned = cleanContact(raw);
  const plus = cleaned.trim().startsWith("+");
  const digits = cleaned.replace(/\D/g, "");
  return plus ? `+${digits}` : digits;
}

export function telHref(phone: string): string | null {
  const num = digitsOf(phone);
  return num.replace(/\D/g, "").length >= 5 ? `tel:${num}` : null;
}

/** wa.me принимает только цифры — без `+`, пробелов и скобок. */
export function whatsappHref(phone: string): string | null {
  const digits = cleanContact(phone).replace(/\D/g, "");
  return digits.length >= 5 ? `https://wa.me/${digits}` : null;
}

/** Агент пишет хэндл как привык: `@name`, `name`, или уже готовой ссылкой. */
export function telegramHref(handle: string): string | null {
  const cleaned = cleanContact(handle);
  if (!cleaned) return null;
  const direct = cleaned.match(/^https?:\/\/(?:t\.me|telegram\.me)\/([A-Za-z0-9_]{3,})$/i);
  if (direct) return `https://t.me/${direct[1]}`;
  const name = cleaned.replace(/^@/, "");
  return /^[A-Za-z0-9_]{3,32}$/.test(name) ? `https://t.me/${name}` : null;
}

export function emailHref(email: string): string | null {
  const cleaned = cleanContact(email);
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned) ? `mailto:${cleaned}` : null;
}

/** Аватар идёт в `src`: data:/javascript: сюда не пускаем (BFF тоже, но это второй рубеж). */
export function safeAvatarUrl(raw: string | undefined): string | null {
  if (!raw) return null;
  const cleaned = cleanContact(raw);
  return /^https:\/\/[^\s]+$/i.test(cleaned) ? cleaned : null;
}

/**
 * Инициалы, когда фото нет. Берём первую букву первого и последнего слова —
 * работает и для кириллицы, и для арабского, в отличие от `[A-Z]`-выборки.
 */
export function initialsOf(fullName: string): string {
  const words = fullName.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  const first = [...words[0]][0] ?? "";
  const last = words.length > 1 ? ([...words[words.length - 1]][0] ?? "") : "";
  return (first + last).toUpperCase();
}

// ─── vCard ──────────────────────────────────────────────────────────────

/**
 * vCard 3.0 — её понимают iOS, Android и Outlook; 4.0 у Apple до сих пор
 * читается хуже. Переводы строк и `;` в значениях экранируются: имя с запятой
 * иначе разъедет контакт по полям.
 */
function vcardEscape(raw: string): string {
  return raw
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

export function buildVCard(dto: AgentProfileDto): string {
  const name = dto.full_name.trim();
  const words = name.split(/\s+/).filter(Boolean);
  const given = words[0] ?? name;
  const family = words.length > 1 ? words.slice(1).join(" ") : "";

  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${vcardEscape(family)};${vcardEscape(given)};;;`,
    `FN:${vcardEscape(name)}`,
  ];
  if (dto.role) lines.push(`TITLE:${vcardEscape(dto.role)}`);
  if (dto.contact.phone) lines.push(`TEL;TYPE=CELL:${vcardEscape(digitsOf(dto.contact.phone))}`);
  if (dto.contact.email) lines.push(`EMAIL;TYPE=INTERNET:${vcardEscape(cleanContact(dto.contact.email))}`);
  const tg = dto.contact.telegram ? telegramHref(dto.contact.telegram) : null;
  if (tg) lines.push(`URL:${vcardEscape(tg)}`);
  lines.push(`URL:${SITE_ORIGIN}/agent/${vcardEscape(dto.slug)}`);
  if (dto.areas.length) lines.push(`ADR;TYPE=WORK:;;${vcardEscape(dto.areas.join(", "))};;;;`);
  if (dto.bio) lines.push(`NOTE:${vcardEscape(dto.bio)}`);
  lines.push("END:VCARD");

  // CRLF — этого требует RFC 6350; с голым \n часть Android-контактов молчит.
  return lines.join("\r\n") + "\r\n";
}

// ─── Заявка: тело запроса ───────────────────────────────────────────────

export interface LeadFormValues {
  name: string;
  phone: string;
  need: string;
  note: string;
  consent: boolean;
  /** Значение honeypot-поля. Именно значение, а не признак — см. ниже. */
  hp: string;
}

/**
 * Форма → тело `POST /api/agents/<slug>/lead`.
 *
 * ⚠️ Эта функция уезжает в браузер через `.toString()` (см. renderClientScript):
 * тестируется ровно тот код, который исполняется. Так закрыта регрессия
 * `68efc7c`: тогда honeypot был на странице и проверялся на сервере, но клиент
 * слал захардкоженный `hp: ""` — серверная проверка не могла сработать ни разу,
 * и «защита» была строчкой в отчёте, а не защитой. Поэтому `hp` здесь обязан
 * приходить значением поля и уходить как есть: тест на это — в
 * `__tests__/agent-card.test.ts`.
 */
export function buildLeadPayload(values: LeadFormValues): Record<string, unknown> {
  return {
    name: String(values.name || "").trim(),
    phone: String(values.phone || "").trim(),
    need: String(values.need || "").trim() || null,
    note: String(values.note || "").trim() || null,
    consent: values.consent === true,
    consent_text: CONSENT_TEXT,
    hp: String(values.hp ?? ""),
  };
}

// ─── Оформление ─────────────────────────────────────────────────────────

/**
 * Monochrome Luxe (`docs/design/UI-KIT-BRIEF.md`): тёплый монохром, шампань
 * микроакцентом, синий — единственный функциональный сигнал. Градиентов нет
 * by design, поэтому их нет и здесь.
 *
 * Inter подключён стеком, а не файлом: своего woff2 в репо нет, а тянуть шрифт
 * с Google Fonts — это IP каждого посетителя визитки на сторону, чего EU-рынку
 * (и §4 «Приватность» документа) не предлагают. Где Inter установлен — берётся
 * он, иначе системный гротеск, метрически близкий.
 */
const FONT_STACK =
  'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

const STYLES = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#F7F6F3; --card:#FFFFFF; --border:rgba(20,20,22,.06);
  --text:#141416; --dim:#6B6A65; --mute:#A5A49E;
  --accent:#2563EB; --champagne:#9C8A5E; --champagne-wash:rgba(156,138,94,.08);
  --ink:#141416; --on-ink:#F7F6F3;
  --shadow:0 12px 30px rgba(20,20,22,.07);
  --field:#FFFFFF; --field-border:rgba(20,20,22,.16);
}
@media (prefers-color-scheme:dark){
  :root{
    --bg:#0C0D10; --card:#141519; --border:rgba(255,255,255,.055);
    --text:#F2F1EE; --dim:#9C9B96; --mute:#65645F;
    --accent:#3B82F6; --champagne:#D8C9A3; --champagne-wash:rgba(216,201,163,.07);
    --ink:#F2F1EE; --on-ink:#0C0D10;
    --shadow:0 14px 34px rgba(0,0,0,.42);
    --field:#1C1D23; --field-border:rgba(255,255,255,.12);
  }
}
html{-webkit-text-size-adjust:100%}
body{
  background:var(--bg); color:var(--text); font-family:${FONT_STACK};
  line-height:1.5; -webkit-font-smoothing:antialiased; padding:0 16px 40px;
}
.wrap{max-width:424px;margin:0 auto}
.top{display:flex;align-items:center;justify-content:space-between;padding:18px 2px}
.brand{display:inline-flex;align-items:center;gap:8px;text-decoration:none;color:var(--text)}
.brand span{font-size:15px;font-weight:600;letter-spacing:-.2px}
.micro{
  font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;
  color:var(--champagne)
}
.card{
  background:var(--card);border:1px solid var(--border);border-radius:22px;
  box-shadow:var(--shadow);padding:22px;margin-bottom:14px
}
.hero{display:flex;gap:14px;align-items:center}
/* Скруглённый квадрат r14 — фирменная деталь Lumi, не круг (UI-KIT §1). */
.avatar{
  width:72px;height:72px;border-radius:14px;flex:0 0 auto;object-fit:cover;
  background:var(--champagne-wash);border:1px solid var(--border);
  display:flex;align-items:center;justify-content:center;
  font-size:24px;font-weight:600;color:var(--text);letter-spacing:-.5px
}
h1{font-size:23px;font-weight:600;letter-spacing:-.8px;line-height:1.2}
.role{color:var(--dim);font-size:14px;margin-top:3px}
.areas{display:flex;flex-wrap:wrap;gap:6px;margin-top:14px}
.area{
  font-size:12px;color:var(--dim);background:var(--bg);
  border:1px solid var(--border);border-radius:999px;padding:4px 10px
}
.bio{color:var(--dim);font-size:14px;margin-top:14px;white-space:pre-wrap}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(0,1fr));gap:10px;margin-top:18px}
.stat{text-align:center;padding:10px 4px;background:var(--bg);border-radius:13px}
.stat-v{font-size:17px;font-weight:600;letter-spacing:-.4px}
.stat-l{font-size:10px;margin-top:3px;color:var(--dim);line-height:1.3}
.actions{display:flex;flex-direction:column;gap:8px}
.btn{
  display:flex;align-items:center;justify-content:center;gap:8px;height:48px;
  border-radius:13px;font-size:15px;font-weight:600;font-family:inherit;
  text-decoration:none;cursor:pointer;border:1px solid transparent;
  transition:opacity .15s ease
}
.btn:active{opacity:.75}
/* В .actions ширину даёт flex-контейнер, а прямой ребёнок формы её не получит. */
form .btn{width:100%}
/* primary — ink-инверсия, НЕ синий: синий в Lumi значит «действие AI». */
.b-primary{background:var(--ink);color:var(--on-ink)}
.b-ghost{background:transparent;color:var(--text);border-color:var(--field-border)}
.row2{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.svc{display:flex;flex-direction:column;gap:10px;margin-top:14px}
.svc-i{display:flex;gap:10px;align-items:flex-start}
.dot{width:6px;height:6px;border-radius:999px;background:var(--accent);margin-top:7px;flex:0 0 auto}
.svc-t{font-size:15px;font-weight:500}
.svc-s{font-size:13px;color:var(--dim);margin-top:2px}
label{display:block;font-size:13px;color:var(--dim);margin:12px 0 5px}
input[type=text],input[type=tel],textarea{
  width:100%;background:var(--field);color:var(--text);font-family:inherit;font-size:16px;
  border:1px solid var(--field-border);border-radius:16px;padding:12px 14px;outline:none
}
input:focus,textarea:focus{border-color:var(--accent)}
textarea{resize:vertical;min-height:64px}
.consent{display:flex;gap:9px;align-items:flex-start;margin:14px 0 4px;font-size:12px;color:var(--dim)}
.consent input{margin-top:2px;flex:0 0 auto;accent-color:var(--accent);width:16px;height:16px}
/* Honeypot: вне экрана, но в DOM и в табличном порядке его нет. */
.hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}
.note{font-size:12px;color:var(--mute);margin-top:10px;text-align:center}
.msg{font-size:14px;border-radius:13px;padding:12px 14px;margin-top:12px;display:none}
.msg.err{display:block;background:var(--champagne-wash);color:var(--text)}
.msg.ok{display:block;background:var(--bg);color:var(--text);border:1px solid var(--border)}
footer{text-align:center;padding:8px 6px 0}
.disclaimer{font-size:11px;color:var(--mute);line-height:1.5}
.foot-link{display:inline-block;margin-top:10px;font-size:12px;color:var(--accent);text-decoration:none}
h2{font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--champagne)}
`;

/** Искра Lumi — один в один из `components/Logo.tsx` (четыре луча, не дверь). */
function sparkSvg(size = 22): string {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" aria-hidden="true">`
    + `<rect width="24" height="24" rx="6" fill="#09090B"/>`
    + `<path d="M12 4.5 C12.45 9.3 14.7 11.55 19.5 12 C14.7 12.45 12.45 14.7 12 19.5 C11.55 14.7 9.3 12.45 4.5 12 C9.3 11.55 11.55 9.3 12 4.5 Z" fill="#FFFFFF"/>`
    + `</svg>`;
}

// ─── Клиентский скрипт ──────────────────────────────────────────────────

/**
 * Ванильный JS страницы. `buildLeadPayload` вставляется своим исходником —
 * не копией, — поэтому юнит-тест на honeypot проверяет тот самый код, который
 * уйдёт в браузер.
 */
function renderClientScript(apiOrigin: string, slug: string): string {
  return `
const API=${jsonForScript(apiOrigin)},SLUG=${jsonForScript(slug)};
const buildLeadPayload=${buildLeadPayload.toString()};
const CONSENT_TEXT=${jsonForScript(CONSENT_TEXT)};
const f=document.getElementById('leadForm'),msg=document.getElementById('formMsg');
f.addEventListener('submit',async(e)=>{
  e.preventDefault();
  const btn=document.getElementById('leadBtn');
  msg.className='msg';
  // hp читается из поля — не константа. Заполнил его только бот.
  const payload=buildLeadPayload({
    name:f.name.value,phone:f.phone.value,need:f.need.value,
    note:f.note.value,consent:f.consent.checked,hp:f.hp.value
  });
  if(!payload.name||payload.name.length<2){show('err','Please enter your name.');return}
  if(!payload.consent){show('err','Please confirm you agree to be contacted.');return}
  btn.disabled=true;btn.textContent='Sending…';
  try{
    const res=await fetch(API+'/api/agents/'+encodeURIComponent(SLUG)+'/lead',{
      method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)
    });
    if(res.ok){f.reset();show('ok','Thank you — your request has been sent. The agent will call you back.')}
    else{const b=await res.json().catch(()=>({}));show('err',b&&b.error==='bad_phone'?'Please check the phone number.':'Something went wrong. Please try again or use the buttons above.')}
  }catch(_){show('err','Network error. Please try again or use the buttons above.')}
  btn.disabled=false;btn.textContent='Send request';
});
function show(kind,text){msg.className='msg '+kind;msg.textContent=text}
`.trim();
}

// ─── Страница ───────────────────────────────────────────────────────────

function metaTags(dto: AgentProfileDto, canonical: string): string {
  const title = dto.role
    ? `${dto.full_name} — ${dto.role}`
    : `${dto.full_name} — real estate agent`;
  const description =
    dto.bio?.slice(0, 180) ||
    (dto.areas.length ? `Real estate agent. ${dto.areas.join(", ")}.` : "Real estate agent.");
  const avatar = safeAvatarUrl(dto.avatar_url);

  // Профиль неиндексируемый — тумблер агента (§4 документа). Тогда и OG не нужен.
  const robots = dto.indexable
    ? '<meta name="robots" content="index, follow"/>'
    : '<meta name="robots" content="noindex, nofollow"/>';

  return [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(description)}"/>`,
    robots,
    `<link rel="canonical" href="${escapeHtml(canonical)}"/>`,
    `<meta property="og:type" content="profile"/>`,
    `<meta property="og:title" content="${escapeHtml(title)}"/>`,
    `<meta property="og:description" content="${escapeHtml(description)}"/>`,
    `<meta property="og:url" content="${escapeHtml(canonical)}"/>`,
    avatar ? `<meta property="og:image" content="${escapeHtml(avatar)}"/>` : "",
    `<meta name="twitter:card" content="${avatar ? "summary_large_image" : "summary"}"/>`,
  ]
    .filter(Boolean)
    .join("");
}

/**
 * JSON-LD: только то, что агент ввёл сам. Ни `aggregateRating`, ни `review` —
 * цифры на странице непроверяемы (§4), и разметить их как рейтинг значило бы
 * попросить Google показать их звёздами в выдаче от имени Lumi.
 */
function jsonLd(dto: AgentProfileDto, canonical: string): string {
  const avatar = safeAvatarUrl(dto.avatar_url);
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: dto.full_name,
    url: canonical,
  };
  if (dto.role) data.jobTitle = dto.role;
  if (dto.bio) data.description = dto.bio;
  if (avatar) data.image = avatar;
  if (dto.areas.length) data.areaServed = dto.areas;
  if (dto.contact.phone) data.telephone = digitsOf(dto.contact.phone);
  if (dto.contact.email) data.email = cleanContact(dto.contact.email);
  return `<script type="application/ld+json">${jsonForScript(data)}</script>`;
}

function heroSection(dto: AgentProfileDto): string {
  const avatar = safeAvatarUrl(dto.avatar_url);
  const face = avatar
    ? `<img class="avatar" src="${escapeHtml(avatar)}" alt="${escapeHtml(dto.full_name)}" width="72" height="72" loading="eager"/>`
    : `<div class="avatar" aria-hidden="true">${escapeHtml(initialsOf(dto.full_name))}</div>`;

  const areas = dto.areas.length
    ? `<div class="areas">${dto.areas
        .map((a) => `<span class="area">${escapeHtml(a)}</span>`)
        .join("")}</div>`
    : "";
  const bio = dto.bio ? `<p class="bio">${escapeHtml(dto.bio)}</p>` : "";
  const stats = dto.stats.length
    ? `<div class="stats">${dto.stats
        .map(
          (s) =>
            `<div class="stat"><div class="stat-v">${escapeHtml(s.value)}</div>` +
            `<div class="stat-l">${escapeHtml(s.label)}</div></div>`,
        )
        .join("")}</div>`
    : "";

  return `<section class="card">
<div class="hero">${face}<div><h1>${escapeHtml(dto.full_name)}</h1>${
    dto.role ? `<div class="role">${escapeHtml(dto.role)}</div>` : ""
  }</div></div>${areas}${bio}${stats}</section>`;
}

function actionsSection(dto: AgentProfileDto): string {
  const tel = dto.contact.phone ? telHref(dto.contact.phone) : null;
  const wa = dto.contact.whatsapp ? whatsappHref(dto.contact.whatsapp) : null;
  const tg = dto.contact.telegram ? telegramHref(dto.contact.telegram) : null;
  const mail = dto.contact.email ? emailHref(dto.contact.email) : null;

  const secondary = [
    wa ? `<a class="btn b-ghost" href="${escapeHtml(wa)}" rel="noopener">WhatsApp</a>` : "",
    tg ? `<a class="btn b-ghost" href="${escapeHtml(tg)}" rel="noopener">Telegram</a>` : "",
    mail ? `<a class="btn b-ghost" href="${escapeHtml(mail)}">Email</a>` : "",
  ].filter(Boolean);

  // Две кнопки встают в ряд, одна — на всю ширину: пустая половина выглядит поломкой.
  const secondaryHtml =
    secondary.length === 2
      ? `<div class="row2">${secondary.join("")}</div>`
      : secondary.join("");

  const rows = [
    tel ? `<a class="btn b-primary" href="${escapeHtml(tel)}">Call</a>` : "",
    secondaryHtml,
    // vCard отдаёт сервер: Blob на iOS Safari открывается текстом вместо карточки.
    `<a class="btn b-ghost" href="/agent/${encodeURIComponent(dto.slug)}?contact=vcf">Save contact</a>`,
  ].filter(Boolean);

  return rows.length ? `<section class="card actions">${rows.join("")}</section>` : "";
}

function servicesSection(dto: AgentProfileDto): string {
  if (!dto.services.length) return "";
  const items = dto.services
    .map(
      (s) =>
        `<div class="svc-i"><span class="dot" aria-hidden="true"></span><div>` +
        `<div class="svc-t">${escapeHtml(s.title)}</div>` +
        (s.subtitle ? `<div class="svc-s">${escapeHtml(s.subtitle)}</div>` : "") +
        `</div></div>`,
    )
    .join("");
  return `<section class="card"><h2>How I can help</h2><div class="svc">${items}</div></section>`;
}

/**
 * Форма заявки. Honeypot `hp` — настоящий инпут, а не декорация: его значение
 * читает `buildLeadPayload` и отправляет как есть, сервер по нему и отсекает
 * бота (`parseLeadInput` в BFF). `autocomplete="off"` — чтобы браузер не
 * подставил в него адрес и не выдал живого человека за бота.
 */
function formSection(): string {
  return `<section class="card">
<h2>Send a request</h2>
<form id="leadForm" novalidate>
<label for="ln">Name</label>
<input id="ln" name="name" type="text" autocomplete="name" maxlength="80" required/>
<label for="lp">Phone</label>
<input id="lp" name="phone" type="tel" autocomplete="tel" maxlength="64" required/>
<label for="ld">What are you looking for?</label>
<input id="ld" name="need" type="text" maxlength="120"/>
<label for="lc">Message</label>
<textarea id="lc" name="note" rows="2" maxlength="1000"></textarea>
<div class="hp" aria-hidden="true"><label for="lh">Company</label>
<input id="lh" name="hp" type="text" tabindex="-1" autocomplete="off"/></div>
<label class="consent"><input id="lg" name="consent" type="checkbox"/><span>${escapeHtml(
    CONSENT_TEXT,
  )}</span></label>
<button class="btn b-primary" id="leadBtn" type="submit" style="margin-top:12px">Send request</button>
<div class="msg" id="formMsg" role="status" aria-live="polite"></div>
</form></section>`;
}

export interface RenderOptions {
  /** Origin BFF — куда уходит заявка. Задаётся Function из env. */
  apiOrigin: string;
  /** Origin самой страницы — для canonical/OG. */
  siteOrigin?: string;
}

export function renderProfileHtml(dto: AgentProfileDto, opts: RenderOptions): string {
  const site = opts.siteOrigin ?? SITE_ORIGIN;
  const canonical = `${site}/agent/${dto.slug}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"/>
<meta name="theme-color" content="#F7F6F3" media="(prefers-color-scheme: light)"/>
<meta name="theme-color" content="#0C0D10" media="(prefers-color-scheme: dark)"/>
${metaTags(dto, canonical)}
<style>${STYLES}</style>
${jsonLd(dto, canonical)}
</head>
<body>
<div class="wrap">
<div class="top">
<a class="brand" href="${escapeHtml(site)}" rel="noopener">${sparkSvg()}<span>Lumi</span></a>
<span class="micro">Agent</span>
</div>
${heroSection(dto)}
${actionsSection(dto)}
${servicesSection(dto)}
${formSection()}
<footer>
<p class="disclaimer">${escapeHtml(AGENT_DISCLAIMER)}</p>
<a class="foot-link" href="${escapeHtml(site)}" rel="noopener">Made with Lumi</a>
</footer>
</div>
<script>${renderClientScript(opts.apiOrigin, dto.slug)}</script>
</body>
</html>`;
}

function renderStatusHtml(
  title: string,
  heading: string,
  text: string,
  siteOrigin: string,
): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${escapeHtml(title)} — Lumi</title>
<meta name="robots" content="noindex, nofollow"/>
<style>${STYLES}
.mid{min-height:70vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:12px}
</style>
</head>
<body>
<div class="wrap"><div class="mid">
${sparkSvg(34)}
<h1>${escapeHtml(heading)}</h1>
<p class="bio">${escapeHtml(text)}</p>
<a class="btn b-ghost" style="padding:0 20px" href="${escapeHtml(siteOrigin)}" rel="noopener">Go to Lumi</a>
</div></div>
</body>
</html>`;
}

/**
 * 404. Неопубликованный и несуществующий профиль отдают одну и ту же страницу —
 * ровно как BFF отдаёт им один и тот же 404 (§6): иначе страница становится
 * оракулом «slug занят, но ещё не опубликован».
 */
export function renderNotFoundHtml(siteOrigin = SITE_ORIGIN): string {
  return renderStatusHtml(
    "Page not found",
    "This page isn't here",
    "The agent's card may have been moved or taken down.",
    siteOrigin,
  );
}

/**
 * 503. Отдельная страница, а не та же, что у 404, — и это не косметика.
 *
 * Код ответа тут временный, а текст «страницы нет» сказал бы клиенту, что
 * агента не существует, хотя тот жив и просто прилёг апстрим. Клиент пришёл
 * по ссылке, которую агент разослал лично: «зайдите через минуту» и «такого
 * агента нет» — разные сообщения, и второе стоит агенту заявки.
 */
export function renderUnavailableHtml(siteOrigin = SITE_ORIGIN): string {
  return renderStatusHtml(
    "Temporarily unavailable",
    "This card is taking a break",
    "We couldn't load it just now. Please try again in a minute — the agent's page is still there.",
    siteOrigin,
  );
}
