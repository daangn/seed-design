import { IconLockLine } from "@karrotmarket/react-monochrome-icon";
import { docs, reactDocs, breezeDocs, lynxDocs, aiIntegrationDocs } from "@/.source/server";
import { loader, type LoaderPlugin, type StaticSource } from "fumadocs-core/source";
import type { ComponentType, SVGProps } from "react";

const iconMap: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  Lock: IconLockLine,
};

const iconHandler = (icon: string | undefined) => {
  if (!icon || !(icon in iconMap)) return undefined;

  const Icon = iconMap[icon];
  return <Icon />;
};

const DeprecatedBadge = () => (
  <span className="px-1.5 py-0.5 text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded ml-2 flex-none">
    Deprecated
  </span>
);

function deprecatedBadgePlugin(): LoaderPlugin {
  return {
    name: "seed-design:deprecated-badge",
    transformPageTree: {
      file(node, filePath) {
        const file = filePath ? this.storage.read(filePath) : undefined;
        if (file?.format !== "page") return node;
        if (!("deprecated" in file.data) || !file.data.deprecated) return node;

        return {
          ...node,
          name: (
            <span className="flex items-center" key={node.$id}>
              <span>{node.name}</span>
              <DeprecatedBadge />
            </span>
          ),
        };
      },
    },
  };
}

function createSource<TSrc extends StaticSource>(src: TSrc, baseUrl: string) {
  return loader(src, {
    baseUrl,
    icon: iconHandler,
    plugins: [deprecatedBadgePlugin()],
  });
}

export const docsSource = createSource(docs.toFumadocsSource(), "/docs");
export const reactSource = createSource(reactDocs.toFumadocsSource(), "/react");
export const breezeSource = createSource(breezeDocs.toFumadocsSource(), "/breeze");
export const lynxSource = createSource(lynxDocs.toFumadocsSource(), "/lynx");
export const aiIntegrationSource = createSource(
  aiIntegrationDocs.toFumadocsSource(),
  "/ai-integration",
);
