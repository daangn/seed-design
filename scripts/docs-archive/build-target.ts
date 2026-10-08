import { appendFile } from "node:fs/promises";
import { archivePrefix, validateSourceBranch } from "./config";

export function docsBuildTarget(branch: string) {
  validateSourceBranch(branch);
  const channel = /^(react|lynx)\/(v[^/]+)$/.exec(branch);
  if (!channel) {
    if (/^(react|lynx)\/v/.test(branch)) throw new Error("Invalid archive build channel");
    return {
      "output-dir": "docs/out",
      "archive-platform": "",
      "archive-version": "",
      prefix: "",
      "preview-path": "",
      "cache-generation": "baseline",
    };
  }
  const [, platform, version] = channel;
  const prefix = archivePrefix({ platform, version });
  return {
    "output-dir": "docs/out-archive",
    "archive-platform": platform,
    "archive-version": version,
    prefix: `${prefix.slice(1)}/`,
    "preview-path": `${prefix}/`,
    "cache-generation": `${platform}-${version}-archive`,
  };
}

if (import.meta.main) {
  const branch = process.env.DOCS_ARCHIVE_SOURCE_BRANCH ?? process.env.GITHUB_REF_NAME;
  if (!branch || !process.env.GITHUB_OUTPUT)
    throw new Error("GITHUB_REF_NAME and GITHUB_OUTPUT are required");
  const target = docsBuildTarget(branch);
  await appendFile(
    process.env.GITHUB_OUTPUT,
    Object.entries(target)
      .map(([key, value]) => `${key}=${value}\n`)
      .join(""),
  );
}
