import { IconLockLine } from "@karrotmarket/react-monochrome-icon";
import { getRootageMetadata } from "@/components/rootage";
import type { Node, Root } from "fumadocs-core/page-tree";
import type { ComponentType, SVGProps } from "react";

const iconMap: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  Lock: IconLockLine,
};

export const DeprecatedBadge = () => {
  return (
    <span className="px-1.5 py-0.5 text-xs bg-red-100 text-red-800 rounded ml-1 flex-none">
      Deprecated
    </span>
  );
};

export function getComponentIdFromUrl(url: string): string | null {
  const urlParts = url.split("/");
  const isComponentPage = urlParts.includes("components");
  return isComponentPage ? urlParts[urlParts.length - 1] : null;
}

export async function transformPageTreeWithBadges<
  // biome-ignore lint/suspicious/noExplicitAny: getNodePage parameter type varies by source
  T extends { getNodePage(node: any): { data?: { deprecated?: boolean | string } } | undefined },
>(tree: Root, sourceLoader: T): Promise<Root> {
  try {
    async function transformNode(node: Node): Promise<Node> {
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
              <span className="flex items-center" key={node.$id}>
                <span>{node.name}</span>
                <DeprecatedBadge />
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

export const iconHandler = (icon: string | undefined) => {
  if (!icon || !(icon in iconMap)) {
    return undefined;
  }

  const Icon = iconMap[icon];
  return <Icon />;
};
