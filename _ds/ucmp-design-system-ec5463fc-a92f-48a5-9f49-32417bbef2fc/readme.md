# UCMP Design System

**UCMP — Uplus Cloud Management Platform** is LG U+'s enterprise cloud
management platform. It gives internal teams and partner companies one place to
create and govern public cloud accounts (AWS, Azure, GCP), track cloud spend,
check application security posture, manage GitHub organisations, and run
AI-assisted cloud migration. Production URL in the source repo:
`https://service.ucmp.uplus.co.kr/`.

The interface is a Korean-language enterprise console: dense, information-first,
built on a cool bluegray neutral palette with magenta (`#E30084`) used sparingly
as the LG U+ brand accent. Its own design brief states the priorities plainly —
information density first, neutral-based surfaces, magenta as accent only,
8px spacing rhythm, Korean-optimised typography.

## Products represented

| Surface | Source | What it is |
| --- | --- | --- |
| **Service console** | `apps/service` | The customer-facing app. Public home + Okta sign-in, then FinOps, cloud accounts/permissions, application security, service dashboards, migration agents, GitHub management. Recreated in `ui_kits/service-console/`. |
| **CMS back-office** | `apps/cms` | Internal operator console — system/tenant/MSP registry, task queue, RBAC, batch jobs, inventory, logs. Recreated in `ui_kits/cms-admin/`. |
| **Docs site** | `apps/docs` | Nextra/MDX guide site (`content/public-cloud/**`). Its visuals come from the Nextra default theme, not from this design system, so no UI kit was built for it. |

Two visual registers coexist and must not be mixed:

1. **Console** (authenticated, both apps) — flat, bordered, dense, near-zero shadow.
2. **Home / marketing** (the public landing and sign-in only) — translucent glass
   cards over a magenta-and-blue aurora wash with a soft-light noise layer,
   large gradient display type, springy entrance animation.

## Sources used

- **Attached codebase**: `UCMP-FE-2.0/` (pnpm + turbo monorepo, Next.js 13 app
  router, TypeScript, Tailwind, Radix, react-icons, recharts, Recoil, react-query).
  Read-only mount; not included in this project.
  - `DESIGN.md` — the product's own design-system brief (colours, type, spacing,
    component specs, do's and don'ts). Primary written source.
  - `packages/tailwind-config/tailwind.config.ts` — authoritative colour scales,
    type scale, radii, interaction-layer maths (`util/colorHandler.ts`).
  - `packages/style/` — `base/variable.css` (CSS custom properties), `globals.css`,
    `fonts/resources/PretendardVariable.woff2`.
  - `packages/ui/` — the component library (`atoms/`, `molecules/`, `organisms/`,
    `templates/`). Every component here was read from this source.
  - `packages/constant/consts/sideNavItem.ts` — navigation structure for all three
    nav trees (service, partners, CMS). `chartColors.ts` — FinOps chart palette.
  - `apps/service/public/assets/**` — brand mark, cloud provider logos, service
    screenshots, runtime icons. All copied into `assets/`.
  - `apps/service/src/app/(service)/**` — landing page, sign-in, FinOps, accounts,
    security screens; `apps/cms/src/app/**` for the back-office.
- No Figma file, slide deck, or brand guideline document was provided.

Where `DESIGN.md` and the code disagree, **the code wins** and this system follows
the code. Two notable cases: buttons are `rounded-xs` (4px), not 8px; button
heights are 32/40/52px with `text-xs/sm/sm`, not the padding-based sizes in the
prose spec.

---

## CONTENT FUNDAMENTALS

**Language.** Korean, always, in product UI. English appears only as proper nouns
and technical terms that are not translated: `Overview`, `Tenant`, `MSP`,
`FinOps`, `RBAC`, `Batch`, `Critical`, `AWS`, `Azure`, `GCP`, `Github`. Section
eyebrows on the home surface are uppercase English (`SERVICES`, `YOUR WORKSPACE`,
`FINOPS`, `SECURITY`) — that is the only place English is used decoratively.

**Register.** Two Korean politeness levels, used for different jobs:

- **–어요 / –해요** (soft, friendly) for explanation, guidance, and description.
  This is the dominant voice. Examples from the product:
  - "UCMP에서 제공하는 정보들을 조직, 서비스, 운영환경과 같은 관심 그룹별로 자유롭게 구성할 수 있어요."
  - "오래 사용하지 않은 권한은 UCMP가 안전하게 회수해요."
  - "꼭 적용해야 하는 보안 설정들이 함께 적용돼요."
- **–습니다 / –합니다** (formal) for system events, confirmations, and errors.
  - "리포트 발행이 요청되었습니다."
  - "리포트 발행 요청에 실패했습니다."
  - "현재 사용할 수 있는 서비스가 없습니다"

Never mix the two within one string.

**Person.** The product speaks about itself in the third person by name —
"UCMP가 안전하게 회수해요", "UCMP에서 클라우드를 안전하고 쉽게" — and addresses
the user with plain imperative-polite verbs ("문의해주세요", "확인하세요",
"관리하세요"). No "저희", no "당신".

**Headlines.** Short, benefit-first, no punctuation at the end.
- Hero: "UCMP에서 / 클라우드를 안전하고 쉽게"
- Section: "어떤 작업을 시작할까요?" — questions are used as invitations.
- Trust row: three two-to-four-word phrases — "통합 관리", "기본부터 안전하게", "AI 기반 전환".

**Errors and empty states** say what happened and what to do next, in that order:
"현재 사용할 수 있는 서비스가 없습니다" + "서비스 접근 권한이 필요하면 UCMP
관리자에게 문의해주세요." Validation messages are Korean, 12px, and specific
("영문 소문자, 숫자, 하이픈만 사용할 수 있어요.").

**Casing.** Korean has no case, so casing rules only bite on Latin text. Menu and
button labels keep the vendor's own casing (`Github 관리`, `FinOps`, `Tenant 관리`).
Eyebrow labels are ALL CAPS with 0.09–0.12em tracking. Nothing else is uppercased.

**Numbers.** Comma-grouped, currency-prefixed (`₩412,880,000`), tabular figures
in tables. Dates are `YYYY-MM-DD` in data and `2026년 8월` in UI labels. Periods
read as "7월 1일 ~ 7월 31일 사용 비용".

**Emoji: never.** Not in UI, not in labels, not in empty states. The one place
glyphs stand in for meaning is the trust row on the home page, and even there the
product uses lucide icons, not emoji.

**Vibe.** A calm, competent internal tool that occasionally lets its guard down.
The console is matter-of-fact and reads like an ops surface; the home page is
warm and confident, closer to a product landing page. Nothing is playful,
nothing is salesy, and nothing hedges — the copy tells you what will happen.

---

## VISUAL FOUNDATIONS

### Colour

- **Neutral first.** Almost every surface, border and label comes from the
  bluegray ramp (`#F9FAFB` → `#181A1B`). It is cool-tinted, not grey — the tint
  is what makes the console feel like UCMP rather than generic shadcn.
- **Magenta `#E30084` is an accent, not a theme.** One or two uses per page:
  count badges, the active sub-tab underline, the toggle track when on, the
  home-page sign-in outline and gradient headline. It is **never** used as a body
  text colour.
- **Black `#000000` is the default action colour.** Submit, request and confirm
  buttons are black, not magenta. This is unusual and it is the single most
  identifying trait of UCMP's UI.
- **Status colours** are used only for state: success `#00AA02`, error `#E22A21`,
  warning `#F86800`, info `#FDD600`. Status *badges* use pastel tints from the
  supporting Tailwind palette with dark text (`green-100` on `green-800`).
- **Charts are deliberately unbranded.** The FinOps series palette is pastel
  blue/pink/yellow/mint plus per-provider pastels — chosen so no series is
  mistaken for brand emphasis. Provider colours (AWS `#FF9900`, Azure `#0078D4`,
  GCP `#EA4335`) are each vendor's own CI colour.
- **Interaction layers are computed, not hand-picked.** Hover = base composited
  under `rgba(0,0,0,.06)`; pressed = `rgba(0,0,0,.12)`; disabled = base under
  `rgba(255,255,255,.6)`; dimmed = base at 60% alpha. Every `*-hover` /
  `*-pressed` token in `tokens/colors.css` was derived this way.

### Type

- **One typeface: Pretendard Variable** (weights 45–920), shipped as a single
  woff2. It exists specifically to keep Hangul and Latin on the same rhythm, and
  UCMP uses no display or mono face at all.
- **Nine fixed sizes**, 12/14/16/18/20/24/28/32/36px with paired line-heights.
  Custom sizes are explicitly forbidden by the product's own rules.
- **Four weights with one job each**: 400 body, 500 emphasis/table headers,
  600 labels + buttons, 700 headings + numbers.
- Console default is **14px** — not 16px. Tables, buttons, inputs and most labels
  all sit at 14px, captions and badges at 12px.
- The home surface breaks the scale on purpose: `clamp(2.65rem, 6.2vw, 5.35rem)`
  at weight 760 with `-0.055em` tracking, and a magenta→blue gradient clipped to
  the second line.

### Spacing & layout

- 8px rhythm, 4px as the only sub-step: 4 / 8 / 16 / 24 / 32 / 40.
- Fixed shell: **250px** sidebar rail, **52px** header strip, **1280px** content
  column with a **20px** gutter, **40px** between sections.
- Forms cap at **1024px**, modals at **700px**, side panels at **400px**.
- Desktop-first with two shrink breakpoints only: `tablet` ≤1280px (rail
  collapses, grids halve) and `mobile` ≤768px (everything stacks).
- Stat-card grids use `repeat(auto-fill, minmax(500px, 1fr))` in the product —
  wide cards, few per row.
- Fixed elements: the sidebar rail (`position: fixed`, full height) and the header.
  On the home surface the toolbar is a floating pill, not a fixed bar.

### Backgrounds

- Console: flat white (`#FFFFFF`). Sections sit on white; nested surfaces step to
  `#F9FAFB`. **Never white on white** — that rule is explicit.
- No repeating patterns, no textures, no photography anywhere in the console.
- Home surface only: three blurred radial "aurora" blobs (magenta top-right,
  cool blue left, soft magenta bottom-right) over a 145° white→neutral-50→
  neutral-100 gradient, with an SVG fractal-noise layer at 18% opacity in
  `soft-light`. This is the only gradient and the only texture in the system.
- Imagery is flat product screenshots on light backgrounds
  (`assets/landing/*.webp`) — six service illustrations, no photography, no
  people, no stock. Tone is cool and neutral; nothing is warmed, tinted or grained.

### Borders, radii, shadows

- **Borders do the separating, not shadows.** `1px solid #DCE0E5` is the default
  edge on cards, inputs, tables, dropdowns.
- Radii: **4px** buttons and checkboxes, **6px** inputs / table shells / dropdowns
  / cards (the most common value in the codebase), **8px** section cards,
  **12px** modals, **16px** large containers and home glass cards, **20px** the
  home toolbar, **9999px** toasts, chips, avatars, switches.
- Shadow ladder is short: flat (border only) → `shadow-sm` (section cards, hover)
  → `shadow-md` (dropdowns, popovers) → modal (dim scrim, no heavy shadow).
  `shadow-lg` and above are forbidden.
- Cards therefore read as: white fill, 1px `#DCE0E5` border, 6–8px radius, `p-20`,
  optional `shadow-sm`. No coloured left borders. No accent bars.
- Home glass cards add `0 1px 0 #fff inset` plus a wide soft drop shadow and
  `backdrop-filter: blur(24px) saturate(155%)`.

### Transparency & blur

Used in exactly three places, all deliberate:
1. **Toast** — `rgba(6,11,17,.8)` with `blur(8px)`, pill-shaped, bottom-centre.
2. **Modal overlay** — flat dim scrim.
3. **Home surface** — `color-mix(#fff 76%, transparent)` cards and toolbar with
   `blur(24–28px) saturate(155–175%)`.

Nothing in the console is translucent. There are no protection gradients over
imagery — text never sits on a photo.

### Motion

- Console: colour transitions at **100ms** (`transition-colors duration-100` on
  buttons), hover/focus at ~180ms, accordion and toggle at **200ms**.
- Home: card lift **320ms** `cubic-bezier(.2,.8,.2,1)`; entrance
  **520–660ms** `cubic-bezier(.22,1,.36,1)` with a 60ms stagger per card.
- Loading: skeleton pulse 2s `cubic-bezier(.4,0,.6,1)`; spinner 1s linear.
- **Nothing bounces.** No spring overshoot, no scale-up on hover. Rotation is
  limited to the spinner and a 180° chevron flip. Movement is a 1–2px translate.
- `prefers-reduced-motion`, `prefers-reduced-transparency` and `prefers-contrast`
  are all honoured on the home surface — copy that behaviour if you rebuild it.

### Interaction states

- **Hover** — darker by a 6% black overlay for solid fills; `bg-neutral-2` for
  neutral rows, table rows to `bg-neutral-1`; home cards lift 2px and take the
  card's tone colour on the border.
- **Press** — darker by a 12% black overlay. On the home surface only, a
  `scale(.975)` at 90ms.
- **Focus** — 2px magenta ring with a 1px offset on buttons; a **black border**
  on inputs (no glow). Home elements use a 3px translucent magenta outline.
- **Disabled** — composited toward white (not just opacity) for fills, plus
  `pointer-events: none`; inputs drop to 50% opacity with `not-allowed`.

### Loading

Skeletons, not spinners, for anything page- or block-sized — `#e5e7eb` blocks at
4px radius with a 2s pulse. Spinners appear only inside buttons and small inline
slots. Global scrollbars are hidden; `.show-scrollbar` opts a container back in
with a 4px translucent thumb.

---

## ICONOGRAPHY

**There is no UCMP icon font and no SVG sprite.** Icons come from npm packages
and are rendered as inline SVG at runtime, so there is nothing to copy into
`assets/`. Two libraries are in use:

- **`react-icons`** — the bulk of the UI, pulling from many families at once:
  Feather (`fi` — search, download, external-link, upload-cloud), Octicons
  (`go` — chevrons, kebab, horizontal-rule), Ionicons 5 (`io5` — close,
  eye/eye-off, search, trending-up), Ionicons 4 (`io` — arrows, info-circle,
  add-circle-outline), Font Awesome 6 (`fa6` — check, chart-pie), Bootstrap
  (`bs` — github, clipboard-check), Grommet (`gr` — refresh, apps-rounded),
  Material (`md` — account-tree), Tabler (`tb` — shield-code, sort arrows),
  Phosphor (`pi` — crown), Heroicons (`hi` — external-link), css.gg (`cg` — doc).
- **`lucide-react`** — the newer surfaces: `PanelLeftIcon`, `ChevronDown`,
  `ArrowUpRight`, `BookOpen`, `Check`, `LockKeyhole`, `Sparkles`.

Usage rules, as observed: icons render at **16px** in menus/labels and **14px**
inside `sm` buttons, inherit `currentColor`, sit in a 4px gap before their label,
and never appear without a label except in `icon-*` buttons (which always carry
`aria-label`). Icon colour tokens are `--color-icon-neutral-0…4`.

**Raster brand marks** are real files and were copied in:

- `assets/brand/ucmp-logo.svg`, `assets/brand/ucmp-mark.svg` — the UCMP mark. It
  is a rounded-square glass tile with a hairline magenta-tinted border and
  "UC / MP" stacked in Pretendard 750. The product also renders it as an inline
  SVG component (`packages/ui/atoms/logo`), which is what `Logo` reproduces.
- `assets/csp/` — AWS, Azure, GCP logos. Azure renders at 20px, the others at
  24px; this asymmetry is in the source and is intentional.
- `assets/infra/` — GitHub, EC2, EKS, MySQL, PostgreSQL, Redis, Node.js, Python,
  Spring Boot, Gradle, Maven, config-server, plus `no-data.webp` (the empty-state
  illustration).
- `assets/okta.png` — the SSO provider mark on the sign-in screen.
- `assets/landing/` — six flat service screenshots used on the marketing surface.

**Emoji and unicode-as-icon are never used.** Unicode arrows appear only as
decorative glyphs inside the home-page card affordance in this recreation; in
production that is a lucide `ArrowUpRight`.

**Substitution flagged:** because the icon set is npm-only, any consuming project
should install `react-icons` and `lucide-react`, or link them from a CDN. The
component cards and UI kits in this project draw a small number of inline stroke
glyphs (16px, 1.8 stroke) as stand-ins so they run without a bundler. They match
the source families' weight and style but are **not** the real glyphs — swap them
for the real imports in production code.

---

## Intentional additions

Everything below exists in `packages/ui`; nothing was invented. Four items are
consolidations rather than one-to-one ports, listed for honesty:

- **`StatCard`** — the product builds these inline in FinOps and security pages
  rather than as a shared component. Extracted here because every dashboard needs it.
- **`SidebarNav`** — collapses the source's 20-export shadcn `sidebar.tsx` plus
  `SideNavItems.tsx` into one presentational component with the same geometry.
- **`FormField` / `FormGroup`** — the `RequestForm` template's compound parts
  (`FormWrapper`, `FormLabel`, `InputWrapper`, `ErrorMessageBox`,
  `FormGroupContainer`, `FormGroupTitle`) reduced to two components.
- **`ErrorNotice`** — merges the source's `errorNotice` organism with the repeated
  empty-state block pattern (200px, `bg-neutral-2`, centred).

## Source families not built

Read but not ported, with reasons — ask if you need any of them:

- **Charts** (`areaChart`, `gaugeChart` beyond the donut, recharts wrappers) —
  the product delegates to recharts; only `GaugeChart` and hand-built bars are here.
- **Data-fetching organisms** (`accountSearch`, `userSearch`, `serviceSearch`,
  `searchSelect`, `applicationGradeStatistics`, `applicationSecretRemediationRate`,
  `applicationVulnerabilityRemediation`, `appSecScopeStatistics`,
  `repositoryStatistics`) — these are react-query containers, not visual primitives.
- **Radix wrappers with no distinct UCMP styling** (`accordion`, `collapsible`,
  `command`, `popover`, `sheet`, `portal`, `calendar`, `dropdown`) — `Select`,
  `Dialog`, `Tooltip` and `SidePanel` cover the visual patterns they express.
- **Legacy / deprecated** (`commonInput`, `commonModalWrapper`, `dropDownField`,
  `feedbackModal`, `snackBar`, `typewriterText`, `carousel`, `sidePanel` legacy) —
  the source marks these for removal or migration.
- **`Card`** (`atoms/card`) — a shadcn paste-in referencing `bg-card` /
  `text-card-foreground` tokens that do not exist in UCMP's Tailwind config. It is
  dead code; `SectionLayout` and `Table` are the real card surfaces.

---

## Index

**Root**
- `styles.css` — the single entry point consumers link. `@import` list only.
- `readme.md` — this file.
- `SKILL.md` — Agent Skills front matter for use outside this project.
- `thumbnail.html` — project tile.

**`tokens/`** — `fonts.css`, `colors.css`, `typography.css`, `spacing.css`,
`radius.css`, `elevation.css`, `motion.css`, `base.css`.

**`assets/`** — `fonts/PretendardVariable.woff2`, `brand/`, `csp/`, `infra/`,
`landing/`, `okta.png`.

**`guidelines/`** — 22 specimen cards feeding the Design System tab: colour
(brand, neutral, surface, text, border, status, CSP, chart, severity), type
(scale, weights, Korean+Latin, table), spacing (scale, layout metrics, radii,
elevation, motion), brand (logo, home surface, imagery, iconography).

**`components/`** — each with `.jsx`, `.d.ts`, `.prompt.md`, and one `@dsCard`
per directory.

- `core/` — **Button**, **Input**, **Select**, **Checkbox**, **ToggleSwitch**,
  **Chip**, **CSPChip** (+`CSPIcon`), **StatusBadge** (+`CountBadge`, `Tag`,
  `TabCount`), **Avatar**, **CircleLoader** (+`Skeleton`), **Logo**, **Toast**,
  **Tooltip**, **ExternalLinkButton**
- `layout/` — **SidebarNav**, **ContentLayout**, **SectionLayout**, **SubTabs**,
  **Breadcrumbs**, **Pagination**, **Dialog**, **SidePanel**
- `data/` — **Table**, **StatCard**, **DetailListItem**, **UserInfoCard**,
  **GuidePanel**, **ErrorNotice**, **GaugeChart**, **TopFiveList**
- `forms/` — **FormField** (+`FormGroup`), **KeywordSearch**, **MultiSelector**,
  **CurrencyToggle**, **DateRangePicker**

**`ui_kits/`**
- `service-console/` — home, Okta sign-in, FinOps overview, cloud accounts (with
  side panel + confirm dialog), application security, account request form.
- `cms-admin/` — system registry with add-system modal, RBAC role editor.
