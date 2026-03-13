export function compareSemver(a: string, b: string): number {
  const normalize = (v: string) =>
    v
      .replace(/^v/, "")
      .split(".")
      .map((part) => Number(part.replace(/[^\d].*$/, "")) || 0);

  const [aMajor = 0, aMinor = 0, aPatch = 0] = normalize(a);
  const [bMajor = 0, bMinor = 0, bPatch = 0] = normalize(b);

  if (aMajor !== bMajor) return aMajor - bMajor;
  if (aMinor !== bMinor) return aMinor - bMinor;
  if (aPatch !== bPatch) return aPatch - bPatch;
  return a.localeCompare(b);
}

export function getGroupAnchorId(packageName: string, version: string): string {
  const normalizedPackage = packageName
    .toLowerCase()
    .replace(/^@/, "")
    .replace(/[\/@]/g, "-")
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  const normalizedVersion = version
    .toLowerCase()
    .replace(/^v/, "")
    .replace(/[^a-z0-9.-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return `chg-${normalizedPackage}-${normalizedVersion}`;
}
