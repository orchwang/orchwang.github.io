# CLAUDE.md - AI Assistant Guide for Orc Hwang's Wiki

This document provides comprehensive guidance for AI assistants working on this personal wiki project.

---

## Project Overview

### Purpose

This is a **Jekyll-based personal wiki** designed for systematic development learning management. It helps developers track their learning journey using a "도장깨기" (achievement stamps) approach - marking off completed learning items like collecting stamps.

### Target Audience

Developers who want to:

- Track their learning progress systematically
- Build a knowledge base of technical topics
- Maintain a portfolio of completed learning items
- Create interconnected learning resources

### Core Philosophy

- **Progressive Learning**: Break down large topics into manageable items
- **Visual Progress**: Use checkboxes to show completion status
- **Interconnected Knowledge**: Link related posts together
- **Documentation as Learning**: Writing about topics reinforces understanding

---

## Project Architecture

### Technology Stack

- **Jekyll**: Static site generator
- **Markdown**: Content format (kramdown / GFM, Rouge syntax highlighting)
- **Liquid**: Templating language
- **JavaScript**: Client-side search, mobile menu, table of contents, Mermaid rendering
- **CSS**: Custom styling with CSS variables

### Key Features

1. **Category System**: Organize posts by major themes (Technology, Career, Language, Retrospec, BookLog), often nested (e.g. `Technology/Python`)
2. **Tag System**: Cross-reference posts by topics
3. **Series System**: Group sequential posts into a learning series (e.g. `Python-Essential`)
4. **Search**: Client-side search across all content
5. **Roadmap Tracking**: Master progress tracker with checkboxes
6. **Mermaid Diagrams**: Light/dark-aware diagram rendering with zoom (see `MERMAID_USAGE.md`)
7. **CV Integration**: Professional portfolio page with auto-calculated career duration
8. **Responsive Design**: Mobile-friendly layout

### Directory Structure

```
.
├── _config.yml              # Site configuration (incl. career_start_date)
├── _includes/               # Reusable HTML components
│   ├── header.html          # Navigation + logo + search
│   └── footer.html          # Footer content
├── _layouts/                # Page templates
│   ├── default.html         # Base layout
│   ├── post.html            # Blog post layout
│   ├── tag_page.html        # Tag listing layout
│   ├── category_page.html   # Category listing layout
│   ├── series_page.html     # Series listing layout
│   └── cv.html              # CV page layout
├── _plugins/                # Custom Jekyll plugins
│   ├── tag_generator.rb         # Auto-generate tag pages
│   ├── category_generator.rb    # Auto-generate category pages
│   ├── series_generator.rb      # Auto-generate series pages
│   └── date_filters.rb          # career_duration Liquid filter (used in CV)
├── _posts/                  # All learning posts, organized by category dirs
│   ├── Technology/Python/       # categories: [Technology, Python]
│   ├── Technology/PostgreSQL/   # categories: [Technology, PostgreSQL]
│   ├── Technology/Rust/         # categories: [Technology, Rust]
│   ├── Engineering/OO-Design/           # categories: [Engineering, OO-Design]
│   ├── Engineering/Architecture/        # categories: [Engineering, Architecture]
│   ├── Engineering/Testing-Refactoring/ # categories: [Engineering, Testing-Refactoring]
│   ├── Engineering/Process/             # categories: [Engineering, Process]
│   ├── Engineering/Craftsmanship/       # categories: [Engineering, Craftsmanship]
│   ├── Career/Roadmap/          # categories: [Career, Roadmap]
│   ├── Language/English/        # categories: [Language, English]
│   ├── Retrospec/               # categories: Retrospec (yearly retrospectives)
│   ├── BookLog/                 # categories: BookLog (reading notes)
│   ├── Articles/                # external article analyses (nested sub-categories)
│   │   ├── AI-Engineering/          # categories: [Articles, AI-Engineering]
│   │   ├── AI-Industry/            # categories: [Articles, AI-Industry]
│   │   ├── AI-Essays/              # categories: [Articles, AI-Essays]
│   │   ├── Security/               # categories: [Articles, Security]
│   │   ├── Engineering-Culture/    # categories: [Articles, Engineering-Culture]
│   │   ├── Career-Life/            # categories: [Articles, Career-Life]
│   │   └── Systems-Programming/    # categories: [Articles, Systems-Programming]
│   └── (root)                   # Posts without categories
├── assets/                  # Static files
│   ├── css/style.css        # Main stylesheet
│   ├── js/
│   │   ├── search.js            # Search functionality
│   │   ├── mobile-menu.js       # Mobile hamburger menu
│   │   ├── toc.js               # Table of contents
│   │   ├── category-tree.js     # Collapsible category tree
│   │   ├── mermaid-init.js      # Mermaid diagram init (theme-aware)
│   │   └── mermaid-zoom.js      # Mermaid diagram zoom/pan
│   └── images/              # Images and logos
├── pages/                   # Fixed pages
│   ├── cv.md                # Curriculum Vitae
│   ├── tags.md              # All tags listing
│   ├── categories.md        # All categories listing
│   └── series.md            # All series listing
├── index.html               # Home page (recent posts + quick links)
├── search.json              # Search index source
├── Makefile / serve.sh      # Local dev helpers
├── Gemfile / Gemfile.lock   # Ruby dependencies
├── CNAME                    # Custom domain (wiki.orchwang.dev)
├── README.md                # Setup and usage
├── MERMAID_USAGE.md         # Mermaid diagram authoring guide
└── .github/workflows/       # GitHub Pages build/deploy (jekyll.yml)
```

**Important Notes on Post Organization:**

- **Category Directories**: Posts are organized into directories based on their categories
- **Single Category**: `categories: Retrospec` → `_posts/Retrospec/`
- **Multiple Categories**: `categories: [Technology, Python]` → `_posts/Technology/Python/`
- **No Categories**: Posts without categories can stay in `_posts/` root
- **URL Structure**: URLs remain unchanged (`/:year/:month/:day/:title.html`) regardless of directory location
- **Jekyll Compatibility**: Jekyll natively supports subdirectories in `_posts/`

---

## Existing Content & Post Types

The `_posts/` directory currently holds **74 published posts**. They fall into a few recurring types — use these as references when writing new content.

### Curriculum / Roadmap Posts

**Examples:** `Career/Roadmap/2025-10-12-python-engineer-job-description.md`, `Technology/Python/2025-10-12-python-advanced-competency-curriculum.md`, `Technology/PostgreSQL/2025-10-28-postgresql-essential-curriculum.md`

**Purpose:** High-level learning trackers / curricula for a skill area.

- Checkbox tracking (`[x]` done, `[ ]` pending) where progress matters
- Links from each completed item to its detailed post
- Related skills grouped under clear topic headings

### Technical Deep-Dive Posts

**Examples:** `Technology/Python/2025-10-22-python-gil.md`, `Technology/Python/2025-10-19-python-memory-structure-and-object-model.md`, `Technology/PostgreSQL/2025-12-06-postgresql-architecture-deep-dive.md`

**Purpose:** In-depth explanation of a single concept.

**Typical structure:** Introduction (why it matters) → core concepts → runnable code examples → performance/complexity notes → summary + "다음 학습" (Next Learning). These usually belong to a `series` (e.g. `Python-Essential`, `PostgreSQL-Essential`, `Rust-Essential`).

### Retrospective Posts

**Examples:** `Retrospec/2024-01-01-2024-retrospec.md`, `Retrospec/2025-01-01-2025-retrospec.md`, `Retrospec/2026-01-01-2026-retrospec.md`

**Purpose:** Yearly reflections with book logs and learning summaries. One post per year, single `Retrospec` category.

### Book Log Posts

**Example:** `BookLog/2026-01-02-바이브-코딩-너머-개발자-생존법.md`

**Purpose:** Reading notes and takeaways from a book. Single `BookLog` category.

### Article Analysis Posts

**Example:** `Articles/AI-Industry/2026-06-19-the-founders-playbook.md`

**Purpose:** Analyse and introduce a single external article (one post per article). Nested `Articles` category — every post gets exactly one sub-category (`[Articles, <Sub>]`) and lives in the matching directory; no series, no banner. Managed by the **`article-manager` subagent**: given an article URL, it fetches the piece, classifies it into a sub-category (or recommends a new one when nothing fits), and writes a Korean analysis/intro post. Structure: 원문 정보 → TL;DR → 왜 골랐나 → 핵심 내용 → 분석과 인사이트 → 적용 포인트 → 더 읽어보기. `article-manager` writes the *prose* and leaves `<!-- ILLUSTRATION(…) -->` briefs, then hands the **visuals** off to the **`post-illustrator` subagent** (see below).

### Language Learning Posts

**Examples:** `Language/English/2026-01-03-reading-and-writing-in-english.md`, `Language/English/2026-01-03-how-to-read-technical-documentation.md`

**Purpose:** Notes on language learning (English), in the `Learning-English` series.

### Post Visuals — Illustrations & Charts (`post-illustrator`)

Not a post type, but a **visual pass** any post can receive. The **`post-illustrator` subagent**
reads a finished/drafted post and adds visual aids that earn their place:

- **Header illustration** — a hand-authored **inline SVG** at the top of the body (theme-aware via `currentColor` / `var(--…)` tokens), wrapped as `<figure class="post-figure post-figure--header">`. **On request** (opt-in, not automatic — it adds an external generation step), it can **propose an image-generation prompt** for a richer raster header (the user generates it externally, then it's wired as a **full `.post-figure` illustration** — shown whole, never a cropped banner). The prompt's **mandatory base concept** — dot/pixel-art platformer style · **Grom Hellscream** protagonist · **Orgrimmar** · Orc-tribe belligerence — and the full skeleton live in `ASSETS.md` ("Header-illustration image-generation prompt recipe"), the single source of truth shared by `post-illustrator` and `article-manager`.
- **Through-line chart** — one Mermaid diagram capturing the post's spine (the journey / causal chain / layered model), placed near the top or in a "한눈에 보기" subsection.
- **Explanatory illustrations** — inline-SVG concept drawings for the 1–3 hardest passages.
- **Architecture/structure diagrams** — Mermaid (`flowchart`, `sequenceDiagram`, `classDiagram`, `erDiagram`, `stateDiagram-v2`) for any system/flow/data-model the post describes.

It obeys `DESIGN.md` (no imagery behind reading text — figures sit on opaque `--bg-panel` panels; no hardcoded colors; readable in both themes; Mermaid uses the default theme + the `--mermaid-line` token like the existing 39 posts). Illustrations use the `.post-figure` figure component (owned by **`design-curator`**). It is **additive** — it never rewrites prose. Invoke with "이 포스트에 삽화/도표 넣어줘", "illustrate this post", or run it as the illustration pass after `article-manager` (which leaves `<!-- ILLUSTRATION(…) -->` briefs for it to fulfil).

---

## Content Categories

Categories mirror the `_posts/` directory layout. Most posts use a **nested two-level** category (`[Top, Sub]`); some use a single top-level category. Re-use existing categories — only introduce a new one for a genuinely new theme.

### Technology (nested)

Top-level technical category, always paired with a sub-category that names the directory: `Technology/Python`, `Technology/PostgreSQL`, `Technology/Rust`. Holds curricula and deep-dive posts; most belong to a `*-Essential` series.

### Engineering (nested)

Top-level category for software-engineering fundamentals drawn from classic books, always paired with a sub-category that names the directory: `Engineering/OO-Design`, `Engineering/Architecture`, `Engineering/Testing-Refactoring`, `Engineering/Process`, `Engineering/Craftsmanship`. Each sub-category is a completed `*-Essential` series: a master-roadmap **curriculum** post (`banner: wartable`, 도장깨기 checkboxes) plus per-book **stage** deep-dives. Stage posts use ascending `date` times (`00:01:00`, `00:02:00`, …) so the series page lists curriculum → stage 1 → stage 2 … in order.

### Career → Roadmap (nested)

`[Career, Roadmap]` — job descriptions, competency maps, and learning roadmaps for an engineering track.

### Language → English (nested)

`[Language, English]` — language-learning notes (currently the `Learning-English` series).

### Retrospec (single)

`Retrospec` — yearly retrospectives. One post per year.

### BookLog (single)

`BookLog` — reading notes from books.

### Articles (nested)

`Articles` — analyses and introductions of external articles (one post per article), curated via the **`article-manager` subagent**. No series, no banner. Like `Technology`/`Engineering`, it is a **nested** category: every post is filed under exactly one sub-category and lives in the matching directory.

| Sub-category | 무엇을 담나 |
| --- | --- |
| `AI-Engineering` | AI·에이전트·코딩 에이전트를 **만들고 운영하는 실무** (아키텍처, 하니스, 컨텍스트 엔지니어링, agentic 시스템, 인프라) |
| `AI-Industry` | AI가 바꾸는 **일·커리어·산업·비즈니스** (고용, 스타트업, 해자, 엔지니어의 가치) |
| `AI-Essays` | AI 시대를 보는 **관점·담론·픽션·에세이** (본질, 사고법, 비평, 균형 감각) |
| `Security` | **보안** (인증, 사회공학, 위협 모델, 방어) |
| `Engineering-Culture` | 엔지니어링 **인물·역사·문화·다큐/인터뷰** |
| `Career-Life` | **커리어·일상·소프트 스킬** (AI와 무관한 직장/삶) |
| `Systems-Programming` | **저수준·시스템 프로그래밍** 기술 심화 (동시성·병렬성, 메모리 모델, lock-free·wait-free 자료구조, 컴파일러·런타임, 성능 엔지니어링 — C/C++/Rust 등) |

The `article-manager` subagent files each new article into the best-fitting sub-category and, when an article clearly doesn't fit any existing one, **recommends a new sub-category** (English, hyphenated) for the user to confirm before creating it — keeping this table and the agent's taxonomy in sync.

**Adding a sub-category:** create the matching nested directory under `_posts/` (e.g. `_posts/Technology/Go/` or `_posts/Articles/Data-Engineering/`) and use the nested form (`categories: [Technology, Go]` / `categories: [Articles, Data-Engineering]`).

---

## Writing New Posts

### Post File Location

Posts are organized by category in directory structure:

- **No categories**: `_posts/YYYY-MM-DD-post-name.md` (root directory)
- **Single category**: `_posts/CategoryName/YYYY-MM-DD-post-name.md`
  - Example: `_posts/Retrospec/2025-10-25-my-retrospective.md`
- **Multiple categories (nested)**: `_posts/Category1/Category2/YYYY-MM-DD-post-name.md`
  - Example: `_posts/Technology/Python/2025-10-25-python-advanced.md`
  - Example: `_posts/Career/Roadmap/2025-10-25-senior-engineer.md`

**Directory Creation:**
- Always create the category directories first if they don't exist
- Use exact capitalization (Technology, Python, Career, Roadmap, Retrospec, etc.)

### Post Naming Convention

```
YYYY-MM-DD-topic-name.md
```

**Examples:**

- `_posts/Technology/Python/2025-10-15-python-decorators.md`
- `_posts/Career/Roadmap/2025-10-16-engineering-skills.md`
- `_posts/Retrospec/2025-10-17-2025-retrospective.md`

### Front Matter Template

```markdown
---
layout: post
title: "Your Post Title"
date: YYYY-MM-DD
categories: [Category1, Category2]  # or single: categories: CategoryName
tags: [tag1, tag2, tag3]
series: SeriesName  # optional
published: true
excerpt: "Brief 1-2 sentence summary for SEO and previews."
---
```

**Important Notes:**

- `layout`: Always use `post` for content posts
- `title`: Post title (use quotes if it contains special characters)
- `date`: Must be in YYYY-MM-DD format and match the filename date
  - **Always use today's actual date** (not future dates)
  - Jekyll hides future-dated posts by default
  - Example: If today is 2025-10-12, use `date: 2025-10-12`
- `categories`: Format depends on number of categories:
  - **Single category**: `categories: Retrospec` (no brackets)
  - **Multiple categories**: `categories: [Technology, Python]` (with brackets)
  - **Directory structure mirrors categories**: `[Technology, Python]` → `_posts/Technology/Python/`
  - **Omit if no categories**: Don't include the line at all
- `tags`: Use array format with square brackets `[tag1, tag2, tag3]`
- `series`: Optional field to group related posts (e.g., `series: Python-Essential`)
- `published`: Controls post visibility
  - `true` = Post appears on the site (default for all published content)
  - `false` = Draft post, hidden from builds
  - **Always include this field** when creating or updating posts
- `excerpt`: Brief 1-2 sentence summary for SEO and post previews (always include)
- `banner`: *(optional)* set `banner: wartable` on roadmap/curriculum posts to render the
  war-council header banner. See `DESIGN.md` §5 and `ASSETS.md`.
- `image`: *(optional)* per-post social/OG image path; falls back to the site default
  (Orgrimmar) when omitted.

### Content Structure Template

> **Note:** Do not use standalone `---` horizontal rules between sections — let headers provide separation (see "For Markdown Formatting" below). Existing posts follow this convention.

````markdown
---
layout: post
title: "Topic Name: Subtitle"
date: YYYY-MM-DD
categories: [Technology, Python]
tags: [tag1, tag2, tag3]
series: Python-Essential
published: true
excerpt: "Brief 1-2 sentence summary for SEO and previews."
---

## Topic Introduction

Brief overview of what this post covers and why it's important.

## Main Section 1

### Subsection

Content with examples...

```code
// Code examples
```

## Main Section 2

More detailed content...

## Practical Examples

### Example 1

Real-world use case...

## Summary

Key takeaways from this post.

### 다음 학습 (Next Learning)

- [Related Topic 1]
- [Related Topic 2]
- [Advanced Topic]
````

### Cross-Linking Posts

**Internal Links Format:**

```markdown
[Link Text](/YYYY/MM/DD/post-title.html)
```

**Example:**

```markdown
Learn more about [Python GIL](/2025/10/22/python-gil.html)
```

**When to Link:**

- From roadmap to detailed posts
- Between related topics
- From basic to advanced concepts
- In "Next Learning" sections

---

## AI Assistant Workflow

### When Adding New Learning Posts

1. **Create the post** with proper naming and front matter
   - Include all required fields: `layout`, `title`, `date`, `categories`, `tags`, `published`
   - Set `published: true` for posts ready to be displayed
2. **Update related roadmap** if applicable:
   ```markdown
   - [x] New Topic - [[Link to new post](/YYYY/MM/DD/new-post.html)]
   ```
3. **Update progress statistics** in roadmap
4. **Add cross-references** in related posts
5. **Verify categories and tags** are consistent

### When Updating Roadmaps

1. **Find completed items** that have associated posts
2. **Change checkbox**: `[ ]` → `[x]`
3. **Add link**: `[[Title](/YYYY/MM/DD/post.html)]`
4. **Recalculate progress**:
   ```markdown
   현재 완료한 항목: **X개**
   전체 항목: **Y개**
   진행률: **Z%**
   ```

### Maintaining Consistency

**Categories:**

- Use existing categories when possible
- New categories should be broad themes
- Avoid too many categories (keep it manageable)

**Tags:**

- Use existing tags for consistency
- Create new tags only when needed
- Use lowercase, hyphenated tags for multi-word terms (e.g., `import-system`, `coding-agent`) — matches existing posts
- Keep tags specific and meaningful

**Formatting:**

- Use Korean for main content (target audience is Korean)
- Use English for code, technical terms, and proper nouns
- Keep code examples well-commented
- Use consistent heading hierarchy

---

## Key Features to Maintain

### 1. Quick Links (바로가기)

**Location:** Home page (index.html)
**Cards:**

- 📚 태그 (Tags)
- 🗂️ 카테고리 (Categories)
- 📖 시리즈 (Series)
- 👤 CV

**Purpose:** Fast navigation to main sections

### 2. Search Functionality

**Location:** Header on all pages
**Features:**

- Real-time client-side search
- Searches title, content, and tags
- Results with highlights
- No server required (static site)

### 3. Logo and Branding

**Logo:** `assets/images/logo/orchwang.png`
**Locations:**

- Header (all pages): 50px height
- CV page: 100px width, centered
- Favicon: Multiple sizes for browsers

**Maintain:** Consistent branding across all pages

### 4. Navigation Menu

**Order:** 홈 | 카테고리 | 태그 | 시리즈 | CV
**Keep:** Same order in header and quick links

### 5. Responsive Design

- Mobile-friendly layouts
- Logo scales down on mobile
- Navigation adapts for small screens
- Touch-friendly buttons and links

---

## Best Practices

### For Roadmap Management

1. **Start broad, get specific**: Main topics → subtopics → detailed items
2. **Link everything**: Every checked item should link to a learning post
3. **Update regularly**: Review and check off items as you learn
4. **Track progress**: Keep statistics current for motivation
5. **One roadmap per domain**: Don't mix unrelated topics

### For Technical Posts

1. **Start with why**: Explain importance before diving into details
2. **Show, don't just tell**: Include working code examples
3. **Multiple examples**: Show different use cases
4. **Explain complexity**: Include time/space complexity for algorithms
5. **Link to next steps**: Guide readers to related topics

### For Knowledge Management

1. **Write as you learn**: Don't wait until you're an expert
2. **Link related content**: Build a web of knowledge
3. **Update old posts**: Improve clarity based on new understanding
4. **Use consistent formatting**: Makes content easier to navigate
5. **Tag thoughtfully**: Makes content discoverable

### For Markdown Formatting

1. **Avoid unnecessary horizontal rules**: Do not use standalone `---` between sections
   - Section headers (##, ###) provide sufficient visual separation
   - Only use `---` in YAML front matter (required for Jekyll)
   - Exception: Use `---` only when semantically necessary for special content breaks
2. **Summary boxes**: The post summary box (`<div class="post-summary-box">`) should flow directly into the first section without a separator
3. **Section transitions**: Go directly from one section header to another without horizontal rules
4. **Visual hierarchy**: Let headers, spacing, and content structure provide visual organization
5. **Consistency**: Follow the formatting style established in existing posts (e.g., Python GIL post)

---

## Common Tasks

### Adding a New Learning Post

```bash
# Use the custom command: /add-post <title> [cat1,cat2] [tags] [date]
/add-post "Python Decorators" Technology,Python "python,decorators,advanced"
```

This creates:

- Properly named file in `_posts/`
- Correct front matter
- Basic content template

### Checking Site Locally

```bash
# Start Jekyll server
make serve

# Access at http://localhost:4000
```

### Finding Content

- **By category:** Visit `/pages/categories.html`
- **By tag:** Visit `/pages/tags.html`
- **By search:** Use search box in header

---

## Current State Summary

### Existing Content

- **74 published posts** across Technology, Engineering, Career, Language, Retrospec, BookLog, and Articles
- Series in use: `Python-Essential` (11), `Rust-Essential` (10), `Process-Essential` (8), `OO-Design-Essential` (7), `Testing-Refactoring-Essential` (5), `Architecture-Essential` (5), `Craftsmanship-Essential` (5), `PostgreSQL-Essential` (3), `Learning-English` (2)
- **Engineering Essentials**: all 5 series complete (curriculum 100%) — 5 curricula + 25 stage deep-dives (30 posts) covering OO-Design, Architecture, Testing-Refactoring, Process, Craftsmanship
- Yearly retrospectives for 2024, 2025, and 2026

### Categories

- **Technology** (nested: Python, PostgreSQL, Rust): curricula + deep-dives
- **Engineering** (nested: OO-Design, Architecture, Testing-Refactoring, Process, Craftsmanship): classic-book curricula + per-book stage deep-dives
- **Career → Roadmap**: roadmaps and competency maps
- **Language → English**: language-learning notes
- **Retrospec**: yearly retrospectives
- **BookLog**: book reading notes
- **Articles** (nested: AI-Engineering, AI-Industry, AI-Essays, Security, Engineering-Culture, Career-Life, Systems-Programming): external article analyses (one post per article, via `article-manager`)

### Tags in Use (most common)

- `python`, `rust`, `engineering`, `curriculum`, `retrospec`, `postgresql`, `booklog`, `articles`, `video`
- `design-patterns`, `architecture`, `tdd`, `refactoring`, `ddd`, `oop`, `agile`, `craftsmanship`
- `memory`, `setup`, `english`, `career`, `concurrency`, `gil`, `asyncio`, `profiling`, `ownership`

### Site Features

- ✅ Category pages with auto-generation (nested category support)
- ✅ Tag pages with auto-generation
- ✅ Series pages with auto-generation
- ✅ Client-side search
- ✅ CV/portfolio page with auto-calculated career duration
- ✅ Mermaid diagram rendering (theme-aware, zoomable)
- ✅ Logo and favicon
- ✅ Responsive design
- ✅ Quick links on home page

---

## Guidelines for AI Assistants

### Do's

- ✅ Update roadmap checkboxes when completing topics
- ✅ Cross-link related posts
- ✅ Keep progress statistics current
- ✅ Use consistent categories and tags
- ✅ Always include `published: true` in post front matter
- ✅ Write clear, educational content
- ✅ Include practical code examples
- ✅ Add "Next Learning" sections
- ✅ Maintain responsive design
- ✅ Follow established naming conventions

### Don'ts

- ❌ Create new top-level categories unnecessarily (re-use Technology / Career / Language / Retrospec / BookLog)
- ❌ Skip front matter in posts
- ❌ Break existing links when renaming
- ❌ Use spaces in category or series names (use hyphens / CamelCase)
- ❌ Put a post in a directory that doesn't match its `categories`
- ❌ Ignore cross-referencing opportunities
- ❌ Leave a related roadmap/curriculum outdated after completing its topic

---

## Project Goals

This wiki aims to be:

1. **Comprehensive**: Cover all essential topics for target skill area
2. **Interconnected**: All posts link to related content
3. **Progressive**: Clear learning path from basics to advanced
4. **Maintainable**: Easy to update and extend
5. **Motivating**: Visual progress tracking encourages continued learning

---

## Last Updated

This guide reflects the project structure as of June 2026.

**Current Status:**

- Jekyll wiki fully implemented
- Category, tag, and series systems operational (with nested category support)
- 74 published posts across Technology, Engineering, Career, Language, Retrospec, BookLog, Articles
- Engineering Essentials: 5 `*-Essential` series complete (OO-Design, Architecture, Testing-Refactoring, Process, Craftsmanship) — 30 posts, all curricula at 100%
- Articles category + `article-manager` subagent: one analysis/intro post per external article (17 posts so far — AI/engineering articles plus YouTube video summaries via yt-dlp transcript extraction), now organized into 7 nested sub-categories (AI-Engineering, AI-Industry, AI-Essays, Security, Engineering-Culture, Career-Life, Systems-Programming); the subagent recommends a new sub-category when an article fits none
- Mermaid diagram rendering and zoom enabled
- Logo and branding applied
- Search functionality working
- CV page with auto-calculated career duration integrated

**Next Steps:**

- Continue adding learning posts
- Update roadmap/curriculum progress
- Build knowledge connections
- Maintain consistent quality

---

For questions or clarifications about this project, refer to:

- `README.md` - Setup and usage instructions
- `DESIGN.md` - **Design system contract** (Warsong Codex pixel-RPG: colors, typography,
  components, voice, anti-patterns). The authority for the look — do not undo it; reconcile.
- `ASSETS.md` - Image/asset pipeline (optimization recipes, naming, source→use map) +
  design extension cookbook (themed bands, opt-in banners, page ambient)
- `CHANGELOG.md` - Design/UI change history + key decisions and gotchas (v1.0.0, v2.0.0)
- `MERMAID_USAGE.md` - Mermaid diagram authoring guide
- Existing posts in `_posts/` - Content examples (e.g. `Technology/Python/2025-10-22-python-gil.md`)
