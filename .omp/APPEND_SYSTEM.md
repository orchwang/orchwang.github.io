# Orc Hwang's Wiki — OMP Project Instructions

This project is **Orc Hwang's Wiki** — a Jekyll-based personal learning wiki built around a "도장깨기" (achievement stamps) progressive learning philosophy.

## 1. Core Repository Architecture & Rules

- **Category & Directory Mirroring**:
  - Posts live in `_posts/<Category>/<Sub>/YYYY-MM-DD-title.md`.
  - The directory path **must strictly mirror** the `categories` field.
    - Multiple categories: `categories: [Technology, Python]` → `_posts/Technology/Python/`
    - Single category: `categories: Retrospec` → `_posts/Retrospec/`
    - No categories: `_posts/` root.
- **Date Handling**:
  - The date in front matter must match the filename date (`YYYY-MM-DD`).
  - **Never use future dates** (Jekyll hides future-dated posts by default during build).
- **Markdown Formatting**:
  - **Do NOT use standalone `---` horizontal rules between sections**. Headers (`##`, `###`) provide visual separation. `---` is reserved solely for the YAML front-matter boundary.
  - The summary box (`<div class="post-summary-box">`) flows directly into the next section.
- **Required Front Matter**:
  - `layout: post`
  - `title`: quoted if containing `:` or special characters
  - `date`: YYYY-MM-DD
  - `categories`: array for nested, scalar for single
  - `tags`: lowercase-hyphenated array (e.g. `[python, memory, garbage-collection]`)
  - `published: true`: must always be present
  - `excerpt`: 1-2 sentence preview summary, quoted
  - Optional: `series`, `banner: wartable`, `presentation: true`

## 2. Design & Visual Contract (Warsong Codex)

- **Readability first**: Legibility of long-form Korean/English technical prose and code is the highest priority.
- **Theme compatibility**: All colors must use CSS tokens (`:root`, `[data-theme]`, `currentColor`). Never hardcode hex colors that break either light or dark mode.
- **No background images behind reading text**: Illustrations sit cleanly on opaque `--bg-panel` containers.
- **Illustrations**: Use hand-authored inline SVG wrapped in `<figure class="post-figure">` with a `<figcaption>`.
- **Mermaid Diagrams**: Use the default theme without inline style overrides or hardcoded fills; the site styles lines via `--mermaid-line`. Always quote node labels containing Korean or punctuation.
- **Presentation Mode**: Opt-in slide decks are authored in `<div class="deck-source" hidden aria-hidden="true">` at the end of the post using semantic slide helpers (`deck-kicker`, `deck-lead`, `deck-cols`, etc.).

## 3. Verification & Build

- Never mark a content or layout task as complete without verifying the Jekyll build:
  ```bash
  bundle exec jekyll build
  # Or with rbenv if Ruby environment requires initialization:
  eval "$(rbenv init - bash)" && bundle exec jekyll build
  ```
- Check that output exists in `_site/` and that internal links (`/YYYY/MM/DD/<slug>.html`) resolve.

## 4. Specialized Subagents (.omp/agents/)

When delegating multi-faceted or specialized wiki tasks via the `task` tool, dispatch to the dedicated project subagents:

- `wiki-manager`: Lead maintainer for multi-subsystem planning, cross-cutting audits, and adding learning posts end-to-end.
- `article-manager`: Analyzes and introduces an external article URL into `_posts/Articles/<Sub>/` following the canonical structure.
- `post-illustrator`: Adds inline-SVG header/concept illustrations and Mermaid diagrams without rewriting author prose.
- `deck-author`: Authors opt-in fullscreen presentation slide decks (`presentation: true` + `deck-source`).
- `design-curator`: Maintains `DESIGN.md`, CSS design tokens, typography, and layout responsiveness.
- `content-reviewer`: Read-only QA reviewer checking front matter, formatting, link health, and build sanity.
- `cv-maintainer`: Maintains `pages/cv.md`, `_layouts/cv.html`, and the dynamic `career_duration` filter.
- `learning-content-expert`: Tracks roadmap checkboxes, calculates 도장깨기 progress, weaves cross-links, and designs curricula.
- `taxonomy-curator`: Validates and audits categories, tags, series, and ensures directory-category alignment.
