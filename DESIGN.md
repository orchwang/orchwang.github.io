# DESIGN.md — Orc Hwang's Wiki

The design system contract for this Jekyll learning wiki. Structured after the
[nexu-io/open-design](https://github.com/nexu-io/open-design) 9-section `DESIGN.md`
schema. **Maintained by the `design-curator` subagent.** This file documents the
*intended* system; the implementation lives in `assets/css/style.css` (CSS-variable
driven) and the `_layouts/` + `_includes/` templates. When the two drift, reconcile them.

> Readability of long-form Korean/English technical prose and code is the north star.

## 1. Color

CSS custom properties on `:root`:

| Token | Value | Use |
|-------|-------|-----|
| `--primary-color` | `#2c3e50` | Headings, primary text emphasis, brand ink |
| `--secondary-color` | `#3498db` | Links, accents, focus, summary-box borders |
| `--accent-color` | `#e74c3c` | Sparing highlights / calls to attention |
| `--text-color` | `#333` | Body text |
| `--text-light` | `#666` | Meta, captions, muted text |
| `--bg-color` | `#fff` | Page background |
| `--bg-light` | `#f8f9fa` | Cards, code blocks, summary boxes |
| `--border-color` | `#dee2e6` | Dividers, card borders |
| `--shadow` / `--shadow-lg` | `0 2px 4px / 0 4px 8px rgba(0,0,0,.1–.15)` | Elevation |

**Contrast:** target WCAG AA (≥ 4.5:1 body, ≥ 3:1 large text). Verify `--text-light`
on `--bg-light` when used together.

**Dark mode — incomplete (known gap):** `@media (prefers-color-scheme: dark)` currently
restyles **only Mermaid** components. The `:root` palette has no dark overrides, so the
site renders light in dark mode. Full dark-mode tokens are the standing top priority.

## 2. Typography

- **Body stack:** `"Pretendard Variable", Pretendard, -apple-system, "Apple SD Gothic Neo",
  "Noto Sans KR", … sans-serif` — Korean-first, variable-weight.
- **Latin display:** `@font-face` 'BBH Sans Bogle' (latin range) for brand/latin accents.
- **Weights (variation settings):** body `400`, `strong/b` `600`, headings `700`.
- **Rhythm:** body `line-height: 1.6`; lists `1.8`.
- **Korean wrapping:** `word-break: keep-all` + `word-wrap: break-word` — do not remove;
  it prevents awkward mid-word Korean breaks.
- **Rendering:** antialiased, `text-rendering: optimizeLegibility`, `kern`/`liga` on.

## 3. Spacing

- Container: `max-width: 1200px`, horizontal padding `20px`, centered.
- Vertical rhythm in `em` relative to content (e.g. section blocks ~`2em`, list items `.5em`).
- Prefer `em`/`rem` for content spacing so it scales with type; avoid magic pixel values.

## 4. Layout

- Single-column reading column for posts; full-width chrome (header/footer).
- **Breakpoints:** `1200px` (container), `768px` (mobile layout + nav collapse).
- **Touch:** `@media (hover: none) and (pointer: coarse)` tuning; tap targets ≥ 44px.
- Header: logo (50px) + title/description + nav (`홈 | 카테고리 | 태그 | 시리즈 | CV`) + search.
- Post page: optional summary box → content → TOC (`toc.js`); CV uses centered 100px logo.

## 5. Components

- **post-summary-box** — `bg-light` gradient, 4px `--secondary-color` left border,
  8px radius, soft shadow; `h3` underlined in secondary, `h4` in secondary.
- **quick-link cards** (home) — 4 cards: 태그 / 카테고리 / 시리즈 / CV.
- **tag / category / series listings** — auto-generated pages; tag pills use secondary color.
- **category tree** (`category-tree.js`) — collapsible nested categories.
- **Mermaid** — theme-aware container with zoom/pan controls and `zoomPulse` affordance
  (see `MERMAID_USAGE.md`).
- **TOC** (`toc.js`), **mobile hamburger** (`mobile-menu.js`), **search** (header, `search.js`).

## 6. Motion

- Subtle and purposeful only. Existing: `zoomPulse` ring on Mermaid interaction
  (0.6s ease-out). Use ≤ ~200–300ms ease transitions for hovers/toggles.
- Respect `prefers-reduced-motion` (add guards when introducing new animation).

## 7. Voice & Tone

- Prose in **Korean**; code, technical terms, and proper nouns in **English**.
- Friendly, instructive, encouraging — aligned with the "도장깨기" learning philosophy.
- Headings descriptive and scannable; avoid decorative horizontal rules between sections.

## 8. Brand

- Logo: `assets/images/logo/orchwang.png` — 50px in header, 100px centered on CV, favicon set.
- Identity: a calm, technical, knowledge-base feel. Primary ink `#2c3e50` + blue `#3498db`.
- Domain: `wiki.orchwang.dev` (CNAME).

## 9. Anti-patterns

- ❌ Standalone `---` horizontal rules between content sections (headers separate sections).
- ❌ Removing `word-break: keep-all` (breaks Korean line-wrapping).
- ❌ Hardcoded colors in CSS/markup — use the `:root` tokens.
- ❌ Adding a CSS framework or build step — keep one static `style.css`.
- ❌ Shipping a feature that's unreadable/unstyled in dark mode without flagging it.
- ❌ Tap targets < 44px or links without visible focus states.
- ❌ Low-contrast text (muted-on-muted) failing WCAG AA.
