import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/jackyzha0/quartz",
      "Discord Community": "https://discord.gg/cRFFHYye7t",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer({
      mapFn: (node) => {
        // Clean up folder display names: "06-PerubahanIklim" → "Perubahan Iklim"
        const folderMap: Record<string, string> = {
          "01-Lingkungan": "Hukum Lingkungan",
          "06-PerubahanIklim": "Perubahan Iklim",
          "07-IntLaw": "International Law",
        }
        if (node.isFolder && folderMap[node.displayName]) {
          node.displayName = folderMap[node.displayName]
        }
      },
    }),
  ],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer({
      mapFn: (node) => {
        // Clean up folder display names: "06-PerubahanIklim" → "Perubahan Iklim"
        const folderMap: Record<string, string> = {
          "01-Lingkungan": "Hukum Lingkungan",
          "06-PerubahanIklim": "Perubahan Iklim",
          "07-IntLaw": "International Law",
        }
        if (node.isFolder && folderMap[node.displayName]) {
          node.displayName = folderMap[node.displayName]
        }
      },
    }),
  ],
  right: [],
}
