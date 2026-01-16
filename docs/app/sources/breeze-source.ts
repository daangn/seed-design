import type { Root } from "fumadocs-core/page-tree";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LoaderReturn = any;

let cachedSource: LoaderReturn | null = null;
let cachedPageTree: Root | null = null;

async function createLoader(): Promise<LoaderReturn> {
  const { breezeDocs } = await import("@/.source/server");
  const { loader } = await import("fumadocs-core/source");
  const { iconHandler } = await import("./shared");

  return loader({
    baseUrl: "/breeze",
    source: breezeDocs.toFumadocsSource(),
    icon: iconHandler,
  });
}

export async function getBreezeSource(): Promise<LoaderReturn> {
  if (!cachedSource) {
    cachedSource = await createLoader();
  }
  return cachedSource;
}

export async function getBreezePageTree(): Promise<Root> {
  if (!cachedPageTree) {
    const { transformPageTreeWithBadges } = await import("./shared");
    const source = await getBreezeSource();
    cachedPageTree = await transformPageTreeWithBadges(source.pageTree, source);
  }
  return cachedPageTree;
}
