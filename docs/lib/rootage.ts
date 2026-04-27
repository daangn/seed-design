import "server-only";

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { buildContext, Exchange } from "@seed-design/rootage-core";
import index from "@seed-design/rootage-artifacts/index.json";

// `process.cwd()` is `docs/` during Next.js build/runtime.
// `@seed-design/rootage-artifacts` is the workspace package at `packages/rootage`.
const ROOTAGE_DIST = join(process.cwd(), "..", "packages", "rootage", "dist");

export const getRootage = async () => {
  const sourceFiles = await Promise.all(
    index.resources.map(async (resource) => {
      const content = await readFile(join(ROOTAGE_DIST, resource.path), "utf-8");
      return {
        fileName: resource.path,
        ast: Exchange.fromObject(JSON.parse(content) as Exchange.Model),
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
