import { appendFile } from "node:fs/promises";
import { publishRootage, verifyPublic } from "./publisher";
import { R2ObjectStore } from "./r2-object-store";
import { cleanupIncompleteVersions, setStablePointer, updateWorkerRoute } from "./operations";
import { manifestKey, parseManifest } from "./contract";

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} 환경 변수가 필요합니다.`);
  return value;
}

function argument(name: string): string {
  const index = Bun.argv.indexOf(`--${name}`);
  const value = index === -1 ? undefined : Bun.argv[index + 1];
  if (!value) throw new Error(`--${name} 인자가 필요합니다.`);
  return value;
}

async function output(values: Record<string, string | number | boolean>): Promise<void> {
  const lines = Object.entries(values)
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");
  if (process.env.GITHUB_OUTPUT) await appendFile(process.env.GITHUB_OUTPUT, `${lines}\n`);
  console.log(lines);
}

const command = Bun.argv[2];
if (command === "route") {
  const action = argument("action") as "cutover" | "rollback";
  const result = await updateWorkerRoute({
    zoneId: required("CF_ZONE_ID"),
    apiToken: required("CLOUDFLARE_API_TOKEN"),
    script: argument("script"),
    pattern: argument("pattern"),
    action,
    smokeUrl: argument("smoke-url"),
  });
  await output({ result });
  process.exit(0);
}
if (!command || !["publish", "set-stable", "cleanup"].includes(command)) {
  throw new Error(`지원하지 않는 명령입니다: ${command ?? ""}`);
}
const accountId = required("CF_ACCOUNT_ID");
const bucket = required("ROOTAGE_R2_BUCKET");
const store = new R2ObjectStore({
  accessKeyId: required("ROOTAGE_R2_ACCESS_KEY_ID"),
  secretAccessKey: required("ROOTAGE_R2_SECRET_ACCESS_KEY"),
  endpoint: `https://${accountId}.r2.cloudflarestorage.com/${bucket}`,
});
if (command === "set-stable") {
  const version = argument("version");
  const manifestObject = await store.get(manifestKey(version));
  if (!manifestObject) throw new Error("stable 변경 전 완료 manifest를 읽지 못했습니다.");
  const manifest = parseManifest(JSON.parse(new TextDecoder().decode(manifestObject.bytes)));
  const publicBaseUrl = required("ROOTAGE_PUBLIC_BASE_URL");
  await verifyPublic(publicBaseUrl, manifest);
  const result = await setStablePointer(store, version, {
    expectedCurrent: argument("expected-current"),
    allowRollback: argument("allow-rollback") === "true",
    verifyLatest: () => verifyPublic(publicBaseUrl, manifest, "latest"),
  });
  await output({ "pointer-before": result.before, "pointer-after": result.after });
  process.exit(0);
}
if (command === "cleanup") {
  const apply = argument("apply") === "true";
  if (apply && argument("confirm") !== "DELETE-INCOMPLETE")
    throw new Error("삭제 확인 문구가 올바르지 않습니다.");
  const result = await cleanupIncompleteVersions(store, {
    olderThanDays: Number(argument("older-than-days")),
    apply,
  });
  await output({ candidates: result.candidates.join(","), deleted: result.deleted });
  process.exit(0);
}
const result = await publishRootage(store, {
  version: argument("version"),
  npmIntegrity: argument("npm-integrity"),
  sourceSha: argument("source-sha"),
  stable: argument("stable") === "true",
  publicBaseUrl: required("ROOTAGE_PUBLIC_BASE_URL"),
});
await output({
  "manifest-sha": result.manifestSha,
  "file-count": result.fileCount,
  "pointer-before": result.pointerBefore,
  "pointer-after": result.pointerAfter,
  "reused-manifest": result.reusedManifest,
});
