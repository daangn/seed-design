import { readFileSync } from "node:fs";
import path from "node:path";

const readJson = (file: string) => JSON.parse(readFileSync(file, "utf8"));

/** Workspace packages under `root` that are published to npm, in name order. */
export function findPublicPackages(root: string) {
  const { workspaces = [] }: { workspaces?: string[] } = readJson(path.join(root, "package.json"));

  return workspaces
    .flatMap((pattern) => [...new Bun.Glob(`${pattern}/package.json`).scanSync({ cwd: root })])
    .map((file): { name?: string; private?: boolean } => readJson(path.join(root, file)))
    .flatMap((manifest) => (manifest.name && !manifest.private ? [manifest.name] : []))
    .sort((a, b) => a.localeCompare(b));
}

if (import.meta.main) console.log(findPublicPackages(process.argv[2] ?? ".").join("\n"));
