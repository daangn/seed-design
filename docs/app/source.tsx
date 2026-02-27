import { IconLockLine } from "@karrotmarket/react-monochrome-icon";
import { docs, reactDocs, breezeDocs, lynxDocs, aiIntegrationDocs } from "@/.source/server";
import { getRootageMetadata } from "@/components/rootage";
import type { Node, Root } from "fumadocs-core/page-tree";
import { loader } from "fumadocs-core/source";
import type { Source, SourceConfig } from "fumadocs-core/source";
import type { ComponentType, SVGProps } from "react";

const iconMap: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  Lock: IconLockLine,
};

const DeprecatedBadge = () => {
  return (
    <span className="px-1.5 py-0.5 text-xs bg-red-100 text-red-800 rounded ml-1 flex-none">
      Deprecated
    </span>
  );
};

function getComponentIdFromUrl(url: string): string | null {
  const urlParts = url.split("/");
  const isComponentPage = urlParts.includes("components");
  return isComponentPage ? urlParts[urlParts.length - 1] : null;
}

async function transformPageTreeWithBadges(
  tree: Root,
  sourceLoader: typeof baseDocsSource,
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

const iconHandler = (icon: string | undefined) => {
  if (!icon || !(icon in iconMap)) {
    return undefined;
  }

  const Icon = iconMap[icon];
  return <Icon />;
};

type SourceConfigFromSource<TSource extends { files: Array<{ type: string; data: unknown }> }> = {
  pageData: Extract<TSource["files"][number], { type: "page" }>["data"];
  metaData: Extract<TSource["files"][number], { type: "meta" }>["data"];
} & SourceConfig;

function createTypedLoader<TSource extends { files: Array<{ type: string; data: unknown }> }>(
  baseUrl: string,
  source: TSource,
) {
  type Config = SourceConfigFromSource<TSource>;

  return loader<Config>({
    baseUrl,
    source: source as unknown as Source<Config>,
    icon: iconHandler,
  });
}

const baseDocsSource = createTypedLoader("/docs", docs.toFumadocsSource());

const baseReactSource = createTypedLoader("/react", reactDocs.toFumadocsSource());

const baseBreezeSource = createTypedLoader("/breeze", breezeDocs.toFumadocsSource());

const baseLynxSource = createTypedLoader("/lynx", lynxDocs.toFumadocsSource());

const baseAiIntegrationSource = createTypedLoader(
  "/ai-integration",
  aiIntegrationDocs.toFumadocsSource(),
);

// Transform page trees with badges
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
