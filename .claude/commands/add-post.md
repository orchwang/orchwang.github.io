---
description: Create a new Jekyll blog post with proper formatting and directory placement
---

# Add Post Command

Create a new Jekyll post for **Orc Hwang's Wiki** according to repository conventions, front-matter requirements, and category-directory mirroring.

## Arguments Format

```text
/add-post <title> [category1,category2] [tags-with-comma] [yyyy-mm-dd]
```

Categories may be comma-separated for nested directories. For example, `Technology,Python` maps to `_posts/Technology/Python/`.

## Task Instructions

1. **Parse Arguments**
   - Extract the post title.
   - Extract an optional single or comma-separated category list.
   - Convert comma-separated tags to lowercase-hyphenated form.
   - Use the supplied `YYYY-MM-DD` date or today's actual date.
   - Never use a future date; Jekyll hides future-dated posts by default.

2. **Determine Directory Path**
   - No categories: `_posts/`
   - Single category: `_posts/<CategoryName>/`
   - Multiple categories: `_posts/<Category1>/<Category2>/`
   - Create missing directories and preserve exact category capitalization.
   - The directory path must mirror the `categories` field.

3. **Generate Filename**
   - Format: `YYYY-MM-DD-<slugified-title>.md`
   - Lowercase the slug, replace spaces with hyphens, and remove unsupported special characters.
   - The filename date must match the front-matter date.

4. **Create the Post**
   - Reuse the structure of a recent post of the same type.
   - Write the main content in Korean; retain English technical terms, identifiers, and proper nouns where natural.
   - Never place standalone `---` horizontal rules between sections. Use `---` only for the YAML front-matter boundary.
   - Use this canonical educational structure when no more specific post type applies:

````markdown
---
layout: post
title: "<Original Title>"
date: YYYY-MM-DD
categories: [Category1, Category2]
tags: [tag1, tag2, tag3]
published: true
excerpt: "Brief 1-2 sentence summary of the post."
---

## Topic Introduction

Explain why the topic matters and what the post covers.

## Main Concept

Explain the core principles and mechanics.

### Details and Code Examples

```language
// Practical, working example
```

## Practical Application and Considerations

Cover real-world scenarios, performance, complexity, or edge cases.

## Summary

Summarize the key takeaways.

### 다음 학습

- [Related Topic 1](/YYYY/MM/DD/related-topic-1.html)
- [Related Topic 2](/YYYY/MM/DD/related-topic-2.html)
````

5. **Front Matter Rules**
   - `layout: post` is required.
   - Quote `title` when it contains `:` or other YAML-sensitive characters.
   - `date` must use `YYYY-MM-DD` and match the filename.
   - Use `categories: CategoryName` for one category.
   - Use `categories: [Category1, Category2]` for nested categories.
   - Omit `categories` when there is no category.
   - Use lowercase-hyphenated array form for `tags`.
   - Always include `published: true`.
   - Always include a quoted 1-2 sentence `excerpt`.

6. **Optional AI-Assisted Writing Disclosure**
   - Add this disclosure only when the author explicitly states they wrote the draft and actively adjusted the AI-assisted result. Do not infer it merely because AI was used.
   - Place it immediately after the closing YAML front-matter delimiter, before any header illustration, summary box, table of contents, or prose, so readers see it before consuming the post.
   - Use the canonical wording and blockquote format:

```markdown
> **작성 고지**
>
> 본 포스트는 AI와 함께 작성하였으며, 저자가 초안을 작성했고 적극적인 조정을 거친 결과물입니다.
```

7. **Post-Creation Verification**
   - Run `bundle exec jekyll build`.
   - Confirm the generated post exists in `_site/YYYY/MM/DD/<slug>.html`.
   - Confirm internal links resolve.
   - Report the created path, front matter, preview URL, and exercised verification.
