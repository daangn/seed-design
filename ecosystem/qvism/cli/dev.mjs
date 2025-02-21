import esbuild from "esbuild";

import pkg from "./package.json" assert { type: "json" };

esbuild
  .context({
    entryPoints: ["./src/index.ts"],
    outfile: "./bin/index.mjs",
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
