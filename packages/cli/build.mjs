import esbuild from "esbuild";

import pkg from "./package.json" assert { type: "json" };

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
    external: [...Object.keys(pkg.dependencies), "__temp.mjs"],
    define: {
      "process.env.NODE_ENV": `"prod"`,
    },
  })
  .catch(() => process.exit(1));
