# CLAUDE.md - mova-quartz Project Guide

## Project Overview

**mova-quartz** is a Quartz v4-based static site generator for publishing Obsidian notes to the web. The site is deployed on Netlify.

| Component | Technology |
|-----------|------------|
| Static Site Generator | Quartz v4.5.2 |
| Content Source | Obsidian Markdown |
| Hosting | Netlify |
| Version Control | GitHub |
| Build System | Node.js 22+ |

---

## Key URLs

| Purpose | URL |
|---------|-----|
| **Live Site** | https://note.alafghani.info |
| **Netlify URL** | https://mova-quartz.netlify.app |
| **GitHub Repo** | https://github.com/movanet/mova-quartz |
| **Netlify Dashboard** | https://app.netlify.com/projects/mova-quartz |
| **Perubahan Iklim** | https://note.alafghani.info/06-PerubahanIklim/ |
| **International Law** | https://note.alafghani.info/07-IntLaw/ |

---

## Project Structure

```
mova-quartz/
├── content/                          # Source markdown files (Obsidian notes)
│   ├── index.md                      # Home page
│   ├── 01-Lingkungan/                # Environmental law course
│   ├── 06-PerubahanIklim/            # Climate law course (22 files, BAB 1-16 + supplements)
│   ├── 07-IntLaw/                    # International law course (12 chapters)
│   └── rpjmn/                        # RPJMN 2025-2029 materials
├── quartz/                           # Quartz framework code (do not edit)
├── public/                           # Built output (generated, gitignored)
├── netlify/                          # Netlify configurations
│   └── edge-functions/               # (currently empty — Basic Auth removed 2026-04-12)
├── DOCUMENTATIONS/                   # Project documentation
│   ├── Setup and Credentials.md      # Account info and credentials
│   ├── Quartz Configuration.md       # Quartz config guide
│   ├── Quartz Publisher Plugin.md    # Obsidian plugin guide
│   └── Netlify-API-Reference.md      # Netlify API documentation
├── .obsidian/                        # Obsidian vault settings
│   └── plugins/
│       └── quartz-publisher/         # Custom publish plugin
├── netlify.toml                      # Netlify build configuration
├── quartz.config.ts                  # Quartz site configuration
├── quartz.layout.ts                  # Layout configuration (includes Explorer mapFn)
├── package.json                      # Node.js dependencies
└── CLAUDE.md                         # This file
```

---

## Build Commands

```bash
# Navigate to project
cd C:\Users\mova\obsidian\mova-quartz

# Local development with live preview
npx quartz build --serve
# Opens at http://localhost:8080

# Build only (no server)
npx quartz build

# Sync with upstream Quartz (get updates)
npx quartz sync

# Clean build (if having issues)
rm -rf public/ .quartz-cache/
npx quartz build
```

---

## Deployment

### Method 1: Netlify CLI (Primary — git-triggered builds are broken)

**IMPORTANT:** Netlify's GitHub integration is broken for this repo (host key verification failed). All deploys must be done via the Netlify CLI locally.

```bash
cd C:\Users\mova\obsidian\mova-quartz

# Commit and push to git first
git add .
git commit -m "Update content"
git push origin v4

# Then deploy via CLI (this is the ONLY way that works)
netlify deploy --build --prod
```

The build takes ~2 minutes (Quartz build + CDN upload).

### Method 2: Obsidian Plugin

1. Open note in Obsidian
2. Press `Ctrl+P` → "Publish current note to Quartz"
3. Plugin handles git commit and push (still needs manual `netlify deploy --build --prod`)

---

## Content Folders (Teaching Materials)

Course folders follow a numbered naming convention (`0x-Name`):

| Folder | Subject | Files |
|--------|---------|-------|
| `01-Lingkungan` | Hukum Lingkungan (Environmental Law) | 20+ files |
| `06-PerubahanIklim` | Hukum Perubahan Iklim (Climate Change Law) | 22 files (BAB 1-16 + supplements) |
| `07-IntLaw` | Hukum Internasional (International Law) | 14 files (12 chapters + READMEs) |

All content is publicly accessible (no authentication). Each folder has an `index.md` with a descriptive title in frontmatter.

### Explorer Sidebar Display Names

The Explorer sidebar uses a `mapFn` in `quartz.layout.ts` to override long index.md titles with the numbered folder names. This ensures the Explorer shows `01-Lingkungan`, `06-PerubahanIklim`, `07-IntLaw` instead of verbose titles like "Buku Ajar Hukum Perubahan Iklim".

**How it works:** Quartz's Explorer resolves folder `displayName` via a priority chain: `displayNameOverride` > index.md title > folder slug. For folders with an index.md that has a `title` frontmatter, the long title wins by default. The `mapFn` sets `displayNameOverride` to the numbered folder name.

```typescript
// In quartz.layout.ts — both Explorer instances (contentPage + listPage)
Component.Explorer({
  mapFn: (node) => {
    const folderMap: Record<string, string> = {
      "Hukum Lingkungan - Materi Pembelajaran": "01-Lingkungan",
      "Buku Ajar Hukum Perubahan Iklim": "06-PerubahanIklim",
      "Hukum Internasional - Bahan Ajar": "07-IntLaw",
    }
    if (node.isFolder && folderMap[node.displayName]) {
      node.displayName = folderMap[node.displayName]
    }
  },
})
```

**When adding new course folders:** Add the index.md title → desired folder name mapping to BOTH Explorer instances in `quartz.layout.ts` (one in `defaultContentPageLayout`, one in `defaultListPageLayout`).

### Note on Basic Auth (removed 2026-04-12)

Basic Auth via Netlify Edge Functions was previously used to protect `/perubahan-iklim/` (now `/06-PerubahanIklim/`). It was removed on 2026-04-12. The edge function `netlify/edge-functions/auth.ts` was deleted and the related `netlify.toml` entries were removed. To re-add auth protection for any path, create a new edge function and register it in `netlify.toml`.

---

## Netlify API Quick Reference

| Field | Value |
|-------|-------|
| **API Base URL** | `https://api.netlify.com/api/v1/` |
| **API Token** | `nfp_r33PYc8YVTqs3NkVvcmH6LWCgrTG2sdd4815` |
| **Site ID** | `1c671d6b-34fe-4905-9c1c-59ff4166e37a` |
| **Site Name** | `mova-quartz.netlify.app` |
| **Account ID** | `640ec635dcf746089c4b2c08` |

### Common API Calls

```bash
# Set token
export NETLIFY_TOKEN="nfp_r33PYc8YVTqs3NkVvcmH6LWCgrTG2sdd4815"

# Check site info
curl -s -H "Authorization: Bearer $NETLIFY_TOKEN" \
  "https://api.netlify.com/api/v1/sites/mova-quartz.netlify.app" | jq '.name, .ssl_url'

# List recent deploys
curl -s -H "Authorization: Bearer $NETLIFY_TOKEN" \
  "https://api.netlify.com/api/v1/sites/mova-quartz.netlify.app/deploys?per_page=3" | \
  jq '.[] | {id, state, created_at}'

# Trigger new build
curl -X POST -H "Authorization: Bearer $NETLIFY_TOKEN" \
  "https://api.netlify.com/api/v1/sites/mova-quartz.netlify.app/builds"

# Check deploy status
curl -s -H "Authorization: Bearer $NETLIFY_TOKEN" \
  "https://api.netlify.com/api/v1/deploys/{deploy_id}" | jq '.state'
```

See full reference: `DOCUMENTATIONS/Netlify-API-Reference.md`

---

## Environment Variables

### Netlify Dashboard Variables

Set in: Netlify Dashboard → Site Settings → Environment Variables

| Variable | Purpose | Default |
|----------|---------|---------|
| `NODE_VERSION` | Node.js version for builds | `22` |

### Local Environment

The Netlify CLI stores auth in: `~/.netlify/config.json`

Git credentials are managed by Windows Credential Manager.

---

## Common Tasks

### Add New Content

1. Create/edit markdown in `content/`
2. Add `publish: true` to frontmatter
3. Run `npx quartz build --serve` to preview
4. Push to GitHub or deploy via Netlify CLI

### Add New Course Folder

1. Create folder under `content/` using naming convention `0x-Name`
2. Add `index.md` with `publish: true` and a descriptive `title` in frontmatter
3. Add all chapter files with `publish: true`
4. Update `quartz.layout.ts` — add the index.md title → folder name mapping to BOTH Explorer `mapFn` instances
5. Commit, push, and deploy with `netlify deploy --build --prod`

### Check Build Status

```bash
# Via CLI
npx netlify-cli status

# Via API
curl -s -H "Authorization: Bearer $NETLIFY_TOKEN" \
  "https://api.netlify.com/api/v1/sites/mova-quartz.netlify.app/deploys?per_page=1" | \
  jq '.[0] | {id, state, created_at}'
```

### Re-link Netlify

```bash
cd C:\Users\mova\obsidian\mova-quartz
npx netlify-cli unlink
npx netlify-cli link
# Select "mova-quartz"
```

### Verify Site After Deploy

```bash
# Check sitemap for expected URLs
curl -s https://note.alafghani.info/sitemap.xml | grep "06-PerubahanIklim"

# Check a specific page loads (should return 200)
curl -I https://note.alafghani.info/06-PerubahanIklim/
```

---

## Quartz Configuration

### Key Settings (quartz.config.ts)

```typescript
const config: QuartzConfig = {
  configuration: {
    pageTitle: "Mova's Notes",
    enableSPA: true,
    enablePopovers: true,
    baseUrl: "note.alafghani.info",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "modified",
  },
  plugins: {
    filters: [Plugin.ExplicitPublish()],  // Only publish notes with `publish: true`
    // ... transformers and emitters
  },
}
```

### Important: ExplicitPublish Filter

Only notes with `publish: true` in frontmatter are published:

```yaml
---
publish: true
title: My Note
---
```

Notes without `publish: true` are ignored during build.

---

## URL Slug Conversion

Quartz converts file names to URL slugs:

| File Name | URL Path |
|-----------|----------|
| `BAB 1 -- Pengantar Hukum Perubahan Iklim --.md` | `/06-PerubahanIklim/BAB-1----Pengantar-Hukum-Perubahan-Iklim---` |
| `Tinjauan-Mata-Kuliah.md` | `/06-PerubahanIklim/Tinjauan-Mata-Kuliah` |
| `index.md` | `/06-PerubahanIklim/` |

**Rules:**
- Spaces → `-`
- Double dashes `--` remain as `----`
- Uppercase → lowercase
- Special characters removed

---

## Troubleshooting

### 404 on Deployed Site

1. Check if build completed: `npx netlify-cli status`
2. Verify `publish: true` in frontmatter
3. Check files exist in `public/` after build
4. Clear browser cache or use incognito mode

### Explorer Showing Wrong Folder Names

The Explorer sidebar display names are controlled by the `mapFn` in `quartz.layout.ts`. Quartz resolves folder `displayName` via: `displayNameOverride` > index.md title > folder slug. If a folder's index.md has a `title` field, that title will show unless overridden by the mapFn. Update the `folderMap` in BOTH Explorer instances in `quartz.layout.ts`.

### Build Failing

```bash
# Check Node version
node --version  # Should be 22+

# Clean build
rm -rf public/ .quartz-cache/
npx quartz build

# Fresh install
rm -rf node_modules/
npm install
npx quartz build
```

### Git Push Not Triggering Deploy

**Known issue:** Netlify's GitHub integration is broken for this repo (host key verification failed). Git-triggered builds do NOT work. All previous successful deploys have `commit_ref: null` confirming they were manual CLI uploads.

**Workaround:** Always deploy via `netlify deploy --build --prod` from the local machine after pushing to git.

### Wikilinks Not Working

- Ensure link name matches file name exactly (case-sensitive in source)
- Format: `[[BAB 1 -- Pengantar Hukum Perubahan Iklim --|Display Text]]`
- Check for typos in link target

---

## File Locations Quick Reference

| Item | Path |
|------|------|
| Main config | `quartz.config.ts` |
| Layout config | `quartz.layout.ts` |
| Netlify config | `netlify.toml` |
| Edge functions | `netlify/edge-functions/` |
| Documentation | `DOCUMENTATIONS/` |
| Source content | `content/` |
| Built output | `public/` |
| Obsidian plugins | `.obsidian/plugins/` |

---

## Related Documentation

| Document | Purpose |
|----------|---------|
| [Setup and Credentials](./DOCUMENTATIONS/Setup%20and%20Credentials.md) | Account info, API tokens, local paths |
| [Quartz Configuration](./DOCUMENTATIONS/Quartz%20Configuration.md) | Quartz settings and customization |
| [Quartz Publisher Plugin](./DOCUMENTATIONS/Quartz%20Publisher%20Plugin.md) | Obsidian plugin usage |
| [Netlify API Reference](./DOCUMENTATIONS/Netlify-API-Reference.md) | Full API documentation |
| [Quartz Official Docs](https://quartz.jzhao.xyz) | Upstream Quartz documentation |

---

## Version History

| Date | Change |
|------|--------|
| 2026-04-12 | Renamed `perubahan-iklim/` → `06-PerubahanIklim/` (numbered folder convention) |
| 2026-04-12 | Added `07-IntLaw/` international law course materials (12 chapters) |
| 2026-04-12 | Removed Basic Auth from 06-PerubahanIklim (deleted edge function + netlify.toml entries) |
| 2026-04-12 | Added Explorer `mapFn` in `quartz.layout.ts` to show numbered folder names instead of index.md titles |
| 2026-04-12 | Updated all internal wikilinks from `perubahan-iklim` → `06-PerubahanIklim` |
| 2026-04-12 | Discovered Netlify git-triggered builds are broken; must use `netlify deploy --build --prod` |
| 2026-01-05 | Restructured perubahan-iklim to flat structure with titled BAB files |
| 2026-01-05 | Changed baseUrl to note.alafghani.info |
| 2026-01-05 | Added Netlify API token for programmatic access |
| 2026-01-04 | Added Basic Auth protection for perubahan-iklim |
