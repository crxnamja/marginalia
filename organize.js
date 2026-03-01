#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const RAW_PATH = path.join(__dirname, 'raw', 'kindle-export.json');
const BOOKS_DIR = path.join(__dirname, 'books');
const INDEX_PATH = path.join(BOOKS_DIR, 'INDEX.md');

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 80);
}

function generateBookMarkdown(book) {
  let md = `# ${book.title}\n*${book.author}*\n\n`;
  md += `**${book.highlights.length} highlight${book.highlights.length !== 1 ? 's' : ''}**`;
  if (book.asin) md += ` | ASIN: ${book.asin}`;
  md += '\n\n---\n\n';

  for (const h of book.highlights) {
    md += `> ${h.text}\n`;
    const meta = [];
    if (h.location) meta.push(`Location: ${h.location}`);
    if (h.page) meta.push(`Page: ${h.page}`);
    if (h.color && h.color !== 'unknown') meta.push(`Color: ${h.color}`);
    if (meta.length) md += `- ${meta.join(' | ')}\n`;
    if (h.note) md += `- **Note:** ${h.note}\n`;
    md += '\n';
  }

  return md;
}

function generateIndex(books) {
  const sorted = [...books].sort((a, b) => a.title.localeCompare(b.title));
  const totalHighlights = books.reduce((sum, b) => sum + b.highlights.length, 0);

  let md = `# Kindle Highlights\n\n`;
  md += `**${books.length} books** | **${totalHighlights} highlights**\n\n`;
  md += `---\n\n`;
  md += `| Book | Author | Highlights |\n`;
  md += `|------|--------|------------|\n`;

  for (const book of sorted) {
    const slug = slugify(book.title);
    md += `| [${book.title}](books/${slug}.md) | ${book.author} | ${book.highlights.length} |\n`;
  }

  return md;
}

// Main
if (!fs.existsSync(RAW_PATH)) {
  console.error('Error: kindle-export.json not found at', RAW_PATH);
  console.error('Run the browser scraper first to generate the export.');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(RAW_PATH, 'utf8'));
const books = Array.isArray(data) ? data : data.books || [];

console.log(`Found ${books.length} books`);

// Ensure books directory exists
if (!fs.existsSync(BOOKS_DIR)) fs.mkdirSync(BOOKS_DIR, { recursive: true });

// Track slugs to handle duplicates
const usedSlugs = new Set();
let totalHighlights = 0;

for (const book of books) {
  if (!book.highlights || book.highlights.length === 0) continue;

  let slug = slugify(book.title);
  if (usedSlugs.has(slug)) {
    slug = slug + '-' + book.asin;
  }
  usedSlugs.add(slug);

  const md = generateBookMarkdown(book);
  const filePath = path.join(BOOKS_DIR, slug + '.md');
  fs.writeFileSync(filePath, md);
  totalHighlights += book.highlights.length;
  console.log(`  ${book.title} (${book.highlights.length} highlights)`);
}

// Generate index
const indexMd = generateIndex(books.filter(b => b.highlights && b.highlights.length > 0));
fs.writeFileSync(INDEX_PATH, indexMd);

console.log(`\nDone! ${usedSlugs.size} book files + index generated.`);
console.log(`Total highlights: ${totalHighlights}`);
