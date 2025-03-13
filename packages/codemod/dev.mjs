import esbuild from "esbuild";
import * as fs from "node:fs";
import * as path from "node:path";

/** @type {import('esbuild').BuildOptions} */
const commonConfig = {
  bundle: true,
  write: true,
  treeShaking: true,
  sourcemap: false,
  minify: false,
  format: "cjs",
  platform: "node",
  target: ["node16"],
  external: ["jscodeshift"],
};

// Build main entry
esbuild
  .context({
    ...commonConfig,
    entryPoints: ["./src/index.ts"],
    outfile: "./bin/index.cjs",
  })
  .then((ctx) => ctx.watch())
  .catch(() => process.exit(1));

// Build transforms
fs.readdirSync("./src/transforms").forEach((folder) => {
  esbuild
    .context({
      ...commonConfig,
      entryPoints: [path.join("./src/transforms", folder, "index.ts")],
      outdir: path.join("./bin/transforms", folder),
      outExtension: { ".js": ".js" },
    })
    .then((ctx) => ctx.watch())
    .catch(() => process.exit(1));
});
