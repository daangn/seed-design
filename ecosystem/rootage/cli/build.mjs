import esbuild from "esbuild";

import pkg from "./package.json" with { type: "json" };

esbuild
  .build({
    entryPoints: ["./src/index.ts"],
    outfile: "./bin/index.mjs",
    bundle: true,
    write: true,
    treeShaking: true,
    sourcemap: true,
    minify: false,
    format: "esm",
    platform: "node",
    target: ["node16"],
    external: [...Object.keys(pkg.dependencies)],
  })
  .catch(() => process.exit(1));
