import { build } from "esbuild";

import pkg from "./package.json" with { type: "json" };

const external = Object.keys({
  ...pkg.dependencies,
  ...pkg.peerDependencies,
});

const baseConfig = {
  entryPoints: ["./src/index.ts"],
  outdir: "lib",
  target: "es2019",
  sourcemap: true,
  external,
};

Promise.all([
  build({
    ...baseConfig,
    format: "cjs",
  }),
  build({
    ...baseConfig,
    format: "esm",
    outExtension: {
      ".js": ".mjs",
    },
  }),
]).catch(() => process.exit(1));
