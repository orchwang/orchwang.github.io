# DESIGN.md — Orc Hwang's Wiki · "Warsong Codex" Horde Pixel-RPG System

The design system contract for this Jekyll learning wiki. Structured after the
[nexu-io/open-design](https://github.com/nexu-io/open-design) 9-section `DESIGN.md`
schema. **Maintained by the `design-curator` subagent.** This file is the *authority*
for the look; the implementation lives in `assets/css/style.css` (CSS-variable driven)
and the `_layouts/` + `_includes/` templates. When the two drift, reconcile them.

> **North star: readability of long-form Korean/English technical prose and code.**
> The Horde pixel-RPG skin lives in the *chrome* (nav, cards, badges, headers, banners).
> It must never touch the *reading surface*. Long Hangul body text is always Pretendard,
> always on a bright bone/parchment panel. No exceptions.

## Concept

**Orgrimmar's Warlord** — a Warcraft-Orc / Horde pixel-art war codex. The wiki owner's
nickname is *orc*, so the skin frames the learner as a **Horde warlord** (a Grom
Hellscream homage, rendered through the site's own original logo and pixel art — never
Blizzard's copyrighted images). It keeps the "도장깨기" learning frame: learning items are
**campaigns/quests**; finishing a topic is **clearing a battlefield / striking a war
seal**; a series is a **war-line / chapter**; tags are **loot chips**; counts are
**brass coin badges**.

The world is **Orgrimmar**: red-rock canyon, iron-spike palisades, leather/bone/fur, the
Horde war camp. **Light theme = Orgrimmar by day** (sun-baked clay, red rock, bone, iron,
brass). **Dark theme = the Forge at night** (ember-orange, lava glow, black iron). The
identity colours — Horde **crimson**, orc-skin **olive-green**, forged **steel/black**,
**brass/bronze**, **bone/tusk ivory** — are belligerent and warlike, but they are confined
to chrome. Delivered with thick pixel borders, hard (blur-0) drop shadows, beveled
"game-UI panel" cards, crossed-**Gorehowl**-axe motifs, and pressed-button motion —
applied with restraint so it never fights the prose.

## 1. Color

Two fully-tokenized themes. Tokens live on `:root` (Orgrimmar by day) and
`[data-theme="dark"]` (the Forge at night). A `prefers-color-scheme: dark` block mirrors
the dark tokens exactly so the site respects the OS default; a header toggle sets
`data-theme` on `<html>` (persisted in `localStorage`) to override. **Every functional
color is a token — no hardcoded hex in components.** Identity tokens (`--crimson`,
`--orc-green`, `--steel`, `--bone`, `--badge-fill`) and the original-pixel-art asset
URLs (`--axe-cross-url`, `--gorehowl-url`, `--axe-bullet-url`) also live on `:root`. When
you add a dark value, mirror it in **both** the `[data-theme="dark"]` block and the
`prefers-color-scheme` block.

### Light — Orgrimmar by day (red rock · bone · sun-baked clay · iron)

| Token | Value | Use |
|-------|-------|-----|
| `--bg-color` | `#e7d3ab` | Sun-baked clay / canyon-dust page background |
| `--bg-light` | `#f2e3c4` | Raised tan-bone panels, cards, code blocks |
| `--bg-panel` | `#fbf3df` | **Reading surface** (post/cv content) — highest legibility |
| `--bg-sunken` | `#ddc89e` | Recessed wells (code, table stripes) |
| `--ink` / `--text-color` | `#2e2418` | Body ink (dark tusk-ink) — 13.7:1 on `--bg-panel` |
| `--text-light` | `#6a5a42` | Meta, captions, muted |
| `--primary-color` | `#7a2418` | Burnt iron-red structural (headings, frames) |
| `--secondary-color` | `#2f6b34` | Deep orc-green links / accents (AA on bone) |
| `--accent-color` | `#a3201a` | Horde crimson sparing highlights / alerts (AA on bone) |
| `--crimson` | `#a30000` | Horde war-banner crimson — **chrome only** |
| `--crimson-deep` | `#6e0d0d` | Dried-blood backing |
| `--orc-green` | `#5a8a3a` | Orc-skin olive — chrome accents |
| `--steel` | `#4a4a52` | Forged steel-grey (medallion ring, axe steel) |
| `--bone` | `#efe2c4` | Tusk/bone ivory (warlord medallion fill) |
| `--gold` | `#9a6f12` | Bronze/brass — frames & edges on dark chrome |
| `--gold-bright` | `#d9a528` | Brighter brass on dark chrome (banner, footer) |
| `--badge-fill` | `#c08a14` | Coin-badge fill (AA with dark text — counts) |
| `--border-color` | `#8a6a3e` | Pixel frame borders (mid-bronze) |
| `--border-strong` | `#2a1a12` | Hard outer pixel outline (charred) |
| `--shadow-color` | `rgba(42,20,12,.85)` | Hard offset shadow ink |

### Dark — the Forge at night (ember · lava glow · black iron)

| Token | Value | Use |
|-------|-------|-----|
| `--bg-color` | `#161210` | Cold forge stone-floor background |
| `--bg-light` | `#221b16` | Raised iron panels, cards, code |
| `--bg-panel` | `#271f18` | **Reading surface** (warm dark, not pure black) |
| `--bg-sunken` | `#14100d` | Recessed wells |
| `--ink` / `--text-color` | `#ede2cf` | Body text (warm bone-white) — 12.6:1 on `--bg-panel` |
| `--text-light` | `#b6a487` | Meta, muted |
| `--primary-color` | `#f0b46a` | Ember-amber structural (headings, frames) |
| `--secondary-color` | `#e07a4a` | Lava-ember links / accents (AA on stone) |
| `--accent-color` | `#e8633a` | Hot crimson-ember highlights / alerts |
| `--crimson` | `#c21e1e` | Glowing war-banner crimson — chrome |
| `--orc-green` | `#7aac4e` | Lit orc-green — chrome accents |
| `--steel` | `#6a6a74` | Lit steel |
| `--bone` | `#2e2620` | (token value; the medallion disc stays a light bone gradient — see §5) |
| `--gold` | `#d9a528` | Brass/ember-gold |
| `--gold-bright` | `#f5c542` | Brightest forge-gold |
| `--badge-fill` | `#d9a528` | Coin-badge fill (AAA with near-black text) |
| `--border-color` | `#5a463a` | Worn-bronze frame borders |
| `--border-strong` | `#080604` | Hard outer outline (near-black) |
| `--shadow-color` | `rgba(0,0,0,.85)` | Hard offset shadow |

**Contrast (verified, computed — all reading text ≥ WCAG AA, most AAA):**
- Light reading surface (`--bg-panel #fbf3df`): ink `#2e2418` ≈ **13.7:1**; link green
  `#2f6b34` ≈ **5.8:1**; crimson accent `#a3201a` ≈ **6.8:1**; heading red `#7a2418`
  ≈ **9.1:1**; inline-code crimson on sunken ≈ **4.6:1**. Loot-chip green text ≈ 8.6:1.
- Dark reading surface (`--bg-panel #271f18`): body `#ede2cf` ≈ **12.6:1**; ember link
  `#e07a4a` ≈ **5.4:1**; accent `#e8633a` ≈ **4.9:1**; amber heading `#f0b46a` ≈ **8.8:1**.
- Brass coin-badges use `--badge-fill` (not `--gold`) so dark badge text clears AA
  (light ≈ 5.5:1 — `--gold` alone was only 3.7:1). Count digits (`.tag-count`,
  `.category-count`) use `--accent-color` (crimson), never small gold text.
- Crimson/green identity colours never sit under small body text on dark chrome unless
  the pairing was checked; the war-banner hero uses bone (`--chrome-ink`, ≈ 13.6:1) for
  copy and brass (`--gold-bright`, ≈ 7.7:1) for the wordmark.

**Banner / footer chrome:** charred black-iron (`--chrome-bg`, `#2a1512` light /
`#1a0c0a` dark) with a **crimson-over-brass war-banner edge** and a faint crimson top
wash — consistent in both themes so the masthead always reads as a Horde war banner.

**Hero / cover scrim tokens.** The core concept image (Orgrimmar warlord) is laid behind
chrome hero copy via a tokenized dark scrim so bone text always clears WCAG AA. Defined
on `:root` and overridden (deeper) in both the `[data-theme="dark"]` and
`prefers-color-scheme` blocks:

| Token | Use |
|-------|-----|
| `--hero-scrim` | Layered gradient over the image — heaviest on the **left + bottom** (where the warlord/flag sit and the text is placed). Day: `rgba(20,8,6,.86→.16)` L→R + bottom wash. Night: `rgba(8,4,3,.92→.22)` (deeper). |
| `--hero-ink` / `--hero-ink-muted` | Bone hero copy (`#f6ecd4` / muted) — ≈ **13.8:1 worst-case** over scrim+bright-sunset pixel (AAA). |
| `--hero-text-shadow` | `0 2px 6px / 0 0 2px` black — extra insurance on the image. |
| `--hero-focus-x` | `left` — `object-position` keeps the dark warlord-bearing left of the frame under the text. |

Verified: bone hero text composited over the scrim and a bright sunset highlight pixel is
**≈ 13.8:1 (light) / 15.2:1 (dark)** — well past AA (4.5) and AAA (7).

**Tavern / ambient tokens** (interior environment art — see §5 and §8). Defined on
`:root`, with `--ambient-bg-url` / `--ambient-opacity` / `--ambient-scrim` overridden in
the dark + `prefers-color-scheme` blocks:

| Token | Use |
|-------|-----|
| `--tavern-day-url` / `--tavern-night-url` | The day/night tavern plate (1536 variant; `*-sm` = 1024). |
| `--ambient-bg-url` | The **active** plate (day on `:root`, night in dark) — the single per-theme swap point for the ambient layer, footer and intro band. |
| `--ambient-opacity` / `--ambient-blur` | Ambient layer dimming (`.30` light / `.34` dark) and `blur(7px)`. Keep low — the ambient plate must stay a *texture in the gutters*, never a focal element. |
| `--ambient-scrim` | A bone-tinted (light) / stone-tinted (dark) gradient laid **over** the blurred plate so it fades toward the page bg and panels float. |
| `--tavern-scrim` / `--tavern-scrim-soft` | Dark scrims for **text-bearing** tavern surfaces (footer / 404 use the firm one; the home band uses `-soft`, deepened to 0.66+ in the mid-band). Bone copy on either clears AA over a worst-case bright-firelight pixel (`-soft` mid ≈ **5.9:1**, footer bone ≈ **8.4:1**), with `--hero-text-shadow` as insurance. Same recipe in both themes. |

## 2. Typography

**Two-tier system. The tier is chosen by *length and role*, not by theme.**

### Reading tier — Pretendard (UNTOUCHABLE)

Long-form Hangul + 한영 혼용 prose and code. Applied to `body` default, `.post-content`,
`.cv-content`, post excerpts, search results, list descriptions, blockquotes.

- **Body stack:** `"Pretendard Variable", Pretendard, -apple-system, "Apple SD Gothic
  Neo", "Noto Sans KR", … sans-serif`. Korean-first, variable-weight, matched x-height.
- **Reading rhythm (`.post-content`):** `font-size 18px`, `line-height 1.9`,
  `letter-spacing 0.02em`; keep reading line-height in the **1.8–2.0** band (Hangul is
  denser and needs a taller line). The global `body` 1.6 is for chrome only.
- **Korean wrapping:** `word-break: keep-all` + `word-wrap: break-word` — never remove;
  never `text-align: justify` Korean.
- **No italic on Korean:** Hangul has no true italic; the synthetic oblique hurts
  legibility. Emphasize with weight / color / left-border (see §9).
- **NEVER apply a pixel/bitmap font to `.post-content` / `.cv-content` body** — it
  destroys Hangul reading legibility. This is the single hardest rule in the system.

### Chrome tier — Galmuri11 (pixel, full Hangul) + Latin pixel accents

Short UI strings only: site title, nav, buttons, badges/tags, card titles, section
labels, counts, panel headers, quest-stamp labels.

- **`--font-pixel`:** `"Galmuri11", "Pretendard Variable", … sans-serif`. **Galmuri11 is
  a pixel font with full Hangul syllable-block coverage** (verified: ~500KB woff2 carries
  U+AC00–D7A3), so Korean nav/labels render in-theme. Loaded via `@font-face` from
  jsDelivr (`cdn.jsdelivr.net/npm/galmuri/dist/Galmuri11.woff2`, weights 400/700),
  matching the existing BBH-Sans-Bogle loading pattern. `font-display: swap` → Pretendard
  shows first paint, no invisible text.
- **`--font-pixel-latin`:** `"Silkscreen", "VT323", monospace` (Google Fonts, Latin-only)
  — optional flavor for purely-Latin display runs (the brand wordmark, decorative
  numerals). Never used where Hangul can appear.
- **Long Hangul titles stay readable:** post `h1`/`h2`/`h3` (reading headings) are
  **Pretendard bold**, not pixel — the pixel feel is carried by a hard offset shadow /
  left frame, not the glyphs. Only *short* chrome headings (card titles, page banners,
  section labels) take Galmuri11.
- **Pixel rendering:** chrome pixel text uses `-webkit-font-smoothing: none` /
  `image-rendering: pixelated` on sprite art only; never on body text.
- **Weights:** Pretendard via `font-variation-settings: "wght"` (400 body / 600 strong /
  700 heading). Galmuri11 ships 400 + 700.

## 3. Spacing

- Container `max-width: 1200px`, horizontal padding `20px`, centered.
- **Pixel grid:** chrome spacing snaps to a 4px base unit (4 / 8 / 12 / 16 / 24 / 32) so
  beveled edges line up crisply. Content spacing stays in `em`/`rem` so it scales with
  type (section blocks ~`2em`, list items `.5em`).
- Hard shadows offset on the grid: `4px 4px 0` (resting), `6px 6px 0` (raised). Buttons
  press by translating `+2px,+2px` and shrinking the shadow to `2px 2px 0`.

## 4. Layout

- **Reading column capped at `max-width: 800px`** (≈ 40–45 Hangul chars/line). Do not
  widen. Full-width chrome (banner/footer).
- **Breakpoints:** `1200px` (container + TOC sidebar collapse), `768px` (mobile + nav
  collapse). Touch: `(hover: none) and (pointer: coarse)`; tap targets ≥ 44px.
- **Banner header:** Horde war-banner masthead — warlord crest medallion (`--crest-size`
  56px) + brass pixel wordmark + theme toggle + pixel nav (`홈 | 카테고리 | 태그 | 시리즈 |
  CV`) styled as war-camp tiles + a search-input slot. Crimson-over-brass bottom edge.
- **Post page:** bone war-scroll panel → content → sticky TOC ("목차 / map").
  CV uses a 124px warlord-crest avatar on a character-sheet panel.

## 5. Components (Game-UI panels)

All panels share the **pixel-frame recipe**: `--bg-light` fill, `2px solid
--border-strong` outline, inner `--border-color` bevel, hard `4px 4px 0 --shadow-color`
shadow, square corners (radius 0–2px max).

### Hero / brand components (Horde)

- **Warlord portrait (`.warlord-crest`)** — the wiki's black-ink orc logo
  (`logo/orchwang.png`) framed as a **war medallion**: a light **bone radial-gradient
  disc**, a `--steel` ring, then a `--crimson` ring and a charred `--border-strong`
  outline (round). The logo image sits at 74% inside.
  - ⚠️ **The logo is black line-art** — it would vanish on the dark page. The medallion
    fixes this: the disc **stays a light bone gradient in BOTH themes** (the dark override
    only warms it to `#f3e6c8`/`#c9b488`), so the inked orc face is legible everywhere. Do
    **not** put the bare logo on a dark surface; always wrap it in `.warlord-crest`.
  - Sizing via `--crest-size`: header `56px` (`46px` mobile), home hero `104px`, CV
    `124px` (`104px` mobile). Used as: header masthead crest, home **전쟁군주 배너** hero,
    and CV **character-sheet avatar**.
- **War-banner masthead (`.site-header`)** — charred black-iron with a faint crimson top
  wash and a **crimson-over-brass** bottom edge; brass wordmark (`--font-pixel-latin`)
  with a crimson side-shadow.
- **Home hero (`.hero-banner`)** — the cinematic **전쟁군주 배너**: full-bleed core concept
  image (석양의 오그리마를 굽어보는 오크 전쟁군주) under a `--hero-scrim`, framed by the same
  inset crimson+brass war frame as the chrome. Markup is a `<picture>` (webp
  `srcset` 640/1024/1536 + `sizes="100vw"`, JPG fallback `orgrimmar-hero.jpg`,
  `fetchpriority="high"`, `decoding="async"`) layered as `z-index:-2`, a
  `.hero-banner-scrim` (`z-index:-1`), and `.hero-banner-content` holding the warlord
  crest (88px), pixel title, tagline and a crossed-Gorehowl `.axe-divider`.
  - **Copy + focus go LEFT** (`object-position: left center`, content capped to
    `min(640px, 70%)`) so the text rides the dark warlord/flag side. Bone copy on
    `--hero-scrim` + `--hero-text-shadow` → AA in both themes (mobile darkens the scrim
    evenly since the whole frame is covered).
  - **Above-the-fold:** the home page also `<link rel="preload" as="image" imagesrcset=…
    fetchpriority="high" type="image/webp">` in `<head>` (gated to `page.url == '/'`).
    No ken-burns/parallax, so no `prefers-reduced-motion` guard is needed.
- **CV cover splash (`.cv-header--cover`)** — the same concept image as a character-sheet
  banner behind the CV name + warlord-crest avatar (`<picture>` in `.cv-cover-media`
  `z-index:-2`, `.cv-cover-scrim` `z-index:-1`, `loading="lazy"` — it is below the fold).
  Name/subtitle switch to `--hero-ink` + shadow on the cover; the 124px bone-disc
  medallion avatar supplies its own contrast and harmonizes with the splash.

### Environment & ambient (interior tavern)

Chrome-only scene art. **Reading bodies (`.post`, `.cv-page`) are opaque `--bg-panel`
panels that float above all of this**, so legibility cost is zero. Theme swaps the plate
via `--ambient-bg-url` (see §1, §8). All bone copy on a tavern plate uses a `--tavern-*`
scrim + `--hero-text-shadow` and clears AA.

- **Ambient tavern background (`body::before`)** — a single `position: fixed` layer at
  `z-index: -10`: the blurred (`--ambient-blur`), dimmed (`--ambient-opacity`) tavern
  plate under `--ambient-scrim`, `transform: scale(1.06)` so blurred edges bleed past the
  viewport. **`display:none` by default; only enabled `@media (min-width: 1200px)`** where
  the 1200px container leaves gutters — the room shows in the *margins only*. Mobile (panel
  covers full width) omits it. It is a CSS background, so it is naturally **lazy** (never
  preloaded). No `background-attachment: fixed` (mobile perf) — a fixed pseudo-layer
  instead. Restraint is the whole point: low opacity + heavy blur + a scrim that fades to
  the page bg, so it never competes with the reading column.
- **Footer = tavern (`.site-footer`)** — the footer is the inn. `::before` paints the
  active tavern plate (`background-position: center 38%`), `::after` lays a crimson chrome
  wash + `--tavern-scrim`; bone footer text/links keep AA (each carries a black
  text-shadow). The existing "Lok'tar ogar" line now literally sits in the tavern. Same
  per-theme plate as the ambient layer.
- **Home intro band (`.tavern-band.tavern-band--day`)** — a *contained* tavern-day band
  **below the hero**, above the recent-posts list: `.tavern-band-media` plate +
  `.tavern-band-scrim` (`--tavern-scrim-soft`) + a short pixel title / bone copy / axe
  divider. Deliberately kept short and framed (crimson+brass inset) so it reads as a
  welcome strip, not a second hero.
- **404 (`/404.html` → `.tavern-404`)** — root `404.html` (`layout: default`,
  `permalink: /404.html`). The **empty** tavern at **night** (pinned to
  `--tavern-night-url` in both themes), heavier `--tavern-scrim`, a brass `404`, Horde
  flavor copy ("이 전장엔 전리품이 없소 / 빈 잔만 남은 주막"), and a brass-coin **본진으로 귀환**
  home button (≥ 44px, crossed-axe glyph, pressed-button motion, reduced-motion-guarded).
- **Empty search (`.search-no-results`)** — when `search.js` finds nothing it renders a
  small crossed-axe `.axe-sigil` + pixel title ("빈 잔만 남은 주막") + a one-line flavor
  prompt, on the opaque results panel (legibility unchanged).

### Gorehowl axe — original pixel-art SVG motif

Three hand-built pixel SVGs in `assets/images/pixel/` (rect-cell grid, `shape-rendering:
crispEdges`, steel + brass-edge + crimson-rune; `gorehowl.svg`/`axe-bullet.svg` use
`currentColor` for the haft so they tint when inlined):

- `gorehowl.svg` — Grom's two-handed axe (vertical). Banner/decor motif.
- `axe-cross.svg` — two crossed Gorehowl axes (war crest). Used in: section-heading
  sigil (`.recent-posts h2::before` / `.quick-links h2::before`), `.axe-divider`,
  `.post-item:hover::after` war-seal, footer `.axe-sigil`, and the back-to-top button.
- `axe-bullet.svg` — compact single axe-head. Used as the **cleared-quest stamp** (the
  checkbox `:checked` mask).
- **Back-to-top (`.scroll-top`)** — fixed crossed-axe "recall" sigil, appears after
  400px scroll (`scroll-top.js`), honours `prefers-reduced-motion`. ≥ 48px, visible focus.

### Re-skinned game-UI components

- **`.game-panel`** — base beveled UI panel mixin (cards, boxes inherit).
- **post / list cards (`.post-item`)** — **war scroll**: pixel frame, **crimson** left
  rune bar (→ brass on hover), pixel title, crossed-axe war-seal on hover, lift
  (`translate(-2px,-2px)`, shadow `6px 6px 0`).
- **quick-link cards** — **war-camp tiles**: 4 tiles (태그 / 카테고리 / 시리즈 / CV),
  pixel labels, pressed-on-hover.
- **tags (`.tag`)** — **loot chips**: orc-green-bordered pixel pills, **crimson `▪`**
  rune prefix.
- **counts (`.tag-count` / `.category-count`)** — crimson `--accent-color` digits.
  **coin-badges** (`.series-count` / `.tree-count` / `.series-position` /
  `.back-to-series`) — `--badge-fill` brass with dark text.
- **roadmap checkboxes** — **war seals**: unchecked = empty iron slot; `[x]` = **crimson
  fill with a bone Gorehowl axe-strike** (`axe-bullet.svg` CSS mask).
- **`.post-summary-box`** — **war-briefing scroll**: bone panel, gold left frame.
- **`.series-info` / series nav** — **war-line banner**; position `(n / N)` brass coin
  badge; prev/next as iron buttons.
- **`.roadmap-notice`** — **proclamation board**: amber panel.
- **category tree** — **war map**: collapsible iron-row nodes, chevron, brass coin
  badges; parent nodes are charred-iron header bars with brass labels.
- **theme toggle (`.theme-toggle`)** — pixel button in banner: 🔥 던전 (to Forge) / ☀️ 주막
  (to day); ≥ 44px, visible focus, `aria-pressed`.
- **Mermaid** — theme-aware container (zoom/pan + `zoomPulse`); frame matches panel
  recipe (see `MERMAID_USAGE.md`).
- **TOC** (`toc.js`), **mobile hamburger** (`mobile-menu.js`), **search** (`search.js`)
  — unchanged behavior, re-skinned to the pixel frame. Search's **empty state** carries
  tavern flavor (see *Empty search* above).

## 6. Motion

- **Pressed-button feel:** hover raises (`translate` + bigger hard shadow); `:active`
  presses (`translate(+2px,+2px)`, shadow shrinks). 80–160ms steps — snappy, not soft.
- Keep existing `zoomPulse` (0.6s) on Mermaid.
- **`prefers-reduced-motion: reduce`** → disable transforms/animations, keep color/shadow
  state changes only. Required guard for every new animation.

## 7. Voice & Tone

- Prose in **Korean**; code, technical terms, proper nouns in **English**.
- Instructive and encouraging, with a **Horde war-camp** flavor layered onto the
  "도장깨기" frame: 학습 = 정복/출정, 완료 = 전장 함락 / 도장깨기. A light battle-cry is OK in
  *chrome microcopy* only — e.g. the hero subtitle ("Lok'tar! …"), the footer
  ("Lok'tar ogar — 승리 아니면 죽음"), section labels ("최근 출정 기록", "전쟁 캠프 바로가기").
- **Keep it measured.** The learning content itself stays professional and clear; the
  war framing never leaks into technical body prose, and the flavor must not bury the
  actual label meaning (a "출정 기록" is still obviously "recent posts").
- Headings descriptive and scannable; no decorative `---` rules between sections.

## 8. Brand

- Logo: `assets/images/logo/orchwang.png` — a black line-art **orc warlord face** (tusks,
  angry brow, beard). **Always framed in `.warlord-crest`** (bone-disc war medallion) so
  the black ink stays legible on any background and in either theme — header crest, home
  hero banner, CV character-sheet avatar, favicon set.
- Original pixel art: the **Gorehowl** axe family (`assets/images/pixel/*.svg`) — drawn
  in-repo as rect-cell pixel SVGs, never sourced from Blizzard art. This is an *homage*
  (Grom Hellscream / Horde), built entirely from the wiki's own assets.
- Identity: **Orgrimmar's warlord codex** — red rock + bone + iron + brass by day,
  ember + lava + black iron by night, Horde crimson and orc-green throughout the chrome.
  Wordmark uses the Latin pixel face with a crimson war-banner edge; Korean chrome uses
  Galmuri11.
- Domain: `wiki.orchwang.dev` (CNAME).

### Environment art set — exterior hero + interior tavern (day/night)

The skin has **two scene types**, both chrome-only (never behind reading text):

- **Hero (exterior vista)** — the cinematic Orgrimmar warlord overlook
  (`assets/images/hero/orgrimmar-hero-*`). Home hero banner + CV cover splash. The
  "outside" view of the war camp.
- **Tavern (interior, day + night pair)** — the Orgrimmar inn/feast hall
  (`assets/images/tavern/tavern-{day,night}-{1536,1024,640}.webp` + `.jpg` fallback). The
  "inside" view — where the learner sits, drinks, and plans the next 출정.

**Theme 1:1 mapping is the rule** — the header toggle is literally 🔥던전 / ☀️주막, so the
artwork must *change the room* with the theme:

| Theme | Plate | Mood |
|-------|-------|------|
| **Light (Orgrimmar by day)** | `tavern-day` | bright, warm, lit feast hall |
| **Dark (the Forge at night)** | `tavern-night` | dark, dramatic, vignetted; crossed-axes + skull |

The active plate is selected by a single token, **`--ambient-bg-url`**, set to
`--tavern-day-url` on `:root` and `--tavern-night-url` in both the `[data-theme="dark"]`
and `prefers-color-scheme: dark` blocks. The ambient background, the footer plate, and
the home intro band all read the same token, so one swap re-skins every interior surface.
The **404** is the exception: it is pinned to `--tavern-night-url` (the *empty* tavern at
night) regardless of theme.

## 9. Anti-patterns

- ❌ **Pixel/bitmap font on `.post-content` / `.cv-content` body text** — the cardinal
  sin; wrecks Hangul reading legibility. Pixel fonts are chrome-only.
- ❌ **Crimson / orc-green / iron fills under the reading body.** The Horde war colours
  live in chrome (banners, nav, footer, card frames, badges) only. The reading surface
  (`--bg-panel`) stays bright bone/parchment with high-contrast ink in both themes.
- ❌ **The bare black-ink logo on a dark surface** — it disappears. Always wrap it in
  `.warlord-crest` (bone disc), which stays light in dark mode too.
- ❌ Standalone `---` horizontal rules between content sections.
- ❌ Removing `word-break: keep-all`, or `text-align: justify` on Korean.
- ❌ `font-style: italic` on Korean (synthetic oblique) — emphasize with
  weight/color/left-border. Horde "이탤릭" battle flavor is banned on Hangul.
- ❌ New hardcoded colors — use `:root` / `[data-theme]` tokens. (Decorative literals
  inside the pixel-art SVGs are the only exception.)
- ❌ Adding a CSS framework or build step — one static `style.css`; fonts via
  `@font-face`/CDN; pixel art via in-repo SVG.
- ❌ Shipping anything unreadable/unstyled in **either** theme (light Orgrimmar-day AND
  dark Forge-night) — verify both.
- ❌ Tap targets < 44px or controls without a visible focus state.
- ❌ Small **gold** text on bone (fails AA) — `--gold` is for dark-chrome frames/edges;
  coin-badges use `--badge-fill`; count digits use `--accent-color` (crimson).
- ❌ Decorative crossed-axe/banner flourishes so heavy they crowd the reading measure —
  chrome flourish stops at the edge of the 800px reading column.
- ❌ **Tavern / environment art behind reading body text.** The ambient `body::before`
  plate lives at `z-index:-10` behind **opaque** panels and only shows in the ≥1200px
  gutters; never raise its opacity, drop the blur/scrim, remove the panel opacity, or let
  it bleed onto mobile (it is `display:none` < 1200px). Footer/band/404 plates always sit
  under a `--tavern-*` scrim that holds bone copy at AA.
- ❌ Preloading the tavern plates, or using `background-attachment: fixed` for the ambient
  layer — the hero is the only preloaded image; the ambient/footer/band plates stay lazy
  CSS backgrounds. Decorative interior art must never delay the LCP.
- ❌ Breaking the **theme 1:1 mapping**: light must show `tavern-day`, dark must show
  `tavern-night` (the 404 is the sole exception — always the night plate).
</content>
