import "server-only";

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { cache } from "react";
import { buildContext, Exchange } from "@seed-design/rootage-core";
import index from "@seed-design/rootage-artifacts/index.json";

// `process.cwd()` is `docs/` during Next.js build/runtime.
// `@seed-design/rootage-artifacts` is the workspace package at `packages/rootage`.
const ROOTAGE_DATA = join(process.cwd(), "..", "packages", "rootage", "__generated__");

export const getRootage = cache(async () => {
  const sourceFiles = await Promise.all(
    index.resources.map(async (resource) => {
      const content = await readFile(join(ROOTAGE_DATA, resource.path), "utf-8");
      return {
        fileName: resource.path,
        ast: Exchange.fromObject(JSON.parse(content) as Exchange.Model),
      };
    }),
  );
  return buildContext(sourceFiles);
});

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
  };
}

export async function getComponentStatus(
  params: { slug?: string[] },
  pageData?: { deprecated?: boolean },
) {
  if (pageData?.deprecated) return { deprecated: true };

  const componentId = params.slug?.[0] === "components" ? params.slug[1] : undefined;
  if (!componentId) return { deprecated: false };

  const metadata = await getRootageMetadata(componentId);
  if (!metadata?.deprecated) return { deprecated: false };

  return { deprecated: true };
}
