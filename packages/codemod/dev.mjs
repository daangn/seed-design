import esbuild from "esbuild";

import pkg from "./package.json" with { type: "json" };

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
    target: ["esnext"],
    external: [...Object.keys(pkg.dependencies)],
  })
  .then((ctx) => ctx.watch())
  .catch(() => process.exit(1));

esbuild
  .context({
    entryPoints: ["./src/transforms/**/*.ts"],
    outdir: "./bin/transforms",
    outExtension: { ".js": ".mjs" },
    bundle: true,
    write: true,
    treeShaking: true,
    sourcemap: false,
    minify: false,
    format: "esm",
    platform: "node",
    target: ["esnext"],
    external: [...Object.keys(pkg.dependencies)],
  })
  .then((ctx) => ctx.watch())
  .catch(() => process.exit(1));
