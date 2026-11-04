---
name: add-post
description: Create a new Jekyll blog post with proper formatting and directory placement. Use when the user asks to add or scaffold a Jekyll post in this wiki.
---

# Add Post Skill

Scaffold and create a new Jekyll blog post for **Orc Hwang's Wiki** conforming to repository conventions, front-matter specifications, and directory mirroring.

## Arguments Format

```text
/add-post <title> [category1,category2] [tags-with-comma] [yyyy-mm-dd]
```

**Note**: Categories can be comma-separated for nested directory structure (e.g., `Technology,Python` creates `_posts/Technology/Python/`).

## Task Instructions

1. **Parse Arguments**:
   - Extract the post title from the initial argument(s) before category/tags.
   - Extract optional category (single like `Retrospec` or comma-separated like `Technology,Python` or `Career,Roadmap`).
   - Extract comma-separated tags (e.g., `python,django,backend`). Ensure tags are converted to lowercase-hyphenated format.
   - Extract optional date argument in `YYYY-MM-DD` format:
     - If provided, use that date.
     - If NOT provided, use today's **actual current date** in `YYYY-MM-DD` format.
     - **CRITICAL**: Never use future dates — Jekyll hides future-dated posts by default.

2. **Determine Directory Path**:
   - **No categories**: `_posts/`
   - **Single category**: `_posts/<CategoryName>/` (e.g., `_posts/Retrospec/`)
   - **Multiple categories**: `_posts/<Category1>/<Category2>/` (e.g., `_posts/Technology/Python/`)
   - Ensure the directory structure exists before writing.
   - Preserve exact category capitalization (`Technology`, `Python`, `Career`, `Roadmap`, etc.).

3. **Generate Filename**:
   - Format: `YYYY-MM-DD-<slugified-title>.md`
   - Slugify rule: lowercase, spaces replaced with hyphens, special characters removed.
   - Example: "Python Memory Structure" on 2025-10-19 → `2025-10-19-python-memory-structure.md`

4. **Create the Post File**:
   Use the canonical educational structure. **Important**: Never place standalone `---` horizontal rules between sections; headings provide visual separation.

````markdown
---
layout: post
title: "<Original Title with Proper Capitalization>"
date: YYYY-MM-DD
categories: [Category1, Category2]
tags: [tag1, tag2, tag3]
published: true
excerpt: "Brief 1-2 sentence summary of the post content."
---

## Topic Introduction

Brief overview of what this post covers and why it is important.

## Main Concept

Core principles and mechanics explained thoroughly.

### Details & Code Examples

```language
// Practical, working code snippet
```

## Practical Application & Considerations

Real-world scenarios, performance, or edge cases.

## Summary

Key takeaways from this post.

### 다음 학습 (Next Learning)

- [Related Topic 1](/YYYY/MM/DD/related-topic-1.html)
- [Related Topic 2](/YYYY/MM/DD/related-topic-2.html)
````

5. **Front Matter Rules**:
   - `layout: post` is required.
   - `title`: quoted if containing `:` or special characters.
   - `date`: must match the filename date (`YYYY-MM-DD`).
   - `categories`:
     - Single: `categories: CategoryName`
     - Multiple: `categories: [Category1, Category2]`
     - Omit line if no categories.
   - `tags`: lowercase-hyphenated array: `[tag1, tag2]`.
   - `published: true` must always be included.
   - `excerpt`: 1-2 sentence summary for SEO and previews, quoted.

6. **Optional AI-Assisted Writing Disclosure**:
   - Add this disclosure only when the author explicitly states they wrote the draft and actively adjusted the AI-assisted result. Do not infer it merely because AI was used.
   - Place it immediately after the closing YAML front-matter delimiter, before any header illustration, summary box, table of contents, or prose, so readers see it before consuming the post.
   - Use the canonical wording and blockquote format:

```markdown
> **작성 고지**
>
> 본 포스트는 AI와 함께 작성하였으며, 저자가 초안을 작성했고 적극적인 조정을 거친 결과물입니다.
```

7. **Post-Creation Verification**:
   - Report created file path and front matter.
   - Provide local preview URL: `http://localhost:4000/YYYY/MM/DD/<slug>.html`.
   - Remind to run `bundle exec jekyll build` to verify compilation.
