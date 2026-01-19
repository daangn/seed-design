import type { Root } from "fumadocs-core/page-tree";

let cachedSource: Awaited<ReturnType<typeof createLoader>> | null = null;
let cachedPageTree: Root | null = null;

async function createLoader() {
  const { lynxDocs } = await import("@/.source/server");
  const { loader } = await import("fumadocs-core/source");
  const { iconHandler } = await import("./shared");

  return loader({
    baseUrl: "/lynx",
    source: lynxDocs.toFumadocsSource(),
    icon: iconHandler,
  });
}

export async function getLynxSource() {
  if (!cachedSource) {
    cachedSource = await createLoader();
  }
  return cachedSource;
}

export async function getLynxPageTree(): Promise<Root> {
  if (!cachedPageTree) {
    const { transformPageTreeWithBadges } = await import("./shared");
    const source = await getLynxSource();
    cachedPageTree = await transformPageTreeWithBadges(source.pageTree, source);
  }
  return cachedPageTree;
}
