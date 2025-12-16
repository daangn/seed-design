import { breezeDocs, docs, lynxDocs, reactDocs } from "@/.source";
import { getRootageMetadata } from "@/components/rootage";
import { IconContainer } from "@/components/ui/icon";
import type { Node, Root } from "fumadocs-core/page-tree";
import { loader } from "fumadocs-core/source";
import { execSync } from "node:child_process";
import path from "node:path";

import { NotificationBadge } from "@seed-design/react";
import { icons } from "lucide-react";

// Cache for git last modified dates
let gitDatesCache: Map<string, Date> | null = null;

function getGitLastModifiedDates(): Map<string, Date> {
  if (gitDatesCache) return gitDatesCache;

  gitDatesCache = new Map();

  try {
    // Get last modified dates for all files in content directories
    // Run from the repository root (parent of docs folder)
    const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");
    const result = execSync(
      'git log --format="%H %aI" --name-only --diff-filter=ACMR -- "docs/content"',
      { encoding: "utf-8", maxBuffer: 10 * 1024 * 1024, cwd: repoRoot },
    );

    const lines = result.split("\n");
    let currentDate: Date | null = null;

    for (const line of lines) {
      if (!line.trim()) continue;

      // Check if this is a commit line (hash + ISO date)
      const commitMatch = line.match(/^[a-f0-9]{40} (.+)$/);
      if (commitMatch) {
        currentDate = new Date(commitMatch[1]);
        continue;
      }

      // This is a file path - only set if we don't already have a date (first commit = most recent)
      if (currentDate && line.startsWith("docs/content/") && !gitDatesCache.has(line)) {
        gitDatesCache.set(line, currentDate);
      }
    }
  } catch (error) {
    console.warn("Failed to get git last modified dates:", error);
  }

  return gitDatesCache;
}

const DeprecatedBadge = () => {
  return (
    <span className="px-1.5 py-0.5 text-xs bg-red-100 text-red-800 rounded ml-1 flex-none">
      Deprecated
    </span>
  );
};

const UpdatedBadge = () => {
  return <NotificationBadge size="small" style={{ transform: "translateX(6px)" }} />;
};

const RECENTLY_UPDATED_DAYS = 14;

function isRecentlyUpdated(lastModified: Date | undefined): boolean {
  if (!lastModified) return false;
  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - RECENTLY_UPDATED_DAYS);
  return new Date(lastModified) > fourteenDaysAgo;
}

function getComponentIdFromUrl(url: string): string | null {
  const urlParts = url.split("/");
  const isComponentPage = urlParts.includes("components");
  return isComponentPage ? urlParts[urlParts.length - 1] : null;
}

async function transformPageTreeWithBadges(
  tree: Root,
  sourceLoader: typeof baseSource,
  contentDir: string,
): Promise<Root> {
  try {
    async function transformNode(node: Node): Promise<Node> {
      if (node.type === "page") {
        const page = sourceLoader.getNodePage(node);
        if (!page) return node;

        // 1. Check deprecated status (only for component pages)
        const componentId = getComponentIdFromUrl(node.url);
        let isDeprecated = false;
        if (componentId) {
          const frontmatterDeprecated = page?.data?.deprecated;
          const metadata = frontmatterDeprecated ? null : await getRootageMetadata(componentId);
          isDeprecated = frontmatterDeprecated ? true : Boolean(metadata?.deprecated);
        }

        // 2. Check updated status (for all pages, only if not deprecated)
        const gitDates = getGitLastModifiedDates();
        const filePath = `docs/content/${contentDir}/${page.path}`;
        const lastModified = gitDates.get(filePath);
        const isUpdated = !isDeprecated && isRecentlyUpdated(lastModified);

        // 3. Render badges
        if (isDeprecated) {
          return {
            ...node,
            name: (
              <span className="flex items-center" key={node.$id}>
                <span>{node.name}</span>
                <DeprecatedBadge />
              </span>
            ),
          };
        }

        if (isUpdated) {
          return {
            ...node,
            name: (
              <span className="flex items-center" key={node.$id}>
                {node.name}
                <UpdatedBadge />
              </span>
            ),
          };
        }

        return node;
      }

      if (node.type === "folder" && node.children) {
        return {
          ...node,
          children: await Promise.all(node.children.map(transformNode)),
        };
      }

      return node;
    }

    return {
      ...tree,
      children: await Promise.all(tree.children.map(transformNode)),
    };
  } catch (error) {
    console.warn("Failed to transform page tree with labels:", error);
    return tree;
  }
}

const iconHandler = (icon: string | undefined) => {
  if (!icon || !(icon in icons)) {
    return undefined;
  }

  return <IconContainer icon={icons[icon as keyof typeof icons]} />;
};

const baseSource = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
  icon: iconHandler,
});

const baseReactSource = loader({
  baseUrl: "/react",
  source: reactDocs.toFumadocsSource(),
  icon: iconHandler,
});

const baseBreezeSource = loader({
  baseUrl: "/breeze",
  source: breezeDocs.toFumadocsSource(),
  icon: iconHandler,
});

const baseLynxSource = loader({
  baseUrl: "/lynx",
  source: lynxDocs.toFumadocsSource(),
  icon: iconHandler,
});

// Transform page trees with badges
async function getTransformedPageTree(): Promise<Root> {
  return await transformPageTreeWithBadges(baseSource.pageTree, baseSource, "docs");
}

async function getTransformedReactPageTree(): Promise<Root> {
  return await transformPageTreeWithBadges(baseReactSource.pageTree, baseReactSource, "react");
}

async function getTransformedBreezePageTree(): Promise<Root> {
  return await transformPageTreeWithBadges(baseBreezeSource.pageTree, baseBreezeSource, "breeze");
}

async function getTransformedLynxPageTree(): Promise<Root> {
  return await transformPageTreeWithBadges(baseLynxSource.pageTree, baseLynxSource, "lynx");
}

// Export sources with lazy-loaded transformed page trees
export const source = {
  ...baseSource,
  getTransformedPageTree,
};

export const reactSource = {
  ...baseReactSource,
  getTransformedReactPageTree,
};

export const breezeSource = {
  ...baseBreezeSource,
  getTransformedBreezePageTree,
};

export const lynxSource = {
  ...baseLynxSource,
  getTransformedLynxPageTree,
};
