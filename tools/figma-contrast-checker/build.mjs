import esbuild from "esbuild";

import pkg from "./package.json" with { type: "json" };

esbuild
  .build({
    entryPoints: ["./widget-src/code.tsx"],
    outfile: "./dist/code.js",
    bundle: true,
    write: true,
    treeShaking: true,
    sourcemap: false,
    minify: true,
    format: "esm",
    platform: "node",
    target: ["node16"],
    external: [...Object.keys(pkg.dependencies)],
  })
  .catch(() => process.exit(1));
