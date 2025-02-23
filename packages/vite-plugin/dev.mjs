import { context } from "esbuild";

import pkg from "./package.json" with { type: "json" };

const external = Object.keys({
  ...pkg.dependencies,
  ...pkg.peerDependencies,
});

context({
  entryPoints: ["./src/index.tsx"],
  outdir: "lib",
  target: "es2019",
  bundle: true,
  sourcemap: true,
  external,
})
  .then((ctx) => ctx.watch())
  .catch(() => process.exit(1));
