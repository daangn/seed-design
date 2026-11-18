// The docs index keeps logical /react URLs even when served under an archive base URL.
export function docsSource(baseUrl: string) {
  const base = baseUrl.replace(/\/+$/, "");
  const version = new URL(base).pathname.match(/^\/react\/(v(?:[1-9]\d*|1\.(?:0|[1-9]\d*)))$/)?.[1];
  const relativeDoc = (docUrl: string) =>
    version
      ? docUrl.replace(new RegExp(`^/react/(?:${version.replaceAll(".", "\\.")})(?=/|$)`), "/react")
      : docUrl;
  return {
    document(docUrl: string) {
      const logical = relativeDoc(docUrl);
      return `${base}${version ? logical.replace(/^\/react(?=\/|$)/, "") : logical}`;
    },
    llms(docUrl: string) {
      return `${base}/llms${relativeDoc(docUrl)}.txt`;
    },
    llmsIndex(docUrl: string) {
      return `${base}/llms${relativeDoc(docUrl)}/llms.txt`;
    },
    snippet(registryPath: string, snippetPath: string) {
      const branch = version ? `react/${version}` : "dev";
      return `https://raw.githubusercontent.com/daangn/seed-design/refs/heads/${branch}/docs/registry/${registryPath}/${snippetPath}`;
    },
  };
}
