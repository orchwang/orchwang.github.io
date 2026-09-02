---
description: Create a new Jekyll blog post with proper formatting and directory placement
---

# Add Post Command

Execute the add-post workflow for: `$ARGUMENTS`

## Arguments Format
```text
/add-post <title> [category1,category2] [tags-with-comma] [yyyy-mm-dd]
```

## Instructions
1. Parse the title, category, tags, and date from `$ARGUMENTS`.
   - If date is omitted, use today's actual date (`YYYY-MM-DD`).
   - Tags must be lowercase-hyphenated.
2. Determine target path:
   - `categories: [A, B]` -> `_posts/A/B/YYYY-MM-DD-<slug>.md`
   - `categories: A` -> `_posts/A/YYYY-MM-DD-<slug>.md`
   - No category -> `_posts/YYYY-MM-DD-<slug>.md`
3. Write the post following the canonical educational structure:
   - Front matter: `layout: post`, `title`, `date`, `categories`, `tags`, `published: true`, `excerpt`
   - **Do NOT insert standalone `---` horizontal rules between content sections.**
4. Confirm creation and report the URL (`http://localhost:4000/YYYY/MM/DD/<slug>.html`).
