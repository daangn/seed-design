import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import archives from "./archives.json";
import { archivePrefix, archiveRoutes, validateArchive } from "./config";
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
const accountId = values["account-id"] ?? "";
if (!values["verify-only"] && !values["dry-run"] && !/^[a-f0-9]{32}$/.test(accountId)) {
  throw new Error("Supply the SEED Cloudflare account ID explicitly with --account-id");
}
for (const archive of archives) {
  await verifyArchive(archive);
  console.log(
    `Verified ${archivePrefix(archive)} at ${archive.origin} (source ${archive.sourceSha}).`,
  );
}
console.log(`Shared Worker routes: ${routes.join(", ")}`);

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
