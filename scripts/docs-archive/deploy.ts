import { appendFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import archives from "./archives.json";
import { archivePrefix, archiveRoutes, validateArchive } from "./config";
import { resolveArchiveSource } from "./source";
import { verifyArchive } from "./verify";

const { values } = parseArgs({
  options: {
    "account-id": { type: "string" },
    "verify-only": { type: "boolean", default: false },
    "dry-run": { type: "boolean", default: false },
  },
});
const routes = archiveRoutes(archives);
archives.forEach(validateArchive);
const accountId = values["account-id"] ?? process.env.CLOUDFLARE_ACCOUNT_ID ?? "";
if (!values["verify-only"] && !values["dry-run"] && !/^[a-f0-9]{32}$/.test(accountId)) {
  throw new Error("Supply CLOUDFLARE_ACCOUNT_ID or --account-id for the SEED Cloudflare account");
}
const verified = [];
for (const archive of archives) {
  const resolved = await resolveArchiveSource(archive, process.env.GITHUB_TOKEN);
  await verifyArchive(resolved);
  verified.push(resolved);
  console.log(
    `Verified ${archivePrefix(archive)} at ${archive.origin} (source ${resolved.sourceSha}).`,
  );
}
console.log(`Shared Worker routes: ${routes.join(", ")}`);
if (process.env.GITHUB_STEP_SUMMARY) {
  await appendFile(
    process.env.GITHUB_STEP_SUMMARY,
    [
      "## Docs archive verification",
      "",
      ...verified.map(
        (archive) =>
          `- ${archivePrefix(archive)} → ${archive.origin} (source ${archive.sourceSha})`,
      ),
      "",
      `Routes: ${routes.join(", ")}`,
      "",
      values["verify-only"]
        ? "Verification only; no deployment."
        : "Verification passed. See the deployment step for the result.",
      "",
    ].join("\n"),
  );
}

if (!values["verify-only"]) {
  // The same complete registry is bundled into worker.ts. Never replace routes with a single entry.
  const command = Bun.spawn(
    [
      "bun",
      "wrangler",
      "deploy",
      "--config",
      "scripts/docs-archive/wrangler.jsonc",
      ...routes.flatMap((route) => ["--route", route]),
      ...(values["dry-run"] ? ["--dry-run"] : []),
    ],
    {
      cwd: fileURLToPath(new URL("../..", import.meta.url)),
      env: { ...process.env, ...(accountId ? { CLOUDFLARE_ACCOUNT_ID: accountId } : {}) },
      stdin: "inherit",
      stdout: "inherit",
      stderr: "inherit",
    },
  );
  process.exit(await command.exited);
}
