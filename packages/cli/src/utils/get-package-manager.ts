import { detect } from "@antfu/ni";

/**
 * `detect` reports the major version alongside the manager for the two that need it. Every
 * other name it can return is already the name we want, so only those two are rewritten.
 */
export async function getPackageManager(targetDir: string) {
  const packageManager = await detect({ programmatic: true, cwd: targetDir });

  if (packageManager === "yarn@berry") return "yarn";
  if (packageManager === "pnpm@6") return "pnpm";

  return packageManager ?? "npm";
}
