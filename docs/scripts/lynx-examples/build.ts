import { rm } from "node:fs/promises";
import {
  CACHE_DIRECTORY,
  DEVELOPMENT_DIRECTORY,
  DOCS_DIRECTORY,
  STAGING_DIRECTORY,
} from "./constants.js";
import { discoverLynxExamples } from "./discovery.js";
import {
  createDevelopmentManifest,
  createManifestFromBundles,
  publishManifestAndBundles,
} from "./manifest.js";
import { verifyLynxWorkspace } from "./workspace.js";
import { writeLynxWebCoreStyles } from "./web-core-styles.js";

export interface BuildLynxExamplesOptions {
  mode: "development" | "production";
  cold?: boolean;
}

export async function buildLynxExamples({ mode, cold = false }: BuildLynxExamplesOptions) {
  const development = mode === "development";
  const outputDirectory = development ? DEVELOPMENT_DIRECTORY : STAGING_DIRECTORY;

  if (cold) await rm(CACHE_DIRECTORY, { recursive: true, force: true });

  await verifyLynxWorkspace();
  await rm(outputDirectory, { recursive: true, force: true });

  const processResult = Bun.spawnSync(
    ["bunx", "--bun", "rspeedy", "build", "--config", "lynx.config.ts", "--mode", mode],
    {
      cwd: DOCS_DIRECTORY,
      stdout: "inherit",
      stderr: "inherit",
      env: development ? { ...process.env, LYNX_EXAMPLES_DEV_OUTPUT: "1" } : process.env,
    },
  );
  if (processResult.exitCode !== 0) process.exit(processResult.exitCode);

  const entries = await discoverLynxExamples();
  const manifest = development
    ? createDevelopmentManifest(entries)
    : await createManifestFromBundles(entries, outputDirectory);
  await writeLynxWebCoreStyles(outputDirectory);
  await publishManifestAndBundles(manifest, outputDirectory);
  console.log(`Lynx 예제 ${entries.length}개를 public/__lynx__에 반영했습니다.`);
}

if (import.meta.main) {
  await buildLynxExamples({
    mode: process.argv.includes("--development") ? "development" : "production",
    cold: process.argv.includes("--cold"),
  });
}
