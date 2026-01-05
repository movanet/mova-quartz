# CLAUDE.md - mova-quartz Project Guide

## Project Overview

**mova-quartz** is a Quartz v4-based static site generator for publishing Obsidian notes to the web. The site is deployed on Netlify with password-protected sections using Edge Functions.

| Component | Technology |
|-----------|------------|
| Static Site Generator | Quartz v4.5.2 |
| Content Source | Obsidian Markdown |
| Hosting | Netlify |
| Authentication | Netlify Edge Functions (Basic Auth) |
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
| **Protected Content** | https://note.alafghani.info/perubahan-iklim/ |

---

## Project Structure

```
mova-quartz/
├── content/                          # Source markdown files (Obsidian notes)
│   ├── index.md                      # Home page
│   └── perubahan-iklim/              # Protected climate law course (22 files)
│       ├── index.md                  # Course landing page
│       ├── Tinjauan-Mata-Kuliah.md   # Course overview
│       ├── BAB 1 -- Pengantar Hukum Perubahan Iklim --.md
│       ├── BAB 2 -- Prinsip-Prinsip Hukum Lingkungan Internasional --.md
│       ├── BAB 3 -- Arsitektur Rezim Iklim Internasional --.md
│       ├── BAB 4 -- Kewajiban Mitigasi dalam Hukum Internasional --.md
│       ├── BAB 5 -- Hukum Adaptasi Perubahan Iklim --.md
│       ├── BAB 6 -- Pendanaan dan Mekanisme Iklim --.md
│       ├── BAB 7 -- Kerangka Hukum Iklim Indonesia --.md
│       ├── BAB 8 -- Nilai Ekonomi Karbon dan Bursa Karbon --.md
│       ├── BAB 9 -- Studi Perbandingan Hukum Iklim --.md
│       ├── BAB 10 -- Hukum Iklim Sektoral --.md
│       ├── BAB 11 -- Litigasi Perubahan Iklim --.md
│       ├── BAB 12 -- Masa Depan Hukum Perubahan Iklim --.md
│       ├── BAB 13 -- Kerangka Hukum Adaptasi Internasional --.md
│       ├── BAB 14 -- Hukum Adaptasi Sektoral Indonesia --.md
│       ├── BAB 15 -- Loss and Damage dalam Hukum Iklim --.md
│       ├── BAB 16 -- Litigasi Perubahan Iklim --.md
│       ├── Daftar-Pustaka.md         # Bibliography
│       ├── Glosarium.md              # Glossary
│       ├── Indeks.md                 # Index
│       └── Lampiran-04-Kunci-Jawaban.md  # Answer key
├── quartz/                           # Quartz framework code (do not edit)
├── public/                           # Built output (generated, gitignored)
├── netlify/                          # Netlify configurations
│   └── edge-functions/
│       └── auth.ts                   # Basic Auth edge function
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
├── quartz.layout.ts                  # Layout configuration
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

### Method 1: Automatic (GitHub Push)

Push to `v4` branch triggers automatic Netlify build:

```bash
git add .
git commit -m "Update content"
git push origin v4
# Netlify automatically builds and deploys
```

### Method 2: Netlify CLI (Manual)

```bash
# Build and deploy in one command
npx netlify-cli deploy --build --prod

# Or separate steps
npx quartz build
npx netlify-cli deploy --dir=public --prod
```

### Method 3: Netlify API

```bash
# Trigger build via API
curl -X POST \
  -H "Authorization: Bearer nfp_r33PYc8YVTqs3NkVvcmH6LWCgrTG2sdd4815" \
  "https://api.netlify.com/api/v1/sites/mova-quartz.netlify.app/builds"
```

### Method 4: Obsidian Plugin

1. Open note in Obsidian
2. Press `Ctrl+P` → "Publish current note to Quartz"
3. Plugin handles git commit, push, build, and deploy

---

## Protected Content

The `/perubahan-iklim/` path is password-protected using Netlify Edge Functions with HTTP Basic Auth.

### Access Credentials

| Field | Value |
|-------|-------|
| **URL** | https://note.alafghani.info/perubahan-iklim/ |
| **Username** | `fhuika` |
| **Password** | `fhuika2026` |

### How It Works

1. User navigates to `/perubahan-iklim/*`
2. Edge function `netlify/edge-functions/auth.ts` intercepts request
3. If no valid `Authorization` header, returns 401 with login prompt
4. Browser shows Basic Auth dialog
5. On valid credentials, request continues to content

### Configuration Files

**Edge Function:** `netlify/edge-functions/auth.ts`
```typescript
const VALID_USERNAME = Deno.env.get("AUTH_USERNAME") || "fhuika";
const VALID_PASSWORD = Deno.env.get("AUTH_PASSWORD") || "fhuika2026";

export const config = {
  path: "/perubahan-iklim/*",
};
```

**Netlify Config:** `netlify.toml`
```toml
[[edge_functions]]
  path = "/perubahan-iklim/*"
  function = "auth"

[[headers]]
  for = "/perubahan-iklim/*"
  [headers.values]
    Cache-Control = "private, no-cache, no-store, must-revalidate"
```

### Override Credentials

Set environment variables in Netlify Dashboard to override defaults:
- `AUTH_USERNAME` - Custom username
- `AUTH_PASSWORD` - Custom password

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
| `AUTH_USERNAME` | Protected content username | `fhuika` |
| `AUTH_PASSWORD` | Protected content password | `fhuika2026` |
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

### Add New Protected Section

1. Create folder under `content/`
2. Add path to `netlify.toml`:
   ```toml
   [[edge_functions]]
     path = "/new-section/*"
     function = "auth"

   [[headers]]
     for = "/new-section/*"
     [headers.values]
       Cache-Control = "private, no-cache, no-store, must-revalidate"
   ```
3. Update `netlify/edge-functions/auth.ts`:
   ```typescript
   export const config = {
     path: ["/perubahan-iklim/*", "/new-section/*"],
   };
   ```
4. Deploy

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

### Test Protected Content

```bash
# Without auth (should return 401)
curl -I https://note.alafghani.info/perubahan-iklim/

# With auth (should return 200)
curl -u fhuika:fhuika2026 https://note.alafghani.info/perubahan-iklim/
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
| `BAB 1 -- Pengantar Hukum Perubahan Iklim --.md` | `/perubahan-iklim/bab-1----pengantar-hukum-perubahan-iklim---` |
| `Tinjauan-Mata-Kuliah.md` | `/perubahan-iklim/tinjauan-mata-kuliah` |
| `index.md` | `/perubahan-iklim/` |

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

### Protected Content Not Working

1. Verify edge function deployed: Check Netlify Functions tab
2. Test with curl:
   ```bash
   curl -I https://note.alafghani.info/perubahan-iklim/
   # Should return 401 Unauthorized

   curl -u fhuika:fhuika2026 https://note.alafghani.info/perubahan-iklim/
   # Should return 200 OK
   ```
3. Check environment variables in Netlify dashboard

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

1. Verify GitHub webhook in Netlify: Dashboard → Deploys → Deploy Settings
2. Check branch is `v4`
3. Manually trigger: `npx netlify-cli deploy --build --prod`

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
| 2026-01-05 | Restructured perubahan-iklim to flat structure with titled BAB files |
| 2026-01-05 | Changed baseUrl to note.alafghani.info |
| 2026-01-05 | Added Netlify API token for programmatic access |
| 2026-01-04 | Added Basic Auth protection for perubahan-iklim |
