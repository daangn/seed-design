import { build } from "esbuild";

import pkg from "./package.json" assert { type: "json" };

const external = Object.keys({
  ...pkg.dependencies,
  ...pkg.peerDependencies,
});

const baseConfig = {
  entryPoints: ["./src/index.ts", "./src/seed-recipe-loader.ts"],
  outdir: "lib",
  target: "es2019",
  bundle: true,
  sourcemap: true,
  platform: "node",
  external,
};

Promise.all([
  build({
    ...baseConfig,
    format: "cjs",
    outExtension: {
      ".js": ".cjs",
    },
  }),
  build({
    ...baseConfig,
    format: "esm",
  }),
]).catch(() => process.exit(1));
