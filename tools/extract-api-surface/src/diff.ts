import type { PackageSurface } from "./extract";
import { renderPackage } from "./render";
import { unifiedDiff } from "./unified-diff";

export interface PackageDiff {
  name: string;
  /** Unified diff hunks, starting at the first `@@` line. */
  patch: string;
  added: number;
  removed: number;
}

/** Line diff of each package's rendered surface; a package on one side only diffs against nothing. */
export function diffSurfaces(base: PackageSurface[], head: PackageSurface[]): PackageDiff[] {
  const render = (packages: PackageSurface[]) =>
    new Map(packages.map((pkg) => [pkg.name, renderPackage(pkg).trimEnd().split("\n")]));
  const baseLines = render(base);
  const headLines = render(head);

  return [...new Set([...baseLines.keys(), ...headLines.keys()])]
    .sort((a, b) => a.localeCompare(b))
    .map((name) => {
      const patch = unifiedDiff(baseLines.get(name) ?? [], headLines.get(name) ?? []);
      const lines = patch.split("\n");

      return {
        name,
        patch,
        added: lines.filter((line) => line.startsWith("+")).length,
        removed: lines.filter((line) => line.startsWith("-")).length,
      };
    })
    .filter((diff) => diff.patch !== "");
}
