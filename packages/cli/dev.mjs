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
    target: ["esnext"],
    external: [...Object.keys(pkg.dependencies), "__temp.mjs"],
    define: {
      "process.env.NODE_ENV": `"dev"`,
    },
  })
  .then((ctx) => ctx.watch())
  .catch(() => process.exit(1));
