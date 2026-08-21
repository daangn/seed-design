import "server-only";

import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { cache } from "react";
import { Authoring, buildContext } from "@seed-design/rootage-core";
import YAML from "yaml";

// `process.cwd()` is `docs/` during Next.js build/runtime.
// `@seed-design/rootage-artifacts` is the workspace package at `packages/rootage`.
// Authoring YAML을 소스로 쓴다 — exchange JSON(__generated__)은 excludeFromExchange 토큰이
// 빠져 있어, 아직 산출물에 남아 그 토큰을 참조하는 컴포넌트 스펙(예: control-chip)의 해석이
// 실패한다. 문서는 저장소 내부 소비자이므로 authoring 소스를 기준으로 렌더링한다.
const ROOTAGE_SOURCE = join(process.cwd(), "..", "packages", "rootage");

export const getRootage = cache(async () => {
  const paths = (await readdir(ROOTAGE_SOURCE, { recursive: true })).filter((path) =>
    path.endsWith(".yaml"),
  );
  const sourceFiles = await Promise.all(
    paths.map(async (path) => ({
      fileName: path,
      ast: Authoring.fromObject(
        YAML.parse(await readFile(join(ROOTAGE_SOURCE, path), "utf-8")) as Authoring.Model,
      ),
    })),
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
