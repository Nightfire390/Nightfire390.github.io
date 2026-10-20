# aadityakansal.me

Static site. Blog posts are Markdown in `blog/`, converted to real HTML at build time
(`scripts/build.mjs`) and deployed by GitHub Actions.

## Images
Put files in `media/` and reference them with an absolute path: `![alt text](/media/diagram.png)`.
Always start the path with `/` (relative paths break because posts live at `/blog/<name>/`).

## Add a post
Create `blog/my-post.md`:

```
---
title: My Post
date: 2026-10-21
tag: note
description: One-line summary used for search results / RSS (optional)
---

Content here...
```

Push to `master`. The workflow builds and publishes it at `/blog/my-post/`
and updates `blog.html`, `rss.xml` and `sitemap.xml`.
Optional front matter: `slug:` (override URL), `draft: true` (skip).

## Local preview
`npm install && npm run serve`
