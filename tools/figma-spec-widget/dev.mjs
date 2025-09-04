import esbuild from "esbuild";

import pkg from "./package.json" with { type: "json" };

esbuild
  .context({
    entryPoints: ["./widget-src/code.tsx"],
    outfile: "./dist/code.js",
    bundle: true,
    write: true,
    treeShaking: true,
    sourcemap: false,
    minify: false,
    format: "esm",
    platform: "node",
    target: ["node16"],
    external: [...Object.keys(pkg.dependencies), "__temp.mjs"],
  })
  .then((ctx) => ctx.watch())
  .catch(() => process.exit(1));
