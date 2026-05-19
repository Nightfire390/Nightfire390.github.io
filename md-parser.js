// md-parser.js — lightweight Markdown renderer
// Supports: headings, bold, italic, inline code, code blocks,
//           blockquotes, unordered/ordered lists, horizontal rules,
//           links, images, and paragraphs.

const MDParser = (() => {
  function escape(html) {
    return html
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function parseInline(text) {
    // Bold + italic
    text = text.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
    // Bold
    text = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    text = text.replace(/__(.+?)__/g, "<strong>$1</strong>");
    // Italic
    text = text.replace(/\*(.+?)\*/g, "<em>$1</em>");
    text = text.replace(/_(.+?)_/g, "<em>$1</em>");
    // Strikethrough
    text = text.replace(/~~(.+?)~~/g, "<del>$1</del>");
    // Inline code
    text = text.replace(/`(.+?)`/g, (_, c) => `<code>${escape(c)}</code>`);
    // Images (before links)
    text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%">');
    // Links
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
    // Auto-links
    text = text.replace(/(https?:\/\/[^\s<>"]+)/g, '<a href="$1">$1</a>');
    return text;
  }

  function parse(md) {
    const lines = md.replace(/\r\n/g, "\n").split("\n");
    const out = [];
    let i = 0;

    // Strip YAML front matter
    if (lines[0] === "---") {
      i = 1;
      while (i < lines.length && lines[i] !== "---") i++;
      i++; // skip closing ---
    }

    while (i < lines.length) {
      const line = lines[i];

      // Fenced code block
      if (/^```/.test(line)) {
        const lang = line.slice(3).trim();
        const codeLines = [];
        i++;
        while (i < lines.length && !/^```/.test(lines[i])) {
          codeLines.push(escape(lines[i]));
          i++;
        }
        const langAttr = lang ? ` class="language-${lang}"` : "";
        out.push(`<pre><code${langAttr}>${codeLines.join("\n")}</code></pre>`);
        i++;
        continue;
      }

      // Headings
      const hMatch = line.match(/^(#{1,6})\s+(.+)/);
      if (hMatch) {
        const level = hMatch[1].length;
        out.push(`<h${level}>${parseInline(hMatch[2])}</h${level}>`);
        i++;
        continue;
      }

      // Horizontal rule
      if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) {
        out.push("<hr>");
        i++;
        continue;
      }

      // Blockquote
      if (/^>\s?/.test(line)) {
        const qLines = [];
        while (i < lines.length && /^>\s?/.test(lines[i])) {
          qLines.push(lines[i].replace(/^>\s?/, ""));
          i++;
        }
        out.push(`<blockquote>${parse(qLines.join("\n"))}</blockquote>`);
        continue;
      }

      // Unordered list
      if (/^[-*+]\s/.test(line)) {
        const items = [];
        while (i < lines.length && /^[-*+]\s/.test(lines[i])) {
          items.push(`<li>${parseInline(lines[i].replace(/^[-*+]\s/, ""))}</li>`);
          i++;
        }
        out.push(`<ul>${items.join("")}</ul>`);
        continue;
      }

      // Ordered list
      if (/^\d+\.\s/.test(line)) {
        const items = [];
        while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
          items.push(`<li>${parseInline(lines[i].replace(/^\d+\.\s/, ""))}</li>`);
          i++;
        }
        out.push(`<ol>${items.join("")}</ol>`);
        continue;
      }

      // Table
      if (/\|/.test(line) && i + 1 < lines.length && /^\|?\s*[-:]+/.test(lines[i + 1])) {
        const headerCells = line.split("|").filter((_, idx, arr) => idx > 0 && idx < arr.length - 1 || (arr.length === 1));
        const rows = [];
        i += 2; // skip header + separator
        while (i < lines.length && /\|/.test(lines[i])) {
          const cells = lines[i].split("|").slice(1, -1);
          rows.push(`<tr>${cells.map(c => `<td>${parseInline(c.trim())}</td>`).join("")}</tr>`);
          i++;
        }
        const thead = `<tr>${headerCells.map(c => `<th>${parseInline(c.trim())}</th>`).join("")}</tr>`;
        out.push(`<table><thead>${thead}</thead><tbody>${rows.join("")}</tbody></table>`);
        continue;
      }

      // Empty line
      if (line.trim() === "") {
        i++;
        continue;
      }

      // Paragraph — collect consecutive non-empty, non-special lines
      const pLines = [];
      while (
        i < lines.length &&
        lines[i].trim() !== "" &&
        !/^#{1,6}\s/.test(lines[i]) &&
        !/^```/.test(lines[i]) &&
        !/^>\s?/.test(lines[i]) &&
        !/^[-*+]\s/.test(lines[i]) &&
        !/^\d+\.\s/.test(lines[i]) &&
        !/^(-{3,}|\*{3,}|_{3,})$/.test(lines[i].trim())
      ) {
        pLines.push(lines[i]);
        i++;
      }
      if (pLines.length) {
        out.push(`<p>${parseInline(pLines.join(" "))}</p>`);
      }
    }

    return out.join("\n");
  }

  // Extract front matter key/value pairs
  function parseFrontMatter(md) {
    const meta = {};
    const lines = md.replace(/\r\n/g, "\n").split("\n");
    if (lines[0] !== "---") return { meta, body: md };
    let i = 1;
    while (i < lines.length && lines[i] !== "---") {
      const m = lines[i].match(/^(\w[\w-]*):\s*(.+)/);
      if (m) meta[m[1]] = m[2].trim();
      i++;
    }
    return { meta, body: lines.slice(i + 1).join("\n") };
  }

  return { parse, parseFrontMatter };
})();
