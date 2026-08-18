import { rm } from "node:fs/promises";
import { DEVELOPMENT_DIRECTORY, DOCS_DIRECTORY } from "./constants.js";
import { discoverLynxExamples } from "./discovery.js";
import { createDevelopmentManifest, publishManifestAndBundles } from "./manifest.js";
import { verifyLynxWorkspace } from "./workspace.js";
import { writeLynxWebCoreStyles } from "./web-core-styles.js";

await verifyLynxWorkspace();
await rm(DEVELOPMENT_DIRECTORY, { recursive: true, force: true });
const result = Bun.spawnSync(
  ["bunx", "--bun", "rspeedy", "build", "--config", "lynx.config.ts", "--mode", "development"],
  {
    cwd: DOCS_DIRECTORY,
    stdout: "inherit",
    stderr: "inherit",
    env: { ...process.env, LYNX_EXAMPLES_DEV_OUTPUT: "1" },
  },
);
if (result.exitCode !== 0) process.exit(result.exitCode);

const manifest = createDevelopmentManifest(await discoverLynxExamples());
await writeLynxWebCoreStyles(DEVELOPMENT_DIRECTORY);
await publishManifestAndBundles(manifest, DEVELOPMENT_DIRECTORY);
