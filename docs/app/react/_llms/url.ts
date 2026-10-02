import { REACT_ARCHIVE_VERSION } from "@/lib/docs-archive";
const OWNER = "daangn";
const REPO = "seed-design";

export function getSourceUrl(pagePath: string) {
  return `https://github.com/${OWNER}/${REPO}/blob/${REACT_ARCHIVE_VERSION ? `react/${REACT_ARCHIVE_VERSION}` : "dev"}/docs/content/react/${pagePath}`;
}
