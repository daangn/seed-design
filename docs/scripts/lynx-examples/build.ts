import { rm } from "node:fs/promises";
import { CACHE_DIRECTORY, DOCS_DIRECTORY, STAGING_DIRECTORY } from "./constants.js";
import { discoverLynxExamples } from "./discovery.js";
import { createManifestFromBundles, publishManifestAndBundles } from "./manifest.js";
import { verifyLynxWorkspace } from "./workspace.js";
import { writeLynxWebCoreStyles } from "./web-core-styles.js";

const cold = process.argv.includes("--cold");
if (cold) await rm(CACHE_DIRECTORY, { recursive: true, force: true });

await verifyLynxWorkspace();
await rm(STAGING_DIRECTORY, { recursive: true, force: true });

const processResult = Bun.spawnSync(
  ["bunx", "--bun", "rspeedy", "build", "--config", "lynx.config.ts", "--mode", "production"],
  { cwd: DOCS_DIRECTORY, stdout: "inherit", stderr: "inherit", env: process.env },
);
if (processResult.exitCode !== 0) process.exit(processResult.exitCode);

const entries = await discoverLynxExamples();
const manifest = await createManifestFromBundles(entries);
await writeLynxWebCoreStyles(STAGING_DIRECTORY);
await publishManifestAndBundles(manifest);
console.log(`Lynx 예제 ${entries.length}개를 public/__lynx__에 반영했습니다.`);
