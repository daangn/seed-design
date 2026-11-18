import { buildContext, Exchange, type RootageCtx } from "@seed-design/rootage-core";
import index from "@seed-design/rootage-artifacts/index.json";

// rootage 산출물(`packages/rootage/__generated__`)을 render 중 fs로 읽지 않고 JSON module로 import한다.
// module graph에 들어가야 Astro incremental build가 rootage 변경을 감지한다. 빌드 동안 한 번만 만든다.
const files = import.meta.glob<Exchange.Model>("../../packages/rootage/__generated__/**/*.json", {
  eager: true,
  import: "default",
});

let rootage: RootageCtx | undefined;

export function getRootage(): RootageCtx {
  if (rootage) return rootage;
  const sourceFiles = index.resources.map((resource) => {
    const model = files[`../../packages/rootage/__generated__${resource.path}`];
    if (!model) throw new Error(`rootage 산출물이 없습니다: ${resource.path}`);
    return { fileName: resource.path, ast: Exchange.fromObject(model) };
  });
  rootage = buildContext(sourceFiles);
  return rootage;
}

export function getRootageMetadata(componentId: string) {
  const sourceFile = getRootage().sourceFiles.find(
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

export function getComponentStatus(
  params: { slug?: string[] },
  pageData?: { deprecated?: boolean },
) {
  if (pageData?.deprecated) return { deprecated: true };

  const componentId = params.slug?.[0] === "components" ? params.slug[1] : undefined;
  if (!componentId) return { deprecated: false };

  const metadata = getRootageMetadata(componentId);
  if (!metadata?.deprecated) return { deprecated: false };

  return { deprecated: true };
}
