import { appendFile } from "node:fs/promises";
import archives from "./archives.json";
import { type ArchiveDefinition, archivePrefix, validateSourceBranch } from "./config";

export function docsBuildTarget(branch: string, definitions: readonly ArchiveDefinition[]) {
  const targets = definitions.filter((entry) => entry.sourceBranch === branch);
  if (targets.length > 1) throw new Error(`Multiple archive builds configured for ${branch}`);
  const archive = targets[0];
  if (!archive) {
    return {
      "output-dir": "docs/out",
      "archive-version": "",
      prefix: "",
      "preview-path": "",
      "cache-generation": "baseline",
    };
  }
  validateSourceBranch(branch);
  const prefix = archivePrefix(archive);
  if (archive.platform !== "react") {
    throw new Error(
      `Implement the ${archive.platform} archive exporter before enabling its Pages build`,
    );
  }
  return {
    "output-dir": "docs/out-archive",
    "archive-version": archive.version,
    prefix: `${prefix.slice(1)}/`,
    "preview-path": `${prefix}/`,
    "cache-generation": `${archive.platform}-${archive.version}-archive`,
  };
}

if (import.meta.main) {
  const branch = process.env.GITHUB_REF_NAME;
  if (!branch || !process.env.GITHUB_OUTPUT)
    throw new Error("GITHUB_REF_NAME and GITHUB_OUTPUT are required");
  const target = docsBuildTarget(branch, archives);
  await appendFile(
    process.env.GITHUB_OUTPUT,
    Object.entries(target)
      .map(([key, value]) => `${key}=${value}\n`)
      .join(""),
  );
}
