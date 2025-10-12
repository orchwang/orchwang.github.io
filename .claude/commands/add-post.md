---
description: Create a new Jekyll blog post with proper formatting
---

# Add Post Command

Create a new Jekyll blog post with the following arguments:

## Arguments Format

```
/add-post <title> [category] [tags-with-comma]
```

## Task Instructions

1. **Parse Arguments**:

   - Extract the post title from the first argument(s) before category/tags
   - Extract optional category (single word like "Roadmap", "Tutorial", "Study")
   - Extract comma-separated tags (e.g., "Python,Django,Backend")
   - Get today's **actual current date** in YYYY-MM-DD format
     - **IMPORTANT**: Use the real current date (e.g., 2024-10-12), not a future date
     - Jekyll hides future-dated posts by default

2. **Generate Filename**:

   - Format: `YYYY-MM-DD-slugified-title.md`
   - Slugify the title:
     - Convert to lowercase
     - Replace spaces with hyphens
     - Remove special characters except hyphens
   - Example: "Analysis Python Commands" → "2025-10-12-analysis-python-commands.md"

3. **Create the Post File** in `_posts/` directory with this structure:

```markdown
---
layout: post
title: "<original title with proper capitalization>"
date: YYYY-MM-DD
categories: <category>
tags: [tag1, tag2, tag3]
published: true
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

4. **Front Matter Rules**:

   - `layout: post` is always required
   - `title:` should be quoted if it contains special characters
   - `date:` must be in YYYY-MM-DD format
     - **Must be today's actual date** (not future dates)
     - Future-dated posts won't appear on the site
   - `categories:` is optional (omit the line if not provided)
   - `tags:` should be an array format: [tag1, tag2, tag3]
   - `published: true` must always be included for posts ready to display

5. **After Creating the File**:
   - Confirm the file was created
   - Show the filename and path
   - Provide the URL where the post will be accessible: `http://localhost:4000/YYYY/MM/DD/title.html`

## Examples

### Example 1: With category

```
/add-post data structures in python Tutorial Python,DataStructure,CS
```

Creates: `_posts/2025-10-12-data-structures-in-python.md`

### Example 2: Without category

```
/add-post understanding django orm Python,Django,ORM
```

Creates: `_posts/2025-10-12-understanding-django-orm.md`

### Example 3: Korean title

```
/add-post 파이썬 기초 문법 Tutorial Python,기초
```

Creates: `_posts/2025-10-12-파이썬-기초-문법.md`

## Important Notes

- **Always use today's actual current date** (not future dates)
  - Jekyll hides future-dated posts by default
  - If system date command returns a future date, manually use the correct current date
- Keep the original title case in the front matter
- Slugify the title for the filename (lowercase, hyphens)
- If category is not provided, omit the `categories:` line entirely
- Tags should always be provided (at least one tag)
- **Always include `published: true` in the front matter**
- Create the file in the `_posts/` directory
- The post will be automatically picked up by Jekyll when the server is running
