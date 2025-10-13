---
description: Create a new Jekyll blog post with proper formatting
---

# Add Post Command

Create a new Jekyll blog post with the following arguments:

## Arguments Format

```
/add-post <title> [category] [tags-with-comma] [yyyy-mm-dd]
```

## Task Instructions

1. **Parse Arguments**:

   - Extract the post title from the first argument(s) before category/tags
   - Extract optional category (single word like "Roadmap", "Tutorial", "Study")
   - Extract comma-separated tags (e.g., "Python,Django,Backend")
   - Extract optional date argument in YYYY-MM-DD format
     - If date argument is provided, use that date
     - If date argument is NOT provided, use today's **actual current date** in YYYY-MM-DD format
     - **IMPORTANT**: Be careful with future dates - Jekyll hides future-dated posts by default
     - Example: If date "2024-10-12" is provided, use that date

2. **Generate Filename**:

   - Format: `YYYY-MM-DD-slugified-title.md`
   - Use the date from step 1 (provided date or today's date)
   - Slugify the title:
     - Convert to lowercase
     - Replace spaces with hyphens
     - Remove special characters except hyphens
   - Example: "Analysis Python Commands" with date 2024-10-12 → "2024-10-12-analysis-python-commands.md"

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
     - **Must match the date used in the filename**
     - Use the provided date argument, or today's actual date if not provided
     - Be careful with future dates - future-dated posts won't appear on the site
   - `categories:` is optional (omit the line if not provided)
   - `tags:` should be an array format: [tag1, tag2, tag3]
   - `published: true` must always be included for posts ready to display

5. **After Creating the File**:
   - Confirm the file was created
   - Show the filename and path
   - Provide the URL where the post will be accessible using the date from the filename: `http://localhost:4000/YYYY/MM/DD/title.html`
   - Example: If created `2024-09-15-python-decorators.md`, the URL is `http://localhost:4000/2024/09/15/python-decorators.html`

## Examples

### Example 1: With category (uses today's date)

```
/add-post data structures in python Tutorial Python,DataStructure,CS
```

Creates: `_posts/2024-10-12-data-structures-in-python.md` (assumes today is 2024-10-12)

### Example 2: Without category (uses today's date)

```
/add-post understanding django orm Python,Django,ORM
```

Creates: `_posts/2024-10-12-understanding-django-orm.md`

### Example 3: With specific date

```
/add-post python decorators Programming Python,Advanced 2024-09-15
```

Creates: `_posts/2024-09-15-python-decorators.md`

### Example 4: Korean title with specific date

```
/add-post 파이썬 기초 문법 Tutorial Python,기초 2024-08-20
```

Creates: `_posts/2024-08-20-파이썬-기초-문법.md`

### Example 5: Backdate a post

```
/add-post my retrospective 2023 Retrospec retrospec,booklog 2023-12-31
```

Creates: `_posts/2023-12-31-my-retrospective-2023.md`

## Important Notes

- **Date Handling**:
  - If date argument is provided in YYYY-MM-DD format, use that exact date
  - If date argument is NOT provided, use today's actual current date (not future dates)
  - Jekyll hides future-dated posts by default
  - Backdating posts is allowed by providing a past date
- Keep the original title case in the front matter
- Slugify the title for the filename (lowercase, hyphens)
- If category is not provided, omit the `categories:` line entirely
- Tags should always be provided (at least one tag)
- **Always include `published: true` in the front matter**
- Create the file in the `_posts/` directory
- The post will be automatically picked up by Jekyll when the server is running
- The filename date and front matter date must match
