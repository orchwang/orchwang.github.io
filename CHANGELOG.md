# Changelog

Notable design/UI changes to the wiki. Format: [Keep a Changelog](https://keepachangelog.com/).
See [`DESIGN.md`](DESIGN.md) (design system) and [`ASSETS.md`](ASSETS.md) (asset pipeline).

## [2.1.0] — 2026-06-25

### Changed
- **Post content widened to the home-page width.** Articles now fill the default `1200px`
  `.container` (≈ 1160px usable) — the same band as the home page — instead of the old
  800px reading column. Prose, illustrations and Mermaid charts all read at full width.
- **`.post-wrapper`** is no longer a flex row with an in-flow sidebar; it fills the shared
  `.container`. The reading plate `.post-wrapper .post` sets `max-width: none` to override
  the base `.post` 800px cap (the bug that kept the body pinned at 800px).

### Added
- **On-demand outline (TOC)** — the right TOC is now a slide-out panel, **default closed**,
  opened by a right-edge `.toc-toggle` bookmark tab; closes on Esc / click-away / picking a
  section (`toc.js`). Available at all widths (no longer hidden < 1200px). Scoped to
  `#post-toc`; the CV page keeps its sticky `.cv-toc-sidebar`.

### Decisions
- Diagnosed the "too narrow" complaint as **two** problems: prose width vs. figure/chart
  width. An intermediate design kept prose at ~900px and let only figures/charts break out
  wider; the owner preferred the **whole** content at home-page width, so the breakout grid
  was dropped in favour of a single full-width reading plate. The slide-out TOC (freeing the
  old ~290px sidebar) stays — that is what makes the full width usable on every load. The
  breakout pattern can be re-layered on `.post-content` later if long lines need reining in.

## [2.0.0] — 2026-06-18

### Added
- **War-council post banner** — `banner: wartable` front-matter opt-in renders an Orgrimmar
  war-council header on roadmap/curriculum posts (4 posts opted in).
- **Category battle-map band** — the categories "원정 지도" band now uses the war-council art.
- **Azeroth world-map page ambient** — a seamless tile as the full-bleed page background,
  theme-aware (light = parchment chart / dark = night sea-chart).
- New assets: `assets/images/wartable/*`, `assets/images/pattern/azeroth-map-*`.

### Changed
- **Page ambient** replaced: the tavern gutter-scene (≥1200px only) → full-bleed Azeroth map.
- **Band/banner intro copy** 구어체 ("-소/-시오") → **개조식** (terse nominal) on
  series/tags/categories + the war-council caption.

### Fixed
- Page-ambient map was nearly invisible ("repeating dots"): a **double-attenuation** bug
  (scrim α `0.62` × layer `opacity 0.10` ≈ 3.8% image). Unwound to opacity `.32`/`.38` +
  thinner scrim + a larger 960px tile (≈ 22% image).

### Decisions
- **Token separation:** introduced `--page-ambient-*` so the page texture is independent of
  `--ambient-bg-url` / `--tavern-*` (shared by footer/404/series) — one no longer breaks the
  others. (See ASSETS.md → "Add/replace the page ambient".)

## [1.0.0] — 2026-06-18

### Added
- **"Warsong Codex" redesign** — Orgrimmar/Horde pixel-RPG skin; `DESIGN.md` rewritten as the
  authoritative contract.
- **Dark mode** — full token set + header toggle (🔥던전 / ☀️여관) + OS default. Resolves the
  prior "dark mode only restyled Mermaid" gap.
- Warlord medallion (logo crest); original **Gorehowl** axe pixel-art SVGs.
- Concept **hero** (Orgrimmar warlord), **OG/social** image, **CV** character-sheet cover.
- **Tavern (inn)** environment art day/night: theme-paired footer, 404, series band.
- Intro bands on the tags / categories index pages.

### Changed
- **Two-tier typography:** reading body Pretendard; chrome Galmuri11 (pixel, full Hangul).
  Wordmark Silkscreen → Galmuri11 for legibility.
- All hardcoded colors → `:root` tokens. **"주막" → "여관"** wording. Learning band moved from
  home → series page. Ambient dialed down; 404 made theme-aware; reading-panel frames softened.

### Removed
- `font-style: italic` on Korean text (synthetic oblique hurt legibility).

### Decisions
- **Korean reading legibility is the north star** — pixel fonts only on short chrome, never on
  body; imagery only behind opaque panels.
- Build with **rbenv Ruby 3.4.7** (`export PATH="$HOME/.rbenv/shims:$PATH"`); system Ruby 2.6
  fails (bundler 2.6.9 mismatch).

[2.0.0]: https://github.com/orchwang/orchwang.github.io/releases/tag/v2.0.0
[1.0.0]: https://github.com/orchwang/orchwang.github.io/releases/tag/v1.0.0
