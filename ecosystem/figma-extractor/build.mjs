import { build } from "esbuild";

import pkg from "./package.json" assert { type: "json" };

const external = Object.keys({
  ...pkg.dependencies,
  ...pkg.peerDependencies,
});

const baseConfig = {
  entryPoints: ["./src/cli/index.ts"],
  outdir: "bin",
  platform: "node",
  bundle: true,
  sourcemap: true,
  external,
};

Promise.all([
  build({
    ...baseConfig,
    format: "esm",
    outExtension: {
      ".js": ".mjs",
    },
  }),
]).catch(() => process.exit(1));
