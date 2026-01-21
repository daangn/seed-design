import type { Root } from "fumadocs-core/page-tree";

let cachedSource: Awaited<ReturnType<typeof createLoader>> | null = null;
let cachedPageTree: Root | null = null;

async function createLoader() {
  const { reactDocs } = await import("@/.source/server");
  const { loader } = await import("fumadocs-core/source");
  const { iconHandler } = await import("./shared");

  return loader({
    baseUrl: "/react",
    source: reactDocs.toFumadocsSource(),
    icon: iconHandler,
  });
}

export async function getReactSource() {
  if (!cachedSource) {
    cachedSource = await createLoader();
  }
  return cachedSource;
}

export async function getReactPageTree(): Promise<Root> {
  if (!cachedPageTree) {
    const { transformPageTreeWithBadges } = await import("./shared");
    const source = await getReactSource();
    cachedPageTree = await transformPageTreeWithBadges(source.pageTree, source);
  }
  return cachedPageTree;
}
