import { appendFile } from "node:fs/promises";
import { docsBuildTarget } from "./build-target";
import { verifyArchive } from "./verify";

interface PreviewOptions {
  channel: string;
  sourceBranch: string;
  sourceSha: string;
  deploymentUrl?: string;
  aliasUrl?: string;
}

export async function verifyArchivePreview(options: PreviewOptions, fetcher: typeof fetch = fetch) {
  const target = docsBuildTarget(options.channel);
  const version = target["archive-version"];
  if (!version) throw new Error("An archive build channel is required");
  if (!options.deploymentUrl || !options.aliasUrl)
    throw new Error("Pages did not return both deployment and alias URLs");
  for (const origin of new Set([options.deploymentUrl, options.aliasUrl])) {
    await verifyArchive(
      {
        platform: "react",
        version,
        origin,
        sourceSha: options.sourceSha,
        probe: { document: "components/action-button", registryItem: "ui/action-button" },
      },
      fetcher,
    );
  }
  return [
    "## Verified archive preview",
    "",
    `- Path: ${target["preview-path"].replace(/\/$/, "")}`,
    `- Verified Pages alias: ${options.aliasUrl}`,
    `- Build channel: ${options.channel}`,
    `- Source branch: ${options.sourceBranch}`,
    `- Source SHA: ${options.sourceSha}`,
    "- Verification passed for both immutable deployment and branch alias.",
    "",
  ].join("\n");
}

if (import.meta.main) {
  const sourceBranch = process.env.GITHUB_REF_NAME ?? "";
  const summary = await verifyArchivePreview({
    channel: process.env.DOCS_ARCHIVE_SOURCE_BRANCH ?? sourceBranch,
    sourceBranch,
    sourceSha: process.env.GITHUB_SHA ?? "",
    deploymentUrl: process.env.PAGES_DEPLOYMENT_URL,
    aliasUrl: process.env.PAGES_ALIAS_URL,
  });
  if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY, summary);
}
