# ASSETS.md — Image & Asset Pipeline + Extension Cookbook

Operational guide for adding/optimizing visual assets and extending the **Warsong Codex**
design. The design *rules* live in [`DESIGN.md`](DESIGN.md); this file is the *how-to*.
History and decisions are in [`CHANGELOG.md`](CHANGELOG.md).

> North star (from DESIGN.md): **Korean reading legibility.** Imagery lives in the *chrome*
> and *behind opaque panels* — never under reading-body text.

## Directory layout

```
assets/images/
  hero/      orgrimmar-hero-{640,1024,1536}.webp + .jpg  · orgrimmar-og.jpg   (concept hero + OG)
  tavern/    tavern-day-* · tavern-night-*               (inn scene, day=light / night=dark)
  wartable/  wartable-{640,1024,1536}.webp + .jpg        (war-council scene)
  pattern/   azeroth-map-{768,1024}.webp + .jpg          (seamless world-map tile)
  pixel/     gorehowl.svg · axe-cross.svg · axe-bullet.svg (original pixel-art motifs)
  avatar/    front-orc.webp+png · laugh · struggling · soap · side · yawn · crying · santa  (orc mascot expression set)
  logo/      orchwang.png                                (original line-art mark, source)
  favicon/   regenerated from avatar/front-orc.png
```

**Source masters** (original full-res PNGs) are **not committed** — keep them locally
(they were generated into `~/Downloads`). Restore the master if you need to re-encode.

## Source → use map

| Master (concept) | Repo files | Used by |
|---|---|---|
| Orgrimmar warlord vista | `hero/orgrimmar-hero-*` | Home hero, CV cover |
| ↳ cropped 1200×630 | `hero/orgrimmar-og.jpg` | OG/social (site default) |
| Inn feast — bright | `tavern/tavern-day-*` | Series 여관 band, footer & 404 (light theme) |
| Inn feast — dark | `tavern/tavern-night-*` | Footer & 404 (dark theme) |
| Grom war-council | `wartable/wartable-*` | Roadmap/curriculum post banner (`banner: wartable`), category band |
| Azeroth world map (tile) | `pattern/azeroth-map-*` | Page-wide ambient `body::before` (theme-aware) |
| Hand-authored SVG | `pixel/*.svg` | Heading sigils, dividers, checkbox stamp, scroll-top |
| Orc mascot set (B&W line-art) | `avatar/*-orc.webp` (+ `front-orc.png`) | Crest=`front`, hero=`laugh`, 404=`struggling`, empty-state=`soap`, footer=`side`, empty-search=`yawn`; `crying` spare; `santa` seasonal |
| Logo | `logo/orchwang.png` | Original line-art mark (kept; chrome uses the avatar bust) |

**Avatar pipeline:** masters in `~/Downloads/orc-avatars/` (mixed white-bg JPEG + transparent PNG).
**Transparent + size-normalized** in one pass — flatten to white (fills any interior holes,
incl. the `side` source's gaps), floodfill only the *exterior* white back to transparent, then
trim + re-pad to a uniform 512² canvas so every head is the same height/centered:

```
magick SRC -background white -alpha remove -alpha off \
  -alpha set -bordercolor white -border 1 -fuzz 10% -fill none -draw "alpha 0,0 floodfill" -shave 1x1 \
  -trim +repage -resize x410 -background none -gravity center -extent 512x512 /tmp/x.png
cwebp -q 90 -alpha_q 92 /tmp/x.png -o avatar/NAME-orc.webp
```

The result is **transparent** black line-art; CSS frames it circular (`.orc-portrait` /
`.warlord-crest`, `border-radius: 50%`) on a light `--portrait-bg` interior (theme-independent),
so the linework reads in both themes. The flatten-then-floodfill order is load-bearing — a plain
corner floodfill leaves interior holes (the `side` face leaked without it). Favicon: regenerate
from `avatar/front-orc.png` flattened white (`-define icon:auto-resize=16,32,48`). Seasonal
`santa-orc` is swapped in December by `assets/js/seasonal.js` on `<picture data-santa>`.

## Recipes (ImageMagick `magick` + `cwebp`)

### Scene / banner image (hero, tavern, wartable)
Responsive WebP (640/1024/1536) + a JPEG fallback:
```bash
for w in 1536 1024 640; do
  magick SRC.png -resize ${w}x -quality 78 -define webp:method=6 OUT-${w}.webp
done
magick SRC.png -resize 1536x -quality 82 -sampling-factor 4:2:0 -strip OUT.jpg
```
- Quality **78–80** for scenes. Markup: `<picture><source type="image/webp" srcset … sizes><img …(jpg fallback)></picture>`.
- `loading="lazy"` for below-the-fold; only the above-the-fold **hero** gets `fetchpriority="high"` + a `<link rel="preload" as="image" imagesrcset=…>`.

### OG / social image
1200×630 (1.91:1), **JPEG** (safest for social), cropped to keep the subject:
```bash
magick SRC.png -resize 1200x -gravity North -crop 1200x630+0+50 +repage -quality 85 -strip OUT-og.jpg
```
Wire via `_config.yml` `image:` (path/width/height/alt) → `jekyll-seo-tag` emits an absolute
`og:image`. Per-post override: add `image: /path.jpg` to that post's front matter.

### Seamless tile (page-ambient texture)
Smaller WebP, repeated as a CSS background behind opaque panels:
```bash
magick SRC.png -resize 1024x -quality 72 -define webp:method=6 OUT-1024.webp
magick SRC.png -resize 768x  -quality 72 -define webp:method=6 OUT-768.webp
```
- **Verify seamlessness first:** roll test `magick SRC -roll +768+512 test.png` (a center cross
  reveals edge seams) + a 2×2 tile preview.
- **CSS tile size matters:** too small → the repeat reads as "dots". The map uses **960px**
  desktop / **640px** mobile.

### Shrink an existing webp
```bash
cwebp -q 72 master.png -o OUT.webp     # the hero set was re-encoded this way (-25–34%)
```

## Build / preview (rbenv gotcha)
Use the **rbenv Ruby 3.4.7**, not system Ruby 2.6:
```bash
export PATH="$HOME/.rbenv/shims:$PATH" && bundle exec jekyll serve   # or build
```
System `/usr/bin/bundle` lacks bundler 2.6.9 → `Gem::GemNotFoundException`. Permanent fix:
`echo 'eval "$(rbenv init - zsh)"' >> ~/.zshrc && exec zsh`.

## Extension cookbook

### Add a themed intro band to a page (like series/tags/categories)
1. Reuse the `.tavern-band` markup (see `pages/series.md`): `-media` + `-scrim` + pixel
   `-title` + `axe-divider`.
2. For a custom image, add a **modifier class** + `--<name>-url` / `--<name>-scrim` tokens,
   mirrored in **all three** theme blocks (`:root`, `[data-theme="dark"]`,
   `prefers-color-scheme: dark`).
3. Copy is **개조식** (terse nominal), per DESIGN.md §7 — not "-소/-시오" 구어체.

### Add an opt-in post banner (like `banner: wartable`)
1. `_layouts/post.html` `.post-header` renders `{% if page.banner == 'X' %}` → `<picture>`
   banner + scrim + caption.
2. Opt a post in: front matter `banner: wartable`.
3. The banner is **chrome** (header) — never inside `.post-content` (reading body stays
   Pretendard on an opaque panel).

### Add / replace the page-wide ambient
- The full-bleed texture is `body::before` using **`--page-ambient-*` tokens only**.
- ⚠️ **Do NOT repoint `--ambient-bg-url` / `--tavern-*`** — those are shared by the footer,
  404 and series band; changing them re-skins those scenes. Use a separate token set.
- ⚠️ **Double-attenuation trap:** a scrim alpha *and* a layer `opacity` multiply. Keep the
  effective image visible (the map uses opacity `.32`/`.38` + scrim `~.30`/`.42`; the bug we
  fixed was `.62 × .10 ≈ 3.8%` → invisible "dots").

### Non-negotiables (enforced by DESIGN.md §9)
- Reading body = Pretendard on opaque `--bg-panel`. Never put imagery behind reading text.
- Pixel fonts (Galmuri11 / Silkscreen) only on **short chrome**; never on Korean body.
- No `font-style: italic` on Korean (synthetic oblique).
- WCAG AA for any text over imagery (scrim + `text-shadow`); tap targets ≥ 44px; respect
  `prefers-reduced-motion`.
