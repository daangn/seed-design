import type { Root } from "fumadocs-core/page-tree";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LoaderReturn = any;

let cachedSource: LoaderReturn | null = null;
let cachedPageTree: Root | null = null;

async function createLoader(): Promise<LoaderReturn> {
  const { docs } = await import("@/.source/server");
  const { loader } = await import("fumadocs-core/source");
  const { iconHandler } = await import("./shared");

  return loader({
    baseUrl: "/docs",
    source: docs.toFumadocsSource(),
    icon: iconHandler,
  });
}

export async function getDocsSource(): Promise<LoaderReturn> {
  if (!cachedSource) {
    cachedSource = await createLoader();
  }
  return cachedSource;
}

export async function getDocsPageTree(): Promise<Root> {
  if (!cachedPageTree) {
    const { transformPageTreeWithBadges } = await import("./shared");
    const source = await getDocsSource();
    cachedPageTree = await transformPageTreeWithBadges(source.pageTree, source);
  }
  return cachedPageTree;
}
