# Quartz Configuration

Complete guide to configuring Quartz v4 for the mova-quartz project.

---

## Overview

Quartz is a static site generator that transforms Obsidian markdown notes into a fast, searchable website.

| Property | Value |
|----------|-------|
| **Version** | Quartz v4.5.2 |
| **Documentation** | https://quartz.jzhao.xyz |
| **GitHub** | https://github.com/jackyzha0/quartz |
| **Build Output** | `public/` |
| **Content Source** | `content/` |

---

## Configuration Files

### Main Configuration: `quartz.config.ts`

Location: `C:\Users\mova\obsidian\mova-quartz\quartz.config.ts`

This is the primary configuration file controlling site behavior, appearance, and plugins.

### Layout Configuration: `quartz.layout.ts`

Location: `C:\Users\mova\obsidian\mova-quartz\quartz.layout.ts`

Controls the page layout, sidebar components, and footer.

---

## Current Configuration

### Site Settings

```typescript
const config: QuartzConfig = {
  configuration: {
    pageTitle: "Mova's Notes",        // Site title in header
    pageTitleSuffix: "",               // Suffix for page titles
    enableSPA: true,                   // Single Page Application mode
    enablePopovers: true,              // Link preview on hover
    analytics: null,                   // No analytics (was Plausible)
    locale: "en-US",                   // Language/locale
    baseUrl: "note.alafghani.info",   // Production domain
    ignorePatterns: [                  // Folders to ignore
      "private",
      "templates",
      ".obsidian"
    ],
    defaultDateType: "modified",       // Show last modified date
  },
}
```

### Theme Configuration

```typescript
theme: {
  fontOrigin: "googleFonts",
  cdnCaching: true,
  typography: {
    header: "Schibsted Grotesk",    // Headings font
    body: "Source Sans Pro",         // Body text font
    code: "IBM Plex Mono",           // Code blocks font
  },
  colors: {
    lightMode: {
      light: "#faf8f8",              // Page background
      lightgray: "#e5e5e5",          // Borders, dividers
      gray: "#b8b8b8",               // Secondary text
      darkgray: "#4e4e4e",           // Primary text
      dark: "#2b2b2b",               // Headings
      secondary: "#284b63",          // Links, accents
      tertiary: "#84a59d",           // Hover states
      highlight: "rgba(143, 159, 169, 0.15)",  // Highlights
      textHighlight: "#fff23688",    // Text highlight
    },
    darkMode: {
      light: "#161618",
      lightgray: "#393639",
      gray: "#646464",
      darkgray: "#d4d4d4",
      dark: "#ebebec",
      secondary: "#7b97aa",
      tertiary: "#84a59d",
      highlight: "rgba(143, 159, 169, 0.15)",
      textHighlight: "#b3aa0288",
    },
  },
}
```

---

## Plugins

### Transformer Plugins

Process and transform markdown content:

```typescript
transformers: [
  Plugin.FrontMatter(),                    // Parse YAML frontmatter
  Plugin.CreatedModifiedDate({             // Date handling
    priority: ["frontmatter", "git", "filesystem"],
  }),
  Plugin.SyntaxHighlighting({              // Code syntax colors
    theme: {
      light: "github-light",
      dark: "github-dark",
    },
    keepBackground: false,
  }),
  Plugin.ObsidianFlavoredMarkdown({        // Obsidian syntax support
    enableInHtmlEmbed: false
  }),
  Plugin.GitHubFlavoredMarkdown(),         // GFM tables, etc.
  Plugin.TableOfContents(),                // Auto TOC generation
  Plugin.CrawlLinks({                      // Link resolution
    markdownLinkResolution: "shortest"
  }),
  Plugin.Description(),                    // Meta descriptions
  Plugin.Latex({ renderEngine: "katex" }), // Math equations
],
```

### Filter Plugins

Control which content gets published:

```typescript
filters: [
  Plugin.ExplicitPublish()  // ONLY publish notes with `publish: true`
],
```

**Important:** With `ExplicitPublish()`, notes MUST have `publish: true` in frontmatter to be included in the build.

### Emitter Plugins

Generate output files:

```typescript
emitters: [
  Plugin.AliasRedirects(),     // Handle note aliases
  Plugin.ComponentResources(), // CSS/JS assets
  Plugin.ContentPage(),        // Individual note pages
  Plugin.FolderPage(),         // Folder index pages
  Plugin.TagPage(),            // Tag pages
  Plugin.ContentIndex({        // Search index + feeds
    enableSiteMap: true,
    enableRSS: true,
  }),
  Plugin.Assets(),             // Copy static assets
  Plugin.Static(),             // Static files
  Plugin.Favicon(),            // Favicon generation
  Plugin.NotFoundPage(),       // 404 page
  Plugin.CustomOgImages(),     // Open Graph images
],
```

---

## Key Configuration Options

### ExplicitPublish Filter

The most important filter for content control:

```typescript
filters: [Plugin.ExplicitPublish()]
```

**Behavior:**
- Notes with `publish: true` → Published
- Notes with `publish: false` → Not published
- Notes without `publish` field → Not published

**Example frontmatter:**
```yaml
---
publish: true
title: My Published Note
tags:
  - example
---

Content here...
```

### BaseUrl Setting

```typescript
baseUrl: "note.alafghani.info"
```

This affects:
- Canonical URLs in sitemap
- RSS feed links
- Open Graph meta tags
- Absolute link generation

**Note:** Do not include `https://` or trailing slash.

### Ignore Patterns

```typescript
ignorePatterns: ["private", "templates", ".obsidian"]
```

Files/folders matching these patterns are completely ignored during build.

---

## Content Folder Structure

Quartz reads content from the `content/` folder:

```
content/
├── index.md                    # Home page (required)
├── perubahan-iklim/            # Subfolder (becomes URL path)
│   ├── index.md                # Folder landing page
│   ├── BAB 1 -- Title --.md    # Individual pages
│   └── ...
└── other-notes.md              # Top-level pages
```

### URL Generation

| File Path | Generated URL |
|-----------|---------------|
| `content/index.md` | `/` |
| `content/about.md` | `/about` |
| `content/perubahan-iklim/index.md` | `/perubahan-iklim/` |
| `content/perubahan-iklim/BAB 1 -- Title --.md` | `/perubahan-iklim/bab-1----title---` |

**Slug conversion rules:**
- Spaces → `-`
- Uppercase → lowercase
- Special characters → removed or converted
- `.md` extension → removed

---

## Build Commands

### Local Development

```bash
cd C:\Users\mova\obsidian\mova-quartz

# Build and serve with live reload
npx quartz build --serve

# Opens at http://localhost:8080
# Changes to content/ trigger rebuild
```

### Production Build

```bash
# Build only
npx quartz build

# Output goes to public/
```

### Clean Build

```bash
# Remove cache and output
rm -rf public/ .quartz-cache/

# Fresh build
npx quartz build
```

### Update Quartz

```bash
# Sync with upstream Quartz (get latest features/fixes)
npx quartz sync
```

---

## Build Output

After `npx quartz build`, the `public/` folder contains:

```
public/
├── index.html                  # Home page
├── index.css                   # Compiled styles
├── index.xml                   # RSS feed
├── sitemap.xml                 # Sitemap
├── static/                     # Static assets
│   ├── contentIndex.json       # Search index
│   └── icon.png                # Favicon
├── perubahan-iklim/            # Content folders
│   ├── index.html
│   ├── bab-1----title---.html
│   └── ...
└── tags/                       # Tag pages
    └── example.html
```

---

## Frontmatter Reference

### Required Fields

```yaml
---
publish: true    # REQUIRED for ExplicitPublish filter
---
```

### Optional Fields

```yaml
---
publish: true
title: "Custom Page Title"          # Override filename as title
description: "Page description"      # Meta description
date: 2026-01-05                     # Created date
tags:
  - tag1
  - tag2
aliases:
  - old-page-name                    # Redirect from old URLs
draft: false                         # Set true to hide from listing
---
```

### Date Handling

The `CreatedModifiedDate` plugin checks dates in order:
1. `date` field in frontmatter
2. Git commit date
3. Filesystem modified date

Current config uses `defaultDateType: "modified"` to show last modified date.

---

## Customization

### Changing Colors

Edit `quartz.config.ts` under `theme.colors`:

```typescript
colors: {
  lightMode: {
    secondary: "#284b63",  // Change link color
    // ... other colors
  },
}
```

### Changing Fonts

Edit `quartz.config.ts` under `theme.typography`:

```typescript
typography: {
  header: "Your Font Name",
  body: "Your Font Name",
  code: "Your Monospace Font",
}
```

Fonts are loaded from Google Fonts by default.

### Adding Custom CSS

Create `quartz/styles/custom.scss` and import in `quartz/styles/base.scss`.

---

## Supported Content

### Markdown Features

| Feature | Syntax | Support |
|---------|--------|---------|
| Wikilinks | `[[Note Name]]` | ✅ |
| Wikilinks with alias | `[[Note Name\|Display Text]]` | ✅ |
| Headers | `# ## ###` | ✅ |
| Bold/Italic | `**bold** *italic*` | ✅ |
| Code blocks | ` ```language ``` ` | ✅ |
| Tables | GFM tables | ✅ |
| Callouts | `> [!note]` | ✅ |
| Mermaid diagrams | ` ```mermaid ``` ` | ✅ |
| LaTeX math | `$inline$` `$$block$$` | ✅ |
| Images | `![[image.png]]` | ✅ |
| External links | `[text](url)` | ✅ |
| Footnotes | `[^1]` | ✅ |

### Not Supported

- Audio embeds (`![[audio.mp3]]`) - Removed by plugin
- Video embeds
- Some Obsidian plugin-specific syntax
- Dataview queries
- Templater syntax

---

## Troubleshooting

### Note Not Appearing

1. **Check frontmatter:** Must have `publish: true`
   ```yaml
   ---
   publish: true
   ---
   ```

2. **Check location:** File must be in `content/` folder

3. **Check ignore patterns:** Not in `private/`, `templates/`, `.obsidian/`

4. **Rebuild:** Run `npx quartz build`

### Broken Links

- Wikilinks are case-sensitive in source
- Check spelling matches exactly
- Use `[[Exact File Name|Display]]` format

### Build Errors

```bash
# Check for syntax errors
npx quartz build

# Common causes:
# - Invalid YAML frontmatter (unclosed quotes, bad indentation)
# - Unclosed code blocks
# - Invalid markdown

# Clean build
rm -rf public/ .quartz-cache/
npx quartz build
```

### Slow Builds

- Large images slow down builds
- `CustomOgImages()` plugin adds build time
- Consider commenting out for development:
  ```typescript
  // Plugin.CustomOgImages(),
  ```

---

## Performance Tips

### Faster Development

```bash
# Skip OG image generation
# Comment out Plugin.CustomOgImages() in quartz.config.ts
```

### Production Optimization

Quartz automatically:
- Minifies CSS/JS
- Generates sitemap
- Creates RSS feed
- Optimizes images

---

## Related Documentation

- [CLAUDE.md](../CLAUDE.md) - Main project guide
- [Setup and Credentials](./Setup%20and%20Credentials.md) - Account info
- [Quartz Publisher Plugin](./Quartz%20Publisher%20Plugin.md) - Obsidian plugin
- [Quartz Official Docs](https://quartz.jzhao.xyz) - Full documentation
