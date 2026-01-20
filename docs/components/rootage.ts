import "server-only";

import { buildContext, Exchange } from "@seed-design/rootage-core";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Re-export utility functions for backward compatibility
export {
  stringifyVariants,
  stringifyStates,
  stringifyTokenLit,
  stringifyValueLit,
} from "./rootage-utils";

const ROOTAGE_DIR = join(process.cwd(), "public", "rootage");

export const getRootage = async () => {
  const indexContent = await readFile(join(ROOTAGE_DIR, "index.json"), "utf-8");
  const index: { resources: { path: string }[] } = JSON.parse(indexContent);

  const sourceFiles = await Promise.all(
    index.resources.map(async (resource) => {
      const content = await readFile(join(ROOTAGE_DIR, resource.path), "utf-8");
      const res: Exchange.Model = JSON.parse(content);
      return {
        fileName: resource.path,
        ast: Exchange.fromObject(res),
      };
    }),
  );
  return buildContext(sourceFiles);
};

/**
 * Get rootage metadata for a specific component
 */
export async function getRootageMetadata(componentId: string) {
  const rootage = await getRootage();
  const sourceFile = rootage.sourceFiles.find(
    (f) => f.ast.kind === "ComponentSpecDocument" && f.ast.data.id === componentId,
  );

  if (!sourceFile?.ast.metadata) return null;

  const deprecatedField = sourceFile.ast.metadata.fields.find(
    (field) => field.key === "deprecated",
  );

  return {
    deprecated: Boolean(deprecatedField?.value),
    deprecatedMessage: typeof deprecatedField?.value === "string" ? deprecatedField.value : null,
  };
}

export async function getComponentStatus(
  params: { slug?: string[] },
  pageData?: { deprecated?: string },
) {
  if (pageData?.deprecated) {
    return {
      deprecated: true,
      deprecatedMessage: pageData.deprecated,
    };
  }

  const componentId = params.slug?.[1];
  if (componentId && params.slug?.[0] === "components") {
    const metadata = await getRootageMetadata(componentId);
    if (metadata?.deprecated) {
      return {
        deprecated: true,
        deprecatedMessage: metadata.deprecatedMessage,
      };
    }
  }

  return { deprecated: false, deprecatedMessage: null };
}
