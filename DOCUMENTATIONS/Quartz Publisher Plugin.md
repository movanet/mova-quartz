# Quartz Publisher Plugin

Obsidian plugin for publishing notes to the mova-quartz Quartz site with one command.

---

## Overview

The Quartz Publisher plugin enables seamless publishing from Obsidian to your Quartz static site hosted on Netlify.

| Property | Value |
|----------|-------|
| **Plugin Name** | Quartz Publisher |
| **Location** | `.obsidian/plugins/quartz-publisher/` |
| **Site URL** | https://note.alafghani.info |
| **Netlify Site** | https://mova-quartz.netlify.app |

---

## How It Works

```
┌─────────────────────────────────────────────────────────────┐
│  Ctrl+P → "Publish current note to Quartz"                  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  1. Auto-add `publish: true` to frontmatter (if missing)    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  2. Copy note to content/ folder                            │
│     - Convert share: true → publish: true                   │
│     - Convert inline tags (#tag) → YAML array               │
│     - Copy referenced images to content/images/             │
│     - Remove unsupported audio embeds                       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  3. Git commit & push to v4 branch                          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  4. Build Quartz site (npx quartz build)                    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  5. Deploy to Netlify (netlify-cli deploy --prod)           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  Live at https://note.alafghani.info                        │
└─────────────────────────────────────────────────────────────┘
```

---

## Commands

Access via Command Palette (`Ctrl+P`):

| Command | Description |
|---------|-------------|
| **Publish current note to Quartz** | Publishes the currently open note. Auto-adds `publish: true` if missing. Skips if content unchanged. |
| **Publish all notes with publish: true** | Batch publishes all notes with `publish: true` or `share: true` outside the content/ folder. |

---

## Quick Start

### Publish a Single Note

1. Open the note you want to publish
2. Press `Ctrl+P` to open Command Palette
3. Type "Publish current note to Quartz"
4. Wait ~30 seconds for build and deploy
5. Visit https://note.alafghani.info to see your note

### Publish Multiple Notes

1. Add `publish: true` to frontmatter of notes you want to publish
2. Press `Ctrl+P`
3. Type "Publish all notes with publish: true"
4. Plugin finds and publishes all matching notes

---

## Settings

Access: Settings → Community Plugins → Quartz Publisher → Settings

| Setting | Default | Description |
|---------|---------|-------------|
| Git branch | `v4` | Branch to push changes to |
| Commit message | `Publish: {{filename}}` | Template for commit messages. `{{filename}}` is replaced with the note name. |

---

## Frontmatter Handling

### Automatic Processing

The plugin automatically processes frontmatter when publishing:

#### Before (your note)
```yaml
---
title: My Note
share: true
tags: #ai #research #ml
---

Content with ![[audio.mp3]] embed...
```

#### After (in content/ folder)
```yaml
---
publish: true
title: My Note
tags:
  - ai
  - research
  - ml
---

Content without audio embed...
```

### Conversions Performed

| From | To |
|------|-----|
| `share: true` | `publish: true` |
| `tags: #ai #ml` (inline) | `tags:\n  - ai\n  - ml` (YAML array) |
| No frontmatter | Adds `---\npublish: true\n---` |
| `![[audio.mp3]]` | Removed (not supported) |

---

## Folder Structure

```
mova-quartz/                    ← Vault root (also Quartz repo)
├── content/                    ← Published notes go here
│   ├── index.md               ← Homepage
│   ├── images/                ← Referenced images copied here
│   ├── perubahan-iklim/       ← Protected content folder
│   │   ├── index.md
│   │   ├── BAB 1 -- Title --.md
│   │   └── ...
│   └── *.md                   ← Other published notes
├── notes/                      ← Your working notes (any folder name)
├── drafts/                     ← Unpublished drafts
├── public/                     ← Built site output (gitignored)
├── quartz/                     ← Quartz source code
├── quartz.config.ts           ← Quartz configuration
├── netlify.toml               ← Netlify build config
├── DOCUMENTATIONS/            ← This documentation
└── .obsidian/
    └── plugins/
        └── quartz-publisher/  ← Plugin files
            ├── main.ts        ← Source code
            ├── main.js        ← Compiled plugin
            ├── manifest.json  ← Plugin metadata
            └── package.json   ← Dependencies
```

---

## Image Handling

### Automatic Image Copy

When you publish a note with embedded images:

```markdown
![[my-image.png]]
```

The plugin:
1. Finds the image in your vault
2. Copies it to `content/images/`
3. Updates the link in the published note

### Supported Formats

| Format | Supported |
|--------|-----------|
| PNG | ✅ |
| JPG/JPEG | ✅ |
| GIF | ✅ |
| SVG | ✅ |
| WebP | ✅ |
| MP3/Audio | ❌ (removed) |
| MP4/Video | ❌ (removed) |

---

## Duplicate Prevention

The plugin checks if content has changed before publishing:

1. Compares processed note with existing file in `content/`
2. If identical, shows "already up to date"
3. Skips git/build/deploy cycle
4. Saves time and avoids unnecessary deploys

---

## Authentication

### Git / GitHub

The plugin uses your existing Git configuration:

**Repository:** https://github.com/movanet/mova-quartz
**Branch:** v4

Git credentials are managed by your system's Git credential manager (Windows Credential Manager on Windows).

**Verify Git auth:**
```bash
cd C:\Users\mova\obsidian\mova-quartz
git remote -v
# Should show: origin  https://github.com/movanet/mova-quartz.git

git push origin v4 --dry-run
# Should succeed without prompting
```

### Netlify

The plugin uses Netlify CLI for deployment:

**Site Name:** mova-quartz
**Site URL:** https://note.alafghani.info

**Verify Netlify auth:**
```bash
cd C:\Users\mova\obsidian\mova-quartz
npx netlify-cli status
# Should show site linked to mova-quartz
```

---

## Netlify Configuration

File: `netlify.toml`

```toml
[build]
  command = "npx quartz build"
  publish = "public"

[build.environment]
  NODE_VERSION = "22"
```

### Dashboard Links

- **Dashboard:** https://app.netlify.com/projects/mova-quartz
- **Deploy logs:** https://app.netlify.com/projects/mova-quartz/deploys
- **Functions:** https://app.netlify.com/projects/mova-quartz/logs/edge-functions

---

## Troubleshooting

### "No active file to publish"

**Cause:** No markdown file is currently open and focused.

**Solution:** Open a `.md` file and ensure it's the active tab.

### "Can only publish markdown files"

**Cause:** The active file is not a markdown file.

**Solution:** Only `.md` files can be published.

### "already up to date"

**Cause:** The note content hasn't changed since last publish.

**Solution:** This is normal. Edit the note and try again if you need to republish.

### "No changes to commit"

**Cause:** Git detected no changes in the content/ folder.

**Solution:** The note may already be published with identical content.

### Git Errors

```
Publish failed: Git error
```

**Solutions:**
1. Check Git authentication:
   ```bash
   cd C:\Users\mova\obsidian\mova-quartz
   git push origin v4
   ```
2. Check for merge conflicts:
   ```bash
   git status
   ```
3. Ensure correct branch:
   ```bash
   git branch
   # Should show: * v4
   ```

### Netlify Errors

```
Publish failed: Netlify error
```

**Solutions:**
1. Check Netlify auth:
   ```bash
   npx netlify-cli status
   ```
2. Re-login:
   ```bash
   npx netlify-cli logout
   npx netlify-cli login
   ```
3. Re-link site:
   ```bash
   npx netlify-cli unlink
   npx netlify-cli link
   # Select "mova-quartz"
   ```

### Plugin Not Appearing

**Solutions:**
1. Check plugin is enabled:
   - Settings → Community Plugins → Quartz Publisher (toggle on)
2. Reload Obsidian:
   - `Ctrl+R` or close and reopen
3. Check plugin files exist:
   - `.obsidian/plugins/quartz-publisher/main.js` must exist

### Build Errors

**Manual build test:**
```bash
cd C:\Users\mova\obsidian\mova-quartz
npx quartz build
```

Common causes:
- Invalid YAML frontmatter
- Unclosed code blocks
- Syntax errors in markdown

### Deploy Errors

**Manual deploy test:**
```bash
cd C:\Users\mova\obsidian\mova-quartz
npx quartz build
npx netlify-cli deploy --dir=public --prod
```

---

## Manual Publishing

If the plugin isn't working, you can publish manually:

### Step 1: Prepare the note

Add frontmatter:
```yaml
---
publish: true
---
```

### Step 2: Copy to content folder

Copy your note to `content/` folder.

### Step 3: Git commit and push

```bash
cd C:\Users\mova\obsidian\mova-quartz
git add content/
git commit -m "Publish: My Note"
git push origin v4
```

### Step 4: Build and deploy

```bash
npx quartz build
npx netlify-cli deploy --dir=public --prod
```

Or use the combined command:
```bash
npx netlify-cli deploy --build --prod
```

---

## Plugin Development

### File Locations

| File | Purpose |
|------|---------|
| `main.ts` | TypeScript source code |
| `main.js` | Compiled JavaScript (loaded by Obsidian) |
| `manifest.json` | Plugin metadata (name, version, etc.) |
| `package.json` | npm dependencies |
| `styles.css` | Plugin styles (if any) |

### Rebuild Plugin

After editing `main.ts`:

```bash
cd C:\Users\mova\obsidian\mova-quartz\.obsidian\plugins\quartz-publisher
npm run build
```

Then reload Obsidian (`Ctrl+R`).

### Dependencies

```bash
cd C:\Users\mova\obsidian\mova-quartz\.obsidian\plugins\quartz-publisher
npm install
```

---

## Quick Reference

| Action | How |
|--------|-----|
| Publish single note | Open note → `Ctrl+P` → "Publish current note to Quartz" |
| Publish all marked notes | `Ctrl+P` → "Publish all notes with publish: true" |
| Check site | Visit https://note.alafghani.info |
| Plugin settings | Settings → Community Plugins → Quartz Publisher |
| Plugin location | `.obsidian/plugins/quartz-publisher/` |

---

## Related Documentation

- [CLAUDE.md](../CLAUDE.md) - Main project guide
- [Setup and Credentials](./Setup%20and%20Credentials.md) - Account info
- [Quartz Configuration](./Quartz%20Configuration.md) - Quartz settings
- [Netlify API Reference](./Netlify-API-Reference.md) - API documentation
