import esbuild from "esbuild";
import * as fs from "node:fs";
import * as path from "node:path";

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
  })
  .then((ctx) => ctx.watch())
  .catch(() => process.exit(1));

fs.readdirSync("./src/transforms").forEach((folder) => {
  esbuild
    .context({
      entryPoints: [path.join("./src/transforms", folder, "index.ts")],
      outdir: path.join("./bin/transforms", folder),
      outExtension: { ".js": ".mjs" },
      bundle: true,
      write: true,
      treeShaking: true,
      sourcemap: false,
      minify: false,
      format: "esm",
      platform: "node",
      target: ["esnext"],
    })
    .then((ctx) => ctx.watch())
    .catch(() => process.exit(1));
});
