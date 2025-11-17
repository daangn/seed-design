import "dotenv/config";

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
    external: [...Object.keys(pkg.dependencies), "__temp.mjs"],
    define: {
      "process.env.NODE_ENV": `"prod"`,
      "process.env.POSTHOG_API_KEY": `"${process.env.POSTHOG_API_KEY || ""}"`,
      "process.env.POSTHOG_HOST": `"${process.env.POSTHOG_HOST || ""}"`,
    },
  })
  .catch(() => process.exit(1));
