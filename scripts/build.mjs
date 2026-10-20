// Static site build: blog/*.md  ->  _site/blog/<slug>/index.html
// Also generates blog.html (post list), rss.xml, sitemap.xml, robots.txt
// and copies the hand-written pages + assets into _site/.
import { promises as fs } from "node:fs";
import path from "node:path";
import { marked } from "marked";

const SITE_URL = (process.env.SITE_URL || "https://nightfire390.github.io").replace(/\/$/, "");
const SITE_NAME = "Aaditya Kansal";
const AUTHOR = "Aaditya Kansal";
const ROOT = process.cwd();
const OUT = path.join(ROOT, "_site");
const BLOG_SRC = path.join(ROOT, "blog");

// Hand-written files/dirs copied untouched into the output.
const STATIC = ["index.html", "contact.html", "style.css", "media", "robots.txt"];

const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const slugify = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

function parseFrontMatter(raw) {
  raw = raw.replace(/\r\n/g, "\n");
  const meta = {};
  if (!raw.startsWith("---\n")) return { meta, body: raw };
  const end = raw.indexOf("\n---", 4);
  if (end === -1) return { meta, body: raw };
  for (const line of raw.slice(4, end).split("\n")) {
    const m = line.match(/^([\w-]+):\s*(.*)$/);
    if (m) meta[m[1]] = m[2].trim().replace(/^(["'])(.*)\1$/, "$2");
  }
  return { meta, body: raw.slice(end + 4).replace(/^\n/, "") };
}

// Add id="" to h2-h4 so sections are linkable / indexable as anchors.
function addHeadingIds(html) {
  const seen = new Map();
  return html.replace(/<h([2-4])>([\s\S]*?)<\/h\1>/g, (_, lvl, inner) => {
    let id = slugify(inner.replace(/<[^>]+>/g, "")) || "section";
    const n = seen.get(id) || 0;
    seen.set(id, n + 1);
    if (n) id += `-${n}`;
    return `<h${lvl} id="${id}">${inner}</h${lvl}>`;
  });
}

const plainText = (html) =>
  html.replace(/<pre[\s\S]*?<\/pre>/g, " ").replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, " ").trim();

const truncate = (s, n = 160) => (s.length <= n ? s : s.slice(0, n - 1).replace(/\s+\S*$/, "") + "…");

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">`;

function layout({ title, description, canonicalPath, active, body, head = "", ogType = "website" }) {
  const url = SITE_URL + canonicalPath;
  const nav = (href, label, key) =>
    `<a href="${href}"${active === key ? ' class="active"' : ""}>${label}</a>`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <link rel="canonical" href="${url}">
  <meta name="theme-color" content="#0e0e0e">
  <meta property="og:site_name" content="${SITE_NAME}">
  <meta property="og:type" content="${ogType}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${url}">
  <meta name="twitter:card" content="summary">
  <link rel="alternate" type="application/rss+xml" title="${SITE_NAME}" href="/rss.xml">
  <link rel="icon" type="image/jpg" href="/media/N.jpg">
  ${FONTS}
  <link rel="stylesheet" href="/style.css">
  ${head}
</head>
<body>

  <nav>
    ${nav("/index.html", "Index", "index")}
    ${nav("/blog.html", "Blog", "blog")}
    ${nav("/contact.html", "Contact", "contact")}
    <a href="/rss.xml" class="rss-link" title="RSS Feed">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 11a9 9 0 0 1 9 9"></path>
            <path d="M4 4a16 16 0 0 1 16 16"></path>
            <circle cx="5" cy="19" r="1"></circle>
        </svg>
    </a>
  </nav>

  <main>
${body}
  </main>

  <footer>
    <a href="/contact.html">Contact</a>
    <a href="/rss.xml">RSS</a>
    <span style="margin-left: auto;">&copy; ${new Date().getFullYear()} ${AUTHOR}</span>
  </footer>
</body>
</html>
`;
}

async function loadPosts() {
  const files = (await fs.readdir(BLOG_SRC)).filter((f) => f.endsWith(".md")).sort();
  const posts = [];
  const slugs = new Set();
  for (const file of files) {
    const raw = await fs.readFile(path.join(BLOG_SRC, file), "utf8");
    const { meta, body } = parseFrontMatter(raw);
    if (/^(true|yes)$/i.test(meta.draft || "")) continue;

    const base = file.replace(/\.md$/, "");
    const slug = slugify(meta.slug || base);
    if (slugs.has(slug)) throw new Error(`Duplicate slug "${slug}" (${file})`);
    slugs.add(slug);

    if (!meta.date || isNaN(new Date(meta.date))) {
      throw new Error(`${file}: missing or invalid "date" in front matter (use YYYY-MM-DD)`);
    }
    const html = addHeadingIds(marked.parse(body, { gfm: true }));
    const title = meta.title || base;
    const description = meta.description || truncate(plainText(html));
    posts.push({ file, slug, title, description, date: meta.date, tag: meta.tag || "note", html });
  }
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  return posts;
}

function postPage(p) {
  const url = `${SITE_URL}/blog/${p.slug}/`;
  const ld = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: p.title,
    description: p.description,
    datePublished: p.date,
    dateModified: p.date,
    mainEntityOfPage: url,
    url,
    author: { "@type": "Person", name: AUTHOR, url: SITE_URL },
  };
  const body = `    <article>
      <div class="post-header">
        <h1>${esc(p.title)}</h1>
        <div class="post-meta">
          <time datetime="${esc(p.date)}">${esc(p.date)}</time>
          <span>${esc(p.tag)}</span>
        </div>
      </div>
      <div class="post-content">
${p.html}
      </div>
    </article>`;
  return layout({
    title: `${p.title} | ${SITE_NAME}`,
    description: p.description,
    canonicalPath: `/blog/${p.slug}/`,
    active: "blog",
    ogType: "article",
    head: `<meta property="article:published_time" content="${esc(p.date)}">
  <script type="application/ld+json">${JSON.stringify(ld).replace(/</g, "\\u003c")}</script>`,
    body,
  });
}

function blogIndexPage(posts) {
  const byYear = new Map();
  for (const p of posts) {
    const y = p.date.slice(0, 4);
    if (!byYear.has(y)) byYear.set(y, []);
    byYear.get(y).push(p);
  }
  let list = "";
  for (const [year, items] of byYear) {
    list += `      <p class="year-heading">${year}</p>\n      <ul class="post-list">\n`;
    for (const p of items) {
      list += `        <li>
          <span class="post-date">${esc(p.date)}</span>
          <a href="/blog/${p.slug}/">${esc(p.title)}</a>
          <span class="post-tag">${esc(p.tag)}</span>
        </li>\n`;
    }
    list += `      </ul>\n`;
  }
  if (!posts.length) list = `      <p class="muted">No posts yet.</p>\n`;
  return layout({
    title: `Blog | ${SITE_NAME}`,
    description: "Notes and write-ups on systems, kernel and low-level programming.",
    canonicalPath: "/blog.html",
    active: "blog",
    body: `    <h1>Blog</h1>\n    <div id="posts-container">\n${list}    </div>`,
  });
}

function rssFeed(posts) {
  const rfc = (d) => new Date(d).toUTCString();
  const items = posts.map((p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${SITE_URL}/blog/${p.slug}/</link>
      <description>${esc(p.description)}</description>
      <pubDate>${rfc(p.date)}</pubDate>
      <guid isPermaLink="true">${SITE_URL}/blog/${p.slug}/</guid>
    </item>`).join("\n\n");
  const last = posts[0] ? rfc(posts[0].date) : rfc(Date.now());
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_NAME}</title>
    <link>${SITE_URL}</link>
    <description>Blogs and notes</description>
    <language>en-us</language>
    <lastBuildDate>${last}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>

${items}

  </channel>
</rss>
`;
}

function sitemap(posts) {
  const urls = [
    { loc: `${SITE_URL}/` },
    { loc: `${SITE_URL}/blog.html`, lastmod: posts[0]?.date },
    { loc: `${SITE_URL}/contact.html` },
    ...posts.map((p) => ({ loc: `${SITE_URL}/blog/${p.slug}/`, lastmod: p.date })),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}</url>`).join("\n")}
</urlset>
`;
}

// Old client-side URLs (/post.html?p=file.md) redirect to the new static pages.
const LEGACY_REDIRECT = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="robots" content="noindex">
  <title>Redirecting…</title>
  <script>
    var p = new URLSearchParams(location.search).get("p");
    if (p) {
      var slug = p.replace(/\\.md$/i, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
      location.replace("/blog/" + slug + "/");
    } else {
      location.replace("/blog.html");
    }
  </script>
  <noscript><meta http-equiv="refresh" content="0; url=/blog.html"></noscript>
</head>
<body><a href="/blog.html">Go to the blog</a></body>
</html>
`;

async function write(rel, content) {
  const dest = path.join(OUT, rel);
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.writeFile(dest, content);
}

async function exists(p) {
  try { await fs.access(p); return true; } catch { return false; }
}

async function main() {
  await fs.rm(OUT, { recursive: true, force: true });
  await fs.mkdir(OUT, { recursive: true });

  for (const item of STATIC) {
    const src = path.join(ROOT, item);
    if (await exists(src)) await fs.cp(src, path.join(OUT, item), { recursive: true });
  }

  // Non-markdown files in blog/ (images etc.) are served next to the posts.
  for (const f of await fs.readdir(BLOG_SRC)) {
    if (!f.endsWith(".md")) await fs.cp(path.join(BLOG_SRC, f), path.join(OUT, "blog", f), { recursive: true });
  }

  const posts = await loadPosts();
  for (const p of posts) await write(`blog/${p.slug}/index.html`, postPage(p));

  await write("blog.html", blogIndexPage(posts));
  await write("rss.xml", rssFeed(posts));
  await write("sitemap.xml", sitemap(posts));
  await write("post.html", LEGACY_REDIRECT);
  if (!(await exists(path.join(ROOT, "robots.txt")))) {
    await write("robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
  }
  await write(".nojekyll", "");

  console.log(`Built ${posts.length} post(s) -> _site/`);
  for (const p of posts) console.log(`  /blog/${p.slug}/`);
}

main().catch((e) => { console.error(e); process.exit(1); });
