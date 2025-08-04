import { build } from "esbuild";

import pkg from "./package.json" with { type: "json" };

const external = Object.keys({
  ...pkg.dependencies,
  ...pkg.peerDependencies,
});

const cliConfig = {
  entryPoints: ["./src/cli/index.ts"],
  outdir: "bin",
  platform: "node",
  bundle: true,
  external,
};

const exportConfig = {
  entryPoints: ["./src/index.ts"],
  outdir: "lib",
  platform: "node",
  bundle: true,
  external,
};

Promise.all([
  build({
    ...cliConfig,
    format: "esm",
    outExtension: {
      ".js": ".mjs",
    },
  }),
  build({
    ...exportConfig,
    format: "esm",
    outExtension: {
      ".js": ".mjs",
    },
  }),
]).catch(() => process.exit(1));
