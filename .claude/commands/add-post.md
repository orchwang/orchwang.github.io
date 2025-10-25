---
description: Create a new Jekyll blog post with proper formatting
---

# Add Post Command

Create a new Jekyll blog post with the following arguments:

## Arguments Format

```
/add-post <title> [category1,category2] [tags-with-comma] [yyyy-mm-dd]
```

**Note**: Categories can be comma-separated for nested directory structure (e.g., "Technology,Python" creates `_posts/Technology/Python/`)

## Task Instructions

1. **Parse Arguments**:

   - Extract the post title from the first argument(s) before category/tags
   - Extract optional category (single or comma-separated like "Technology,Python" or "Career,Roadmap")
   - Extract comma-separated tags (e.g., "Python,Django,Backend")
   - Extract optional date argument in YYYY-MM-DD format
     - If date argument is provided, use that date
     - If date argument is NOT provided, use today's **actual current date** in YYYY-MM-DD format
     - **IMPORTANT**: Be careful with future dates - Jekyll hides future-dated posts by default
     - Example: If date "2024-10-12" is provided, use that date

2. **Determine Directory Path**:

   - If **no categories** provided: `_posts/`
   - If **single category**: `_posts/CategoryName/` (e.g., `_posts/Retrospec/`)
   - If **multiple categories**: `_posts/Category1/Category2/` (e.g., `_posts/Technology/Python/`)
   - **Create the directory structure if it doesn't exist**
   - Use the exact category capitalization provided

3. **Generate Filename**:

   - Format: `YYYY-MM-DD-slugified-title.md`
   - Use the date from step 1 (provided date or today's date)
   - Slugify the title:
     - Convert to lowercase
     - Replace spaces with hyphens
     - Remove special characters except hyphens
   - Example: "Analysis Python Commands" with date 2024-10-12 → "2024-10-12-analysis-python-commands.md"

4. **Create the Post File** in the appropriate category directory with this structure:

```markdown
---
layout: post
title: "<original title with proper capitalization>"
date: YYYY-MM-DD
categories: <category>
tags: [tag1, tag2, tag3]
published: true
excerpt: "Brief 1-2 sentence summary of the post content."
---

## Introduction

Brief introduction to the topic...

---

## Main Content

### Section 1

Content here...

### Section 2

More content...

---

## Key Points

- Point 1
- Point 2
- Point 3

---

## Conclusion

Summary and wrap-up...

### Next Steps

- Related topic 1
- Related topic 2
```

5. **Front Matter Rules**:

   - `layout: post` is always required
   - `title:` should be quoted if it contains special characters
   - `date:` must be in YYYY-MM-DD format
     - **Must match the date used in the filename**
     - Use the provided date argument, or today's actual date if not provided
     - Be careful with future dates - future-dated posts won't appear on the site
   - `categories:` formatting:
     - **Single category**: `categories: CategoryName` (e.g., `categories: Retrospec`)
     - **Multiple categories**: `categories: [Category1, Category2]` (e.g., `categories: [Technology, Python]`)
     - Omit the line entirely if no categories provided
     - **IMPORTANT**: Multiple categories create nested directories (Technology/Python/)
   - `tags:` should be an array format: [tag1, tag2, tag3]
   - `published: true` must always be included for posts ready to display
   - `excerpt:` should be a brief 1-2 sentence summary
     - Must be quoted
     - Describes what the post covers
     - Used for SEO and post previews
     - Always include this field by default

5. **After Creating the File**:
   - Confirm the file was created
   - Show the filename and path
   - Provide the URL where the post will be accessible using the date from the filename: `http://localhost:4000/YYYY/MM/DD/title.html`
   - Example: If created `2024-09-15-python-decorators.md`, the URL is `http://localhost:4000/2024/09/15/python-decorators.html`

## Examples

### Example 1: Multiple categories (nested directories)

```
/add-post Python Memory Management Technology,Python memory,gc,internals
```

Creates: `_posts/Technology/Python/2025-10-25-python-memory-management.md`
Front matter: `categories: [Technology, Python]`

### Example 2: Single category

```
/add-post my 2024 retrospective Retrospec retrospec,booklog 2024-12-31
```

Creates: `_posts/Retrospec/2024-12-31-my-2024-retrospective.md`
Front matter: `categories: Retrospec`

### Example 3: Career roadmap (nested)

```
/add-post Senior Engineer Competencies Career,Roadmap career,engineering,skills
```

Creates: `_posts/Career/Roadmap/2025-10-25-senior-engineer-competencies.md`
Front matter: `categories: [Career, Roadmap]`

### Example 4: Without category (root directory)

```
/add-post understanding django orm Python,Django,ORM
```

Creates: `_posts/2025-10-25-understanding-django-orm.md`
Front matter: No categories line

### Example 5: With specific date

```
/add-post python decorators Technology,Python Python,Advanced 2024-09-15
```

Creates: `_posts/Technology/Python/2024-09-15-python-decorators.md`
Front matter: `categories: [Technology, Python]`

### Example 6: Korean title with nested categories

```
/add-post 파이썬 기초 문법 Technology,Python Python,기초 2024-08-20
```

Creates: `_posts/Technology/Python/2024-08-20-파이썬-기초-문법.md`

## Important Notes

- **Category Directory Structure**:
  - **No categories**: File goes in `_posts/` root
  - **Single category** (e.g., "Retrospec"): File goes in `_posts/Retrospec/`
  - **Multiple categories** (e.g., "Technology,Python"): File goes in `_posts/Technology/Python/`
  - **Always create the directory structure first** if it doesn't exist
  - Use exact capitalization as provided (Technology, Python, Career, Roadmap, etc.)

- **Date Handling**:
  - If date argument is provided in YYYY-MM-DD format, use that exact date
  - If date argument is NOT provided, use today's actual current date (not future dates)
  - Jekyll hides future-dated posts by default
  - Backdating posts is allowed by providing a past date

- **Front Matter**:
  - Keep the original title case in the front matter
  - Single category: `categories: CategoryName` (no brackets)
  - Multiple categories: `categories: [Category1, Category2]` (with brackets)
  - If category is not provided, omit the `categories:` line entirely
  - Tags should always be provided (at least one tag): `tags: [tag1, tag2]`
  - **Always include `published: true`** in the front matter
  - **Always include `excerpt:`** field with a brief 1-2 sentence summary for SEO and post previews

- **File Naming**:
  - Slugify the title for the filename (lowercase, hyphens)
  - The filename date and front matter date must match
  - The post will be automatically picked up by Jekyll when the server is running

- **URL Structure**:
  - URLs remain unchanged regardless of directory structure
  - All posts use: `/:year/:month/:day/:title.html`
  - Example: `_posts/Technology/Python/2024-09-15-python-decorators.md` → `/2024/09/15/python-decorators.html`
