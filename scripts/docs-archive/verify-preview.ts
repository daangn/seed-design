import { appendFile } from "node:fs/promises";
import { setTimeout as delay } from "node:timers/promises";
import { docsBuildTarget } from "./build-target";
import { ArchiveSourceMismatchError, verifyArchive } from "./verify";

interface PreviewOptions {
  channel: string;
  sourceBranch: string;
  sourceSha: string;
  deploymentUrl?: string;
  aliasUrl?: string;
}

// Each platform's Pages preview is verified against a document and registry item it ships.
const PREVIEW_PROBES: Record<string, { document: string; registryItem: string }> = {
  react: { document: "components/action-button", registryItem: "ui/action-button" },
  lynx: { document: "components/action-button", registryItem: "ui/app-bar" },
};

export async function verifyArchivePreview(
  options: PreviewOptions,
  fetcher: typeof fetch = fetch,
  wait: (milliseconds: number) => Promise<void> = delay,
) {
  const target = docsBuildTarget(options.channel);
  const platform = target["archive-platform"];
  const version = target["archive-version"];
  if (!version) throw new Error("An archive build channel is required");
  if (!options.deploymentUrl || !options.aliasUrl)
    throw new Error("Pages did not return both deployment and alias URLs");
  if (new URL(options.deploymentUrl).origin === new URL(options.aliasUrl).origin)
    throw new Error("Pages deployment and alias must have different origins");
  for (const origin of [options.deploymentUrl, options.aliasUrl]) {
    for (let attempt = 1; ; attempt++) {
      try {
        await verifyArchive(
          {
            platform,
            version,
            origin,
            sourceSha: options.sourceSha,
            probe: PREVIEW_PROBES[platform],
          },
          fetcher,
        );
        break;
      } catch (error) {
        if (!(error instanceof ArchiveSourceMismatchError) || attempt === 6) throw error;
        console.warn(`${error.message}; retrying verification in 10s (attempt ${attempt}/6)`);
        await wait(10_000);
      }
    }
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
