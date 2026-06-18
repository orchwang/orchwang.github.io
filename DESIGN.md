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

**Page-ambient (world-map texture) tokens** (full-page background — see §5 and §8).
The page-wide ambient layer (`body::before`) is the **아제로스 세계 해도** seamless tile, a
**separate** token set from the tavern so swapping it never touches the tavern scenes.
Defined on `:root`, with `--page-ambient-opacity` / `--page-ambient-scrim` overridden in
the dark + `prefers-color-scheme` blocks:

| Token | Use |
|-------|-----|
| `--page-ambient-url` / `--page-ambient-url-sm` | The seamless Azeroth world-map tile (`pattern/azeroth-map-1024.webp` 152 KB / `-768.webp` 90 KB; `.jpg` fallback). Verified seamless (roll / 2×2 test); avg luma ≈ 0.41 (mid-tone). |
| `--page-ambient-tile` | Repeat scale — **960px** desktop (mobile re-tiles at **640px** via the 768px block). Big enough that the map reads as a **chart, not a repeating dot grid** (the maelstrom swirl no longer tiles tightly). |
| `--page-ambient-opacity` | The **single dim lever** (the scrim is now thin, so the layer opacity *is* the map): **`.32` light** (a legible warm sea-chart on parchment) / **`.38` dark** (a visible night sea-chart on the dark forge floor). Earlier `.10` / `.14` values double-attenuated the map (≈3.8% effective contribution) so only the darkest island outlines survived as **repeating dots** — fixed by raising opacity *and* thinning the scrim. |
| `--page-ambient-scrim` | A **thin** flat color wash laid **over** the repeated tile (one-color `linear-gradient` layer): **bone `rgba(231,211,171,.30)` light** tints the map toward parchment (warm, bright, low-contrast); **dark stone `rgba(18,14,12,.42)` dark** tints it toward a night sea-chart. Alpha kept **low** (was `.62`/`.74`) so the islands/sea actually show through, while still pulling the texture toward page-tone so **section titles on the page bg stay readable** (`.recent-posts h2` / `.quick-links h2` clear WCAG AA against the worst-case textured pixel: **4.6:1 light / 5.9:1 dark**). Light reads clearly bright, dark clearly dark — the toggle flips the room. No blur, no scale, no `background-attachment: fixed`; static tile → no motion. |

**Tavern / scene tokens** (interior environment art — see §5 and §8). Defined on
`:root`, with `--ambient-bg-url` overridden in the dark + `prefers-color-scheme` blocks.
These drive the **tavern scenes only** (footer / 404 / series-day band) — they are **not**
the page-wide texture above:

| Token | Use |
|-------|-----|
| `--tavern-day-url` / `--tavern-night-url` | The day/night tavern plate (1536 variant; `*-sm` = 1024). |
| `--ambient-bg-url` | The **active** tavern plate (day on `:root`, night in dark) — the single per-theme swap point for the footer, the series/tags day-band, and the 404. (No longer feeds the page-wide ambient layer; that is now the world-map tile.) |
| `--tavern-scrim` / `--tavern-scrim-soft` | Dark scrims for **text-bearing** tavern surfaces (footer / 404 use the firm one; the intro bands use `-soft`, ≈0.66 mid). Bone copy on either clears AA over a worst-case bright-firelight pixel (`-soft` mid ≈ **5.8:1**, footer bone ≈ **7.5:1**), with `--hero-text-shadow` as insurance. Same recipe in both themes. **Footer hardening:** the footer `::after` adds a flat `rgba(16,8,5,.34)` charred veil *under* the firm scrim, and the small brass footer links carry a tight dark text-outline halo, so even the single brightest plate pixel cannot drop them below legibility (brass link ≈ **4.2:1 light / 6.1:1 dark** worst-case). |

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
  shows first paint, no invisible text. **Both weights are `<link rel="preload">`ed in
  `<head>`** (700 = wordmark/labels, 400 = nav/meta) so the swap snap is minimal; the
  preload does not block the separate Pretendard body stylesheet.
- **Brand wordmark uses `--font-pixel` (Galmuri11), not the wide Latin face.** Silkscreen
  is inherently wide and tracked badly on the `Orc Hwang's Wiki` apostrophe + spaces;
  Galmuri11 is more compact, has tighter rhythm, and covers Hangul/symbols, so it wins on
  legibility. `.site-title`: `24px` desktop / `19px` mobile, `letter-spacing -0.02em`
  (`-0.03em` mobile), weight 700, brass with a crimson side-edge. The pixel flavor is the
  crimson war-banner edge, not a wide Latin glyph.
- **`--font-pixel-latin`:** `"Silkscreen", "VT323", monospace` (Google Fonts, Latin-only)
  — optional flavor for purely-Latin *decorative numerals* only (e.g. the big `404` code).
  Never used for the wordmark or where Hangul can appear.
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

All **chrome** panels share the **pixel-frame recipe**: `--bg-light` fill, `2px solid
--border-strong` outline, inner `--border-color` bevel, hard `4px 4px 0 --shadow-color`
shadow, square corners (radius 0–2px max).

**Reading-surface exception (`.post`, `.cv-page`).** The two long-form reading panels are
the only surfaces that *soften* the recipe: `--bg-panel` fill, a `2px solid --border-color`
**mid-bronze** frame (not the charred `--border-strong`), and a soft `2px 3px 8px
rgba(0,0,0,.18)` offset+blur shadow instead of the hard `4px 4px 0`. This keeps long
reading sessions calm. Chrome (banners, cards, badges, footer, summary box, series banner,
TOC, category tree) **keeps the hard charred frame** — the bold identity is intact; only
the reading plate is eased.

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
- **Roadmap/curriculum post banner (`.post-banner`, `banner: wartable` opt-in)** — a
  **war-council** strip (the 작전 지도 앞 전쟁 회의 scene) in the post *header*. The 도장깨기
  roadmap is a conquest plan, so curricula/roadmaps open on the operations room. **Opt-in
  by front matter:** `_layouts/post.html` renders it only when `page.banner == 'wartable'`,
  so it never touches ordinary deep-dive posts. Markup is a `<picture>` (war-table webp
  `srcset` 640/1024/1536 + `sizes="(max-width:800px) 100vw, 800px"`, JPG fallback
  `wartable.jpg`, `loading="lazy"`, `decoding="async"`) as `.post-banner-media`
  (`z-index:-2`), a `.post-banner-scrim` (`--wartable-scrim`, `z-index:-1`), and a short
  Galmuri11 `.post-banner-caption` ("⚔️ 전쟁 회의 — 다음 정복 대상을 정하라") bottom-anchored. Framed
  in the same crimson+brass war inset as the chrome; bone caption on the scrim +
  `--hero-text-shadow` clears AA in both themes. **CHROME ONLY — it lives in `.post-header`,
  above the opaque `--bg-panel` reading body, and must never bleed into `.post-content`.**
  The scene is dark, so a single `--wartable-*` plate works in both themes (no day/night
  pair); not preloaded (below the fold for any roadmap that has a TOC/lead paragraph above
  it on screen — and never the LCP since it is opt-in chrome). Applied to four roadmap/
  curriculum posts as the opt-in proof: the two `Career/Roadmap` posts, the Python advanced
  competency curriculum, and the PostgreSQL essential curriculum.

### Environment & ambient (page texture + interior tavern)

Chrome-only scene art. **Reading bodies (`.post`, `.cv-page`) are opaque `--bg-panel`
panels that float above all of this**, so legibility cost is zero. The page-wide texture
is the world-map tile (`--page-ambient-*`); the tavern scenes swap their plate via
`--ambient-bg-url` (see §1, §8). All bone copy on a tavern plate uses a `--tavern-*`
scrim + `--hero-text-shadow` and clears AA.

- **Page-wide ambient texture (`body::before`) — 아제로스 세계 해도 (world-map tile).** A single
  `position: fixed` layer at `z-index: -10`: the seamless Azeroth map tile
  (`--page-ambient-url`, mobile uses `-url-sm`) **repeated full-bleed** at
  `--page-ambient-tile` (**960px** desktop / **640px** mobile — large enough that the map
  reads as a chart, not a dot grid), under a **thin** flat one-color `--page-ambient-scrim`
  wash, with `--page-ambient-opacity` as the **single dim lever**. **No blur, no scale, no
  gutter gating** — because it tiles, it covers the *whole* viewport (mobile included),
  kept legible-but-quiet by the opacity + the theme scrim. **Theme is the point** (mid-tone
  tile, avg luma ≈ 0.41): light = a legible warm sea-chart on parchment (`.32` opacity,
  thin bone scrim `rgba(231,211,171,.30)`); dark = a darkened night sea-chart (`.38`
  opacity, thin dark-stone scrim `rgba(18,14,12,.42)`) — the toggle visibly flips it. The
  scrim alpha is **thin** so the islands/sea actually show through; the earlier `.10`/`.14`
  opacity + `.62`/`.74` scrim **double-attenuated** the map (≈3.8% effective) so only the
  darkest island outlines survived as repeating dots. Section titles painted on the page bg
  (`.recent-posts h2` "최근 출정 기록", `.quick-links h2` "전쟁 캠프 바로가기") still clear
  WCAG AA over the worst-case textured pixel (**4.6:1 light / 5.9:1 dark**). Static tile → no motion, so no `prefers-reduced-motion` guard. CSS background →
  naturally **lazy**, never preloaded; no `background-attachment: fixed`. This replaced the
  old blurred-tavern-in-the-gutters ambient layer; the tavern plate now lives only in the
  footer / 404 / series-band scenes below.
- **Footer = tavern (`.site-footer`)** — the footer is the inn. `::before` paints the
  active tavern plate (`background-position: center 38%`), `::after` lays a crimson chrome
  wash + `--tavern-scrim`; bone footer text/links keep AA (each carries a black
  text-shadow). The existing "Lok'tar ogar" line now literally sits in the tavern. Same
  per-theme plate as the ambient layer.
- **Index intro bands (`.tavern-band`)** — a *contained* band at the **top of every index
  listing page**: series (`/pages/series.html` — "여기는 학습 여관"), tags
  (`/pages/tags.html` — "전리품 진열대"), and categories (`/pages/categories.html` — "원정
  지도"). Each is the same markup: `.tavern-band-media` plate + `.tavern-band-scrim` + a
  short pixel title / bone copy / axe divider, with page-specific flavor copy. Deliberately
  short and framed (crimson+brass inset) so it reads as a welcome strip, not a second hero.
  (Home is the exception — it leads straight from the hero into recent posts, no band.)
  - **Plate via modifier.** `.tavern-band--day` points `--tavern-band-img` at the tavern-day
    plate (series, tags). **`.tavern-band--wartable`** (categories) points it at the
    **war-table plate** and swaps `--tavern-band-scrim` to the firmer `--wartable-scrim` — so
    the "원정 지도" band is *literally the war table*, the same battle-map the post banner uses.
    `.tavern-band-media` reads `--tavern-band-img`; `.tavern-band-scrim` reads
    `--tavern-band-scrim` (falling back to `--tavern-scrim-soft`). The war-table scene is dark,
    so the categories band works in both themes under its scrim.
- **404 (`/404.html` → `.tavern-404`)** — root `404.html` (`layout: default`,
  `permalink: /404.html`). The **empty tavern, theme-aware**: it reads `--ambient-bg-url`
  (so light shows the day plate, dark the night plate — the swap matches the active theme,
  no longer pinned to night) under the heavier `--tavern-scrim`, which keeps the dim
  "불 꺼진 빈 여관" mood in both. Brass `404` (`--font-pixel-latin`, large = AA), Horde flavor
  copy ("이 전장엔 전리품이 없소 / 빈 잔만 남은 여관"), and a brass-coin **본진으로 귀환** home button
  (≥ 44px, crossed-axe glyph, pressed-button motion, reduced-motion-guarded).
- **Empty search (`.search-no-results`)** — when `search.js` finds nothing it renders a
  small crossed-axe `.axe-sigil` + pixel title ("빈 잔만 남은 여관") + a one-line flavor
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
  badges; parent nodes are charred-iron header bars with brass labels. Each header is a
  keyboard control: `tabindex=0` + `role="button"` + `aria-expanded` (toggled on
  open/close), Enter/Space via `keydown` (`category-tree.js`); visible focus ring from the
  global `[tabindex]:focus-visible` rule.
- **theme toggle (`.theme-toggle`)** — pixel button in banner: 🔥 던전 (to Forge) / ☀️ 여관
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
- **Banner/band intro copy is 개조식 (terse nominal), not 구어체.** The intro line of the
  index bands (series/tags/categories `.tavern-band-text`) and the war-council post-banner
  caption use concise noun-ending fragments — "탁자 위 전투 지도에 갈래갈래 뻗은 정복 영토 —
  카테고리. 첫 함락 던전 선정, 정복 경로 탐색." — **not** spoken "-소/-시오/-라" sentences.
  Pattern: *[nominal scene] — [meta term(카테고리/태그/시리즈)]. [nominal action(s)].* The
  battle-cry refrains ("Lok'tar ogar — …" subtitles) and the 404 error narrative keep the
  warlord voice; everything else trends nominal.
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
- **Social / OG image:** a global `defaults` entry in `_config.yml` feeds the Orgrimmar OG
  (`/assets/images/hero/orgrimmar-og.jpg`, 1200×630) to `jekyll-seo-tag` for every page.
  **Per-post override:** a post that sets `image: /assets/images/….jpg` in its front matter
  replaces the global for that page (page front matter beats `defaults`); posts without
  `image` fall back to the global OG. Verified via build.

### Environment art set — page texture + exterior hero + interior tavern (day/night)

The skin has **one page-wide texture** plus **three scene types**, all chrome-only (never
*above* reading text — the world-map texture sits *behind* it, under opaque panels):

- **World-map texture (전면 텍스처) — 아제로스 세계 해도.** A seamless map tile
  (`assets/images/pattern/azeroth-map-{1024,768}.webp` + `.jpg` fallback; islands, sea,
  engraved coastlines, a maelstrom swirl). Painted full-bleed behind the **whole page**
  (`body::before`), repeated at ~960px (640px mobile — big enough to read as a chart, not a
  dot grid). It is **not** a scene plate — it is a quiet background texture. Mid-tone (avg
  luma ≈ 0.41), so the theme is carried by opacity + a **thin** flat scrim
  (`--page-ambient-*`): **light = a legible warm sea-chart on parchment**,
  **dark = darkened night sea-chart**. Tokens: `--page-ambient-url` / `--page-ambient-url-sm`
  / `--page-ambient-tile` / `--page-ambient-opacity` / `--page-ambient-scrim`. Separate from
  the tavern set, so it never disturbs the footer / 404 / series / war-table scenes.

- **Hero (exterior vista)** — the cinematic Orgrimmar warlord overlook
  (`assets/images/hero/orgrimmar-hero-*`). Home hero banner + CV cover splash. The
  "outside" view of the war camp. webp variants (1536/1024/640) are encoded from the JPG
  master at **`cwebp -q 72`** (visually lossless here — verified ≈ 32.9 dB PSNR vs master,
  *closer* to the master than the previous build while ~25–34% smaller: 1536 ≈ 261 KB).
  Re-export all three sizes at the same quality so the `srcset` stays consistent.
- **Tavern (interior, day + night pair)** — the Orgrimmar inn/feast hall
  (`assets/images/tavern/tavern-{day,night}-{1536,1024,640}.webp` + `.jpg` fallback). The
  "inside" view — where the learner sits, drinks, and plans the next 출정.
- **War-council (작전 지도 / operations room)** — a dark briefing room with a round battle
  map (miniature spires, red-X target marks), the chieftain over the table, Horde banners
  and torches (`assets/images/wartable/wartable-{1536,1024,640}.webp` + `.jpg` fallback).
  **The lit center / dark edges make it text-friendly, and being a dark scene it works in
  BOTH themes under a scrim** — so it is a **single set** (no day/night pair), held quiet by
  `--wartable-scrim` (deepened a touch in the dark block). Used in **two** places: the
  **roadmap/curriculum post banner** (`.post-banner`, `banner: wartable` opt-in — a
  conquest-plan header for 도장깨기 roadmaps) and the **categories battle-map band**
  (`.tavern-band--wartable` — the "원정 지도" intro plate *is* this war table). URL tokens:
  `--wartable-url` / `--wartable-url-md` / `--wartable-url-sm`.

**Theme 1:1 mapping is the rule** — the header toggle is literally 🔥던전 / ☀️여관, so the
artwork must *change the room* with the theme:

| Theme | Plate | Mood |
|-------|-------|------|
| **Light (Orgrimmar by day)** | `tavern-day` | bright, warm, lit feast hall |
| **Dark (the Forge at night)** | `tavern-night` | dark, dramatic, vignetted; crossed-axes + skull |

The active plate is selected by a single token, **`--ambient-bg-url`**, set to
`--tavern-day-url` on `:root` and `--tavern-night-url` in both the `[data-theme="dark"]`
and `prefers-color-scheme: dark` blocks. The ambient background, the footer plate, the
index intro bands, **and the 404** all read the same token, so one swap re-skins every
interior surface and the room always matches the active theme. The 404's "불 꺼진 빈 여관"
mood comes from its heavier `--tavern-scrim`, not from forcing a particular plate.

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
- ❌ **Environment art at or above the reading body text.** The page-ambient `body::before`
  world-map tile lives at `z-index:-10` behind **opaque** panels; the reading column sits on
  an opaque `--bg-panel`, so the tile may be **legible** (the map must read *as a map*:
  `--page-ambient-opacity` ≈ `.32` light / `.38` dark, scrim always **over** the tile and
  **thin**) — but it must never raise contrast against **page-bg text** below AA. Don't
  swing back to the old double-attenuated `.10`/`.14` opacity + `.62`/`.74` scrim (that hid
  the map and left only repeating dots), and don't push the scrim so thin that a bright
  island pixel drops `.recent-posts h2` / `.quick-links h2` under AA — verify both themes by
  screenshot. Footer/band/404 tavern plates always sit under a
  `--tavern-*` scrim that holds bone copy at AA. The world-map texture is page-wide
  (mobile included), but only because it is a low-opacity *tile* — do not turn it into a
  large focal plate.
- ❌ **Bleeding the tavern day/night plate into the page-wide texture.** The page texture
  is the separate `--page-ambient-*` world-map tile; the tavern set (`--tavern-*-url`,
  `--ambient-bg-url`) drives only footer / 404 / series-day band. Do not re-point
  `body::before` at `--ambient-bg-url`, and do not re-point the tavern scenes at the map
  tile.
- ❌ Preloading the tavern plates or the world-map tile, or using
  `background-attachment: fixed` for the ambient layer — the hero is the only preloaded
  image; the ambient/footer/band backgrounds stay lazy CSS backgrounds. Decorative
  environment art must never delay the LCP.
- ❌ Breaking the **theme 1:1 mapping**: light must show `tavern-day`, dark must show
  `tavern-night` — on every interior surface, the 404 included (it follows
  `--ambient-bg-url` like the rest; its empty-inn mood comes from a heavier scrim, not a
  pinned night plate).
</content>
