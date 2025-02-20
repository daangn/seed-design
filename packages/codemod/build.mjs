import esbuild from "esbuild";
import * as fs from "node:fs";
import * as path from "node:path";

import dotenv from "dotenv";

dotenv.config();

const define = {};

for (const k in process.env) {
  if (k.startsWith("PUBLIC_") === false) continue;

  define[`process.env.${k}`] = JSON.stringify(process.env[k]);
}

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
    define,
  })
  .catch(() => process.exit(1));

fs.readdirSync("./src/transforms").forEach((folder) => {
  esbuild
    .build({
      entryPoints: [path.join("./src/transforms", folder, "index.ts")],
      outdir: path.join("./bin/transforms", folder),
      outExtension: { ".js": ".mjs" },
      bundle: true,
      write: true,
      treeShaking: true,
      sourcemap: false,
      minify: true,
      format: "esm",
      platform: "node",
      target: ["esnext"],
      define,
    })
    .catch(() => process.exit(1));
});
