import { IconLockLine } from "@karrotmarket/react-monochrome-icon";
import { docs, reactDocs, breezeDocs, lynxDocs, aiIntegrationDocs } from "@/.source/server";
import { getRootageMetadata } from "@/components/rootage";
import type { Node, Root } from "fumadocs-core/page-tree";
import { loader, type StaticSource } from "fumadocs-core/source";
import type { ComponentType, SVGProps } from "react";

const iconMap: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  Lock: IconLockLine,
};

const DeprecatedBadge = () => {
  return (
    <span className="px-1.5 py-0.5 text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded ml-2 flex-none">
      Deprecated
    </span>
  );
};

function getComponentIdFromUrl(url: string): string | null {
  const urlParts = url.split("/");
  const isComponentPage = urlParts.includes("components");
  return isComponentPage ? urlParts[urlParts.length - 1] : null;
}

type FumadocsSource<TSrc extends StaticSource> = StaticSource<{
  pageData: Extract<TSrc["files"][number], { type: "page" }>["data"];
  metaData: Extract<TSrc["files"][number], { type: "meta" }>["data"];
}>;

function createSource<TSrc extends StaticSource>(src: TSrc, baseUrl: string) {
  const narrowed: FumadocsSource<TSrc> = src;
  return loader(narrowed, { baseUrl, icon: iconHandler });
}

const iconHandler = (icon: string | undefined) => {
  if (!icon || !(icon in iconMap)) {
    return undefined;
  }

  const Icon = iconMap[icon];
  return <Icon />;
};

const baseDocsSource = createSource(docs.toFumadocsSource(), "/docs");
const baseReactSource = createSource(reactDocs.toFumadocsSource(), "/react");
const baseBreezeSource = createSource(breezeDocs.toFumadocsSource(), "/breeze");
const baseLynxSource = createSource(lynxDocs.toFumadocsSource(), "/lynx");
const baseAiIntegrationSource = createSource(
  aiIntegrationDocs.toFumadocsSource(),
  "/ai-integration",
);

async function transformPageTreeWithBadges<TSrc extends typeof baseDocsSource>(
  tree: Root,
  sourceLoader: TSrc,
): Promise<Root> {
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

async function getTransformedPageTree(): Promise<Root> {
  return await transformPageTreeWithBadges(baseDocsSource.pageTree, baseDocsSource);
}

async function getTransformedReactPageTree(): Promise<Root> {
  return await transformPageTreeWithBadges(baseReactSource.pageTree, baseReactSource);
}

async function getTransformedBreezePageTree(): Promise<Root> {
  return await transformPageTreeWithBadges(baseBreezeSource.pageTree, baseBreezeSource);
}

async function getTransformedLynxPageTree(): Promise<Root> {
  return await transformPageTreeWithBadges(baseLynxSource.pageTree, baseLynxSource);
}

async function getTransformedAiIntegrationPageTree(): Promise<Root> {
  return await transformPageTreeWithBadges(
    baseAiIntegrationSource.pageTree,
    baseAiIntegrationSource,
  );
}

// Export sources with lazy-loaded transformed page trees
export const docsSource = {
  ...baseDocsSource,
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

export const aiIntegrationSource = {
  ...baseAiIntegrationSource,
  getTransformedAiIntegrationPageTree,
};
