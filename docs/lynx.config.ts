import { resolve } from "node:path";
import { pluginLynxConfig } from "@lynx-js/config-rsbuild-plugin";
import { pluginReactLynx } from "@lynx-js/react-rsbuild-plugin";
import { defineConfig } from "@lynx-js/rspeedy";
import {
  CACHE_DIRECTORY,
  DEVELOPMENT_DIRECTORY,
  DOCS_DIRECTORY,
  REPOSITORY_DIRECTORY,
  STAGING_DIRECTORY,
} from "./scripts/lynx-examples/constants.js";
import { discoverLynxExamples, toRspeedyEntries } from "./scripts/lynx-examples/discovery.js";
import { createLynxCacheDigest } from "./scripts/lynx-examples/cache.js";

export default defineConfig(async () => {
  const entries = await discoverLynxExamples();
  const development = process.env.LYNX_EXAMPLES_DEV_OUTPUT === "1";

  return {
    source: { entry: toRspeedyEntries(entries) },
    plugins: [
      pluginReactLynx({
        targetSdkVersion: "3.9",
        globalPropsMode: "reactive",
        enableCSSSelector: true,
        enableCSSInvalidation: true,
      }),
      pluginLynxConfig({
        enableCSSInheritance: true,
        enableCSSInlineVariables: true,
        fontScaleEffectiveOnlyOnSp: true,
        enableFixedNew: true,
      }),
    ],
    resolve: {
      alias: {
        "@/components/ui": resolve(DOCS_DIRECTORY, "registry/lynx/ui"),
      },
    },
    environments: {
      web: {
        resolve: {
          alias: {
            "@seed-design/lynx-css/base.css": "@seed-design/css/base.css",
          },
        },
      },
      lynx: {},
    },
    splitChunks: false as const,
    output: {
      distPath: {
        root: process.env.LYNX_EXAMPLES_DEV_OUTPUT ? DEVELOPMENT_DIRECTORY : STAGING_DIRECTORY,
      },
      filename: {
        bundle: development
          ? "[name].[platform].bundle"
          : "[name].[contenthash:8].[platform].bundle",
      },
      cleanDistPath: !process.env.LYNX_EXAMPLES_DEV_OUTPUT,
    },
    performance: {
      buildCache: {
        cacheDirectory: CACHE_DIRECTORY,
        cacheDigest: createLynxCacheDigest(entries),
        buildDependencies: [
          resolve(DOCS_DIRECTORY, "lynx.config.ts"),
          resolve(DOCS_DIRECTORY, "scripts/lynx-examples/discovery.ts"),
          resolve(DOCS_DIRECTORY, "scripts/lynx-examples/manifest.ts"),
          resolve(DOCS_DIRECTORY, "scripts/lynx-examples/web-core-styles.ts"),
          resolve(DOCS_DIRECTORY, "scripts/lynx-examples/cache.ts"),
          resolve(DOCS_DIRECTORY, "examples/lynx/tsconfig.json"),
          resolve(DOCS_DIRECTORY, "tsconfig.lynx-node.json"),
          resolve(DOCS_DIRECTORY, "package.json"),
          resolve(REPOSITORY_DIRECTORY, "package.json"),
          resolve(REPOSITORY_DIRECTORY, "bun.lock"),
          resolve(REPOSITORY_DIRECTORY, "bunfig.toml"),
        ],
      },
    },
  };
});
