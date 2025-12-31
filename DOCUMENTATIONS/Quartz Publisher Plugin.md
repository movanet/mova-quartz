# Quartz Publisher Plugin

## Overview

The Quartz Publisher plugin allows you to publish Obsidian notes to your Quartz static site hosted on Netlify with a single command.

**Site URL:** https://mova-quartz.netlify.app

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
│  Live at https://mova-quartz.netlify.app                    │
└─────────────────────────────────────────────────────────────┘
```

## Commands

| Command | Description |
|---------|-------------|
| `Publish current note to Quartz` | Publishes the currently active note. Auto-adds `publish: true` if missing. Skips if content unchanged. |
| `Publish all notes with publish: true` | Finds all notes with `publish: true` or `share: true` outside content/ folder and publishes them in batch. |

**How to use:** Press `Ctrl+P` to open command palette, then type "Publish"

## Settings

Access via: Settings → Community Plugins → Quartz Publisher → Settings

| Setting | Default | Description |
|---------|---------|-------------|
| Git branch | `v4` | Branch to push changes to |
| Commit message | `Publish: {{filename}}` | Template for commit messages. `{{filename}}` is replaced with the note name. |

## Folder Structure

```
mova-quartz/                    ← Vault root (also Quartz repo)
├── content/                    ← Published notes go here (Quartz reads from this)
│   ├── images/                 ← Referenced images are copied here
│   ├── index.md               ← Homepage
│   └── *.md                   ← Published notes
├── notes/                      ← Your working notes (any folder)
├── public/                     ← Built site output (gitignored)
├── quartz/                     ← Quartz source code
├── quartz.config.ts           ← Quartz configuration
├── netlify.toml               ← Netlify build config
├── DOCUMENTATIONS/            ← This documentation
└── .obsidian/
    └── plugins/
        └── quartz-publisher/  ← Plugin files
```

## Frontmatter Handling

### Automatic Addition
When you run "Publish current note to Quartz", the plugin automatically adds `publish: true` to your note's frontmatter if it's missing.

### Before (your note)
```yaml
---
title: My Note
tags: #ai #research
---
```

### After (in content/ folder)
```yaml
---
publish: true
title: My Note
tags:
  - ai
  - research
---
```

### Conversions
| From | To |
|------|-----|
| `share: true` | `publish: true` |
| `tags: #ai #ml` | `tags:\n  - ai\n  - ml` |
| No frontmatter | Adds `---\npublish: true\n---` |

## Duplicate Prevention

The plugin checks if the content in `content/` folder is identical to the processed note. If unchanged, it shows "already up to date" and skips the publish cycle.

---

# Credentials & Authentication

## Git / GitHub

**Repository:** https://github.com/movanet/mova-quartz
**Branch:** v4

Git credentials are managed by your system's Git credential manager. The plugin uses your existing Git configuration.

**Verify Git auth:**
```bash
cd C:\Users\mova\obsidian\mova-quartz
git remote -v
git push origin v4  # Test push
```

## Netlify

**Site Name:** mova-quartz
**Site URL:** https://mova-quartz.netlify.app
**Site ID:** (managed by netlify-cli)

### Netlify CLI Authentication

The Netlify CLI stores authentication in your user profile. To check or re-authenticate:

```bash
# Check current status
npx netlify-cli status

# Login (if needed)
npx netlify-cli login

# Link to existing site (if needed)
cd C:\Users\mova\obsidian\mova-quartz
npx netlify-cli link
```

### Netlify Configuration

File: `netlify.toml`
```toml
[build]
  command = "npx quartz build"
  publish = "public"

[build.environment]
  NODE_VERSION = "22"
```

### Netlify Dashboard
- **Dashboard:** https://app.netlify.com/projects/mova-quartz
- **Deploy logs:** https://app.netlify.com/projects/mova-quartz/deploys

---

# Troubleshooting

## "No active file to publish"
- Make sure you have a markdown file open and focused

## "Can only publish markdown files"
- The plugin only works with `.md` files

## "already up to date"
- The note content hasn't changed since last publish
- Edit the note and try again

## "No changes to commit"
- Git detected no changes in the content/ folder
- The note may already be published with identical content

## Publish failed: Git errors
1. Check Git authentication: `git push origin v4`
2. Check for merge conflicts
3. Ensure you're on the v4 branch: `git branch`

## Publish failed: Netlify errors
1. Check Netlify auth: `npx netlify-cli status`
2. Re-login if needed: `npx netlify-cli login`
3. Re-link site: `npx netlify-cli link`

## Plugin not appearing in Obsidian
1. Check plugin is enabled: Settings → Community Plugins
2. Reload Obsidian: Ctrl+R or restart completely
3. Check plugin files exist in `.obsidian/plugins/quartz-publisher/`

## Build errors
```bash
# Manual build test
cd C:\Users\mova\obsidian\mova-quartz
npx quartz build
```

## Deploy errors
```bash
# Manual deploy test
cd C:\Users\mova\obsidian\mova-quartz
npx netlify-cli deploy --dir=public --prod
```

---

# Quick Reference

## Publish a note
1. Open the note you want to publish
2. Press `Ctrl+P`
3. Type "Publish current note to Quartz"
4. Wait ~20 seconds for build and deploy

## Check your site
https://mova-quartz.netlify.app

## Plugin location
`C:\Users\mova\obsidian\mova-quartz\.obsidian\plugins\quartz-publisher\`

## Key files
| File | Purpose |
|------|---------|
| `main.ts` | Plugin source code |
| `main.js` | Compiled plugin |
| `manifest.json` | Plugin metadata |
| `package.json` | Dependencies |

## Rebuild plugin (after editing main.ts)
```bash
cd C:\Users\mova\obsidian\mova-quartz\.obsidian\plugins\quartz-publisher
npm run build
```
Then reload Obsidian.
