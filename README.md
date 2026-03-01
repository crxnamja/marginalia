# marginalia

Extract, organize, and browse your Kindle highlights locally. No subscription, no cloud dependency — just your highlights on your machine.

## What it does

1. **Scrapes** your highlights from [read.amazon.com/notebook](https://read.amazon.com/notebook) via a bookmarklet
2. **Organizes** them into per-book Markdown files
3. **Serves** a clean local website to search and browse everything

## Quick start

```bash
# 1. Export your highlights
#    Open install-bookmarklet.html, drag the bookmarklet to your bookmarks bar
#    Go to read.amazon.com/notebook, log in, click the bookmarklet
#    Move the downloaded file:
mv ~/Downloads/kindle-export.json raw/kindle-export.json

# 2. Generate Markdown files
node organize.js

# 3. Browse your highlights
npx serve -l 3456
# Open http://localhost:3456
```

## Project structure

```
raw/                      # Your exported JSON (gitignored)
books/                    # Generated Markdown per book (gitignored)
index.html                # Local website to browse highlights
organize.js               # JSON -> Markdown converter
install-bookmarklet.html  # Bookmarklet installer page
```

## Re-syncing

Whenever you want fresh highlights:
1. Log into [read.amazon.com/notebook](https://read.amazon.com/notebook)
2. Click the bookmarklet
3. Replace `raw/kindle-export.json` with the new download
4. Run `node organize.js`

Your personal highlight data stays local and is never committed to the repo.
