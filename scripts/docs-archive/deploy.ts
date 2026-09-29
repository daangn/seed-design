import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { archiveOrigin } from "./worker";

const { values } = parseArgs({
  options: {
    origin: { type: "string" },
    "source-sha": { type: "string" },
    "account-id": { type: "string" },
    "verify-only": { type: "boolean", default: false },
  },
});
const origin = archiveOrigin(values.origin ?? "");
const sha = values["source-sha"] ?? "";
if (!/^[a-f0-9]{40}$/.test(sha))
  throw new Error("Supply the reviewed 2.0 branch commit as --source-sha (40 characters)");
const accountId = values["account-id"] ?? "";
if (!values["verify-only"] && !/^[a-f0-9]{32}$/.test(accountId)) {
  throw new Error("Supply the SEED Cloudflare account ID explicitly with --account-id");
}
const prefix = "/react/v2";
async function get(suffix: string) {
  const response = await fetch(new URL(`${prefix}${suffix}`, origin), {
    redirect: "follow",
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok || !response.url.startsWith(`${origin.origin}${prefix}/`)) {
    throw new Error(`Archive verification failed: ${suffix} (${response.status})`);
  }
  return response;
}
const manifest = await (await get("/archive.json")).json();
if (
  manifest.platform !== "react" ||
  manifest.version !== "v2" ||
  manifest.prefix !== prefix ||
  manifest.sourceSha !== sha ||
  manifest.sourceDirty !== false
) {
  throw new Error("Archive manifest does not match the reviewed, clean React v2 commit");
}
const html = await (await get("/")).text();
if (
  !html.includes('href="https://seed-design.io/react/v2"') &&
  !html.includes('href="https://seed-design.io/react/v2/"')
) {
  throw new Error("Archive homepage canonical URL is missing");
}
const script = html.match(/src="(\/react\/v2\/_assets\/_next\/[^"<>]+\.js[^"<>]*)"/)?.[1];
if (!script) throw new Error("Archive JavaScript path is missing");
await (await get(script.slice(prefix.length))).body?.cancel();
await (await get("/api/search")).json();
await (await get("/__registry__/react/index.json")).json();
await (await get("/__registry__/react/ui/action-button.json")).json();
const index = await (await get("/__docs__/index.json")).json();
if (index.categories.length !== 1 || index.categories[0].id !== "react")
  throw new Error("Archive docs index must contain React only");
await (await get("/llms/react/components/action-button.txt")).body?.cancel();
const missing = await fetch(new URL(`${prefix}/__archive_missing_${crypto.randomUUID()}`, origin));
await missing.body?.cancel();
if (missing.status !== 404) throw new Error("Missing archive pages must return HTTP 404");
console.log(`Verified React v2 archive at ${origin.origin}${prefix} (source ${sha}).`);

if (!values["verify-only"]) {
  const command = Bun.spawn(
    [
      "bun",
      "wrangler",
      "deploy",
      "--config",
      "scripts/docs-archive/wrangler.jsonc",
      "--var",
      `REACT_V2_ORIGIN:${origin.origin}`,
    ],
    {
      cwd: fileURLToPath(new URL("../..", import.meta.url)),
      env: { ...process.env, CLOUDFLARE_ACCOUNT_ID: accountId },
      stdin: "inherit",
      stdout: "inherit",
      stderr: "inherit",
    },
  );
  process.exit(await command.exited);
}
