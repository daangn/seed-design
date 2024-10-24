import esbuild from "esbuild";

import pkg from "./package.json" with { type: "json" };

esbuild
  .build({
    entryPoints: ["./src/index.ts"],
    outfile: "./bin/index.mjs",
    bundle: true,
    write: true,
    treeShaking: true,
    sourcemap: false,
    minify: true,
    format: "esm",
    platform: "node",
    target: ["esnext"],
    external: [...Object.keys(pkg.dependencies)],
  })
  .catch(() => process.exit(1));

esbuild
  .build({
    entryPoints: ["./src/transforms/**/*.ts"],
    outdir: "./bin/transforms",
    outExtension: { ".js": ".mjs" },
    bundle: true,
    write: true,
    treeShaking: true,
    sourcemap: false,
    minify: true,
    format: "esm",
    platform: "node",
    target: ["esnext"],
    external: [...Object.keys(pkg.dependencies)],
  })
  .catch(() => process.exit(1));
