import { context } from "esbuild";

import pkg from "./package.json" with { type: "json" };

context({
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
    "process.env.NODE_ENV": `"dev"`,
  },
}).catch(() => process.exit(1));
