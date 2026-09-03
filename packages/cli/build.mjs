import "dotenv/config";

import esbuild from "esbuild";

import pkg from "./package.json" with { type: "json" };

/**
 * The PostHog credentials are baked into the bundle below, so whether telemetry can be sent is
 * settled here and never again. Warning at build time is the last point anyone can act on it.
 */
const missingTelemetryEnv = ["POSTHOG_API_KEY", "POSTHOG_HOST"].filter(
  (name) => !process.env[name],
);

if (missingTelemetryEnv.length > 0) {
  console.warn(
    `[build] ${missingTelemetryEnv.join(", ")} not set: this bundle will send no telemetry.`,
  );
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
    external: [...Object.keys(pkg.dependencies), "__temp.mjs"],
    define: {
      "process.env.NODE_ENV": `"prod"`,
      "process.env.POSTHOG_API_KEY": `"${process.env.POSTHOG_API_KEY || ""}"`,
      "process.env.POSTHOG_HOST": `"${process.env.POSTHOG_HOST || ""}"`,
    },
  })
  .catch(() => process.exit(1));
