const { build } = require("esbuild");
const pkg = require("./package.json");

const watch = process.argv.includes("--watch");
const external = Object.keys({
  ...pkg.dependencies,
  ...pkg.peerDependencies
});

const config = {
  entryPoints: ["./src/index.ts"],
  outdir: "lib",
  target: "es2015",
  bundle: true,
  minify: false,
  sourcemap: true
};

Promise.all([
  build({
    ...config,
    format: "cjs",
    external,
    watch,
    minify: !watch
  }),
  build({
    ...config,
    format: "esm",
    outExtension: {
      ".js": ".mjs"
    },
    external,
    watch,
    minify: !watch
  })
]).catch(() => process.exit(1));
