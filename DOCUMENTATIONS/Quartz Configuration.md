# Quartz Configuration

## Overview

Quartz is a static site generator that transforms your Obsidian notes into a website.

**Version:** Quartz v4.5.2
**Documentation:** https://quartz.jzhao.xyz

## Key Configuration File

### quartz.config.ts

Location: `C:\Users\mova\obsidian\mova-quartz\quartz.config.ts`

```typescript
const config: QuartzConfig = {
  configuration: {
    pageTitle: "Mova's Notes",
    enableSPA: true,
    enablePopovers: true,
    analytics: { provider: "plausible" },
    locale: "en-US",
    baseUrl: "mova-quartz.netlify.app",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "created",
    theme: { /* ... */ },
  },
  plugins: {
    transformers: [ /* ... */ ],
    filters: [Plugin.RemoveDrafts(), Plugin.ExplicitPublish()],
    emitters: [ /* ... */ ],
  },
}
```

## Important Settings

### ExplicitPublish Filter

The `ExplicitPublish()` filter ensures only notes with `publish: true` in frontmatter are published.

```typescript
filters: [Plugin.RemoveDrafts(), Plugin.ExplicitPublish()],
```

This means:
- Notes without `publish: true` are **not** published
- The Quartz Publisher plugin automatically adds this field

### Ignored Patterns

```typescript
ignorePatterns: ["private", "templates", ".obsidian"],
```

Files in these folders are ignored during build.

### Base URL

```typescript
baseUrl: "mova-quartz.netlify.app",
```

This is your site's domain.

## Content Folder

Quartz reads content from: `content/`

This is configured in the build process and is the default Quartz behavior.

## Build Output

Built files go to: `public/`

This folder is:
- Gitignored
- Deployed to Netlify
- Recreated on each build

## Commands

### Build locally
```bash
cd C:\Users\mova\obsidian\mova-quartz
npx quartz build
```

### Build and serve locally (for preview)
```bash
npx quartz build --serve
```
Then open http://localhost:8080

### Sync with upstream Quartz (get updates)
```bash
npx quartz sync
```

## Theme Customization

Theme colors are in `quartz.config.ts` under `theme.colors`:

```typescript
theme: {
  colors: {
    lightMode: {
      light: "#faf8f8",
      lightgray: "#e5e5e5",
      gray: "#b8b8b8",
      darkgray: "#4e4e4e",
      dark: "#2b2b2b",
      secondary: "#284b63",
      tertiary: "#84a59d",
      highlight: "rgba(143, 159, 169, 0.15)",
      textHighlight: "#fff23688",
    },
    darkMode: { /* ... */ },
  },
}
```

## Plugins

Quartz uses a plugin system for content transformation:

### Transformers
Process markdown content:
- FrontMatter
- CreatedModifiedDate
- SyntaxHighlighting
- ObsidianFlavoredMarkdown
- GitHubFlavoredMarkdown
- TableOfContents
- CrawlLinks
- Description
- Latex

### Filters
Control what gets published:
- RemoveDrafts (removes draft: true notes)
- ExplicitPublish (requires publish: true)

### Emitters
Generate output files:
- AliasRedirects
- ComponentResources
- ContentPage
- FolderPage
- TagPage
- ContentIndex
- Assets
- Static
- NotFoundPage

## File Support

### Supported
- Markdown (.md)
- Images (png, jpg, jpeg, gif, svg, webp)
- Wikilinks `[[note]]`
- Callouts
- Mermaid diagrams
- LaTeX math
- Code blocks with syntax highlighting

### Not Supported
- Audio embeds (removed by plugin)
- Video embeds
- Some Obsidian-specific plugins

## Troubleshooting

### Note not appearing on site
1. Check `publish: true` in frontmatter
2. Ensure file is in `content/` folder
3. Rebuild: `npx quartz build`

### Broken links
- Quartz supports wikilinks but paths must match
- Check for typos in link names

### Build errors
```bash
# Check for syntax errors
npx quartz build

# Common issues:
# - Invalid YAML frontmatter
# - Unclosed code blocks
# - Invalid markdown syntax
```

### Slow builds
- Large vaults take longer
- Images are processed each build
- Consider using fewer large images
