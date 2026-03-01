# marginalia

Extract, organize, and browse your Kindle highlights. No subscription, no cloud dependency.

## What it does

1. **Scrapes** your highlights from [read.amazon.com/notebook](https://read.amazon.com/notebook) via a bookmarklet
2. **Organizes** them into per-book Markdown files
3. **Serves** a clean website to search and browse everything

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

## Deployment

The site can be deployed to Vercel for access from anywhere:

```bash
# First time
npx vercel --yes --prod

# Re-deploy after syncing new highlights
npx vercel --prod
```

Your highlight data deploys from your local machine — it's gitignored and never committed to the repo.

## Re-syncing

1. Log into [read.amazon.com/notebook](https://read.amazon.com/notebook)
2. Click the bookmarklet (~30 seconds for 200+ books)
3. Move `kindle-export.json` to `raw/`
4. Run `node organize.js` to update Markdown files
5. Run `npx vercel --prod` to update the live site

## Project structure

```
raw/                      # Your exported JSON (gitignored)
books/                    # Generated Markdown per book (gitignored)
index.html                # Website to browse highlights
organize.js               # JSON -> Markdown converter
install-bookmarklet.html  # Bookmarklet installer page
vercel.json               # Vercel deployment config
```
