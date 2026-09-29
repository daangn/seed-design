import { appendFile } from "node:fs/promises";
import archives from "./archives.json";
import { archivePrefix } from "./config";
import { verifyArchive } from "./verify";

const archive = archives.find((entry) => entry.sourceBranch === process.env.GITHUB_REF_NAME);
if (!archive) throw new Error("No archive configured for this branch");
const { sourceBranch: _, ...definition } = archive;
const sourceSha = process.env.GITHUB_SHA ?? "";
// Check the immutable upload first, then the branch alias that the public Worker will serve.
for (const origin of new Set([process.env.PAGES_DEPLOYMENT_URL, process.env.PAGES_ALIAS_URL])) {
  if (!origin) throw new Error("Pages did not return both deployment and alias URLs");
  await verifyArchive({ ...definition, origin, sourceSha });
}
if (process.env.GITHUB_STEP_SUMMARY) {
  await appendFile(
    process.env.GITHUB_STEP_SUMMARY,
    [
      "## Verified archive preview",
      "",
      `- Path: ${archivePrefix(archive)}`,
      `- Origin for archives.json: ${process.env.PAGES_ALIAS_URL}`,
      `- Source branch: ${process.env.GITHUB_REF_NAME}`,
      `- Source SHA: ${sourceSha}`,
      "- Verification passed for both immutable deployment and branch alias.",
      "",
    ].join("\n"),
  );
}
