const OWNER = "daangn";
const REPO = "seed-design";

export function getSourceUrl(pagePath: string) {
  return `https://github.com/${OWNER}/${REPO}/blob/dev/docs/content/breeze/${pagePath}`;
}
