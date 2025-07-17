import { docs, reactDocs } from "@/.source";
import { getRootageMetadata } from "@/components/rootage";
import { IconContainer } from "@/components/ui/icon";
import type { PageTree } from "fumadocs-core/server";
import { loader } from "fumadocs-core/source";

import { icons } from "lucide-react";
import { createElement } from "react";

const DeprecatedBadge = () => {
  return (
    <span className="px-1.5 py-0.5 text-xs bg-red-100 text-red-800 rounded ml-1">Deprecated</span>
  );
};

function getComponentIdFromUrl(url: string): string | null {
  const urlParts = url.split("/");
  const isComponentPage = urlParts.includes("components");
  return isComponentPage ? urlParts[urlParts.length - 1] : null;
}

async function transformPageTreeWithBadges(
  tree: PageTree.Root,
  sourceLoader: typeof baseSource,
): Promise<PageTree.Root> {
  try {
    async function transformNode(node: PageTree.Node): Promise<PageTree.Node> {
      if (node.type === "page") {
        const componentId = getComponentIdFromUrl(node.url);
        const page = sourceLoader.getNodePage(node);
        if (!componentId) return node;

        // 1. Check frontmatter deprecated (priority 1)
        const frontmatterDeprecated = page?.data?.deprecated;
        // 2. Get rootage metadata once if needed
        const metadata = frontmatterDeprecated ? null : await getRootageMetadata(componentId);
        // Determine deprecated status and message
        const deprecated = frontmatterDeprecated ? true : Boolean(metadata?.deprecated);
        // 3. Check updated status (priority 3) - only if not deprecated
        if (deprecated) {
          return {
            ...node,
            name: (
              <div className="flex items-center">
                <span>{node.name}</span>
                <DeprecatedBadge />
              </div>
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

// Create base sources
const baseSource = loader({
  baseUrl: "/docs",
  icon(icon) {
    if (icon && icon in icons)
      return createElement(IconContainer, {
        icon: icons[icon as keyof typeof icons],
      });
  },
  source: docs.toFumadocsSource(),
});

const baseReactSource = loader({
  baseUrl: "/react",
  source: reactDocs.toFumadocsSource(),
});

// Transform page trees with badges
async function getTransformedPageTree(): Promise<PageTree.Root> {
  return await transformPageTreeWithBadges(baseSource.pageTree, baseSource);
}

async function getTransformedReactPageTree(): Promise<PageTree.Root> {
  return await transformPageTreeWithBadges(baseReactSource.pageTree, baseReactSource);
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
