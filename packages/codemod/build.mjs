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

/** @type {import('esbuild').BuildOptions} */
const commonConfig = {
  bundle: true,
  write: true,
  treeShaking: true,
  sourcemap: false,
  minify: true,
  format: "cjs",
  platform: "node",
  target: ["node16"],
  external: ["jscodeshift"],
  define,
};

// Build main entry
esbuild
  .build({
    ...commonConfig,
    entryPoints: ["./src/index.ts"],
    outfile: "./bin/index.cjs",
  })
  .catch(() => process.exit(1));
