import { readFileSync, readdirSync, realpathSync } from "node:fs";
import { dirname, join } from "node:path";
import { pluginLynxConfig } from "@lynx-js/config-rsbuild-plugin";
import { pluginReactLynx } from "@lynx-js/react-rsbuild-plugin";
import { defineConfig } from "@lynx-js/rspeedy";

const seed = process.env.SEED_PROBE_CHECKOUT;
const source = process.env.SEED_PROBE_SOURCE;
if (!seed || !source) throw new Error("Set SEED_PROBE_CHECKOUT and SEED_PROBE_SOURCE");

const playgroundModules = join(process.cwd(), "node_modules");
const headless = join(seed, "packages/lynx-react-headless");
const localModules = [
  join(seed, "packages/lynx-react/node_modules"),
  ...readdirSync(headless, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map(({ name }) => join(headless, name, "node_modules")),
  dirname(dirname(realpathSync(join(seed, "packages/lynx-react/node_modules/@floating-ui/core")))),
  join(seed, "node_modules"),
];

export default defineConfig({
  source: {
    entry: join(import.meta.dirname, "entry.tsx"),
    define: {
      console: "globalThis.console",
      PROBE_SOURCE: JSON.stringify(process.env.SEED_PROBE_LABEL ?? source),
      PROBE_RUNTIME: JSON.stringify(
        JSON.parse(readFileSync(join(playgroundModules, "@lynx-js/react/package.json"), "utf8"))
          .version,
      ),
    },
  },
  output: {
    filename: "[name].lynx.bundle",
    distPath: { root: join(import.meta.dirname, "dist") },
  },
  performance: { chunkSplit: { strategy: "all-in-one" } },
  tools: {
    rspack(config) {
      config.resolve ??= {};
      config.resolve.symlinks = false;
      config.resolve.modules = [playgroundModules, ...localModules, "node_modules"];
      config.resolve.extensionAlias = {
        ".js": [".ts", ".js"],
        ".jsx": [".tsx", ".jsx"],
      };
      config.resolve.alias = {
        ...config.resolve.alias,
        "@seed-design/lynx-react/Tabs$": join(
          source,
          "packages/lynx-react/src/components/Tabs/Tabs.namespace.ts",
        ),
        "@seed-design/lynx-react/ChipTabs$": join(
          source,
          "packages/lynx-react/src/components/ChipTabs/ChipTabs.namespace.ts",
        ),
        "@seed-design/lynx-react/Checkbox$": join(
          source,
          "packages/lynx-react/src/components/Checkbox/Checkbox.namespace.ts",
        ),
        "@seed-design/lynx-react/Avatar$": join(
          source,
          "packages/lynx-react/src/components/Avatar/Avatar.namespace.ts",
        ),
        "@seed-design/lynx-react/ImageFrame$": join(
          source,
          "packages/lynx-react/src/components/ImageFrame/index.ts",
        ),
        "@seed-design/lynx-react/Switch$": join(
          source,
          "packages/lynx-react/src/components/Switch/Switch.namespace.ts",
        ),
        "@seed-design/lynx-react/ReactionButton$": join(
          source,
          "packages/lynx-react/src/components/ReactionButton/index.ts",
        ),
        "@seed-design/lynx-react/AttachmentDisplay$": join(
          source,
          "packages/lynx-react/src/components/AttachmentDisplay/index.ts",
        ),
        "@seed-design/lynx-react/AttachmentInput$": join(
          source,
          "packages/lynx-react/src/components/AttachmentInput/index.ts",
        ),
        "@seed-design/lynx-react-app-bar$": join(
          source,
          "packages/lynx-react-headless/app-bar/src/index.ts",
        ),
        "@seed-design/lynx-react-text-field$": join(
          source,
          "packages/lynx-react-headless/text-field/src/index.ts",
        ),
        "@seed-design/lynx-react-field$": join(
          seed,
          "packages/lynx-react-headless/field/src/index.ts",
        ),
        "@seed-design/lynx-react-segmented-control$": join(
          source,
          "packages/lynx-react-headless/segmented-control/src/index.ts",
        ),
        "@seed-design/lynx-react/Slider$": join(
          source,
          "packages/lynx-react/src/components/Slider/Slider.namespace.ts",
        ),
        "@seed-design/lynx-react-image$": join(
          source,
          "packages/lynx-react-headless/image/src/index.ts",
        ),
        "@seed-design/lynx-react-tabs$": join(
          source,
          "packages/lynx-react-headless/tabs/src/index.ts",
        ),
        "@seed-design/lynx-react-use-safe-area$": join(
          seed,
          "packages/lynx-react-headless/use-safe-area/src/index.ts",
        ),
        "@seed-design/lynx-react-floating$": join(
          seed,
          "packages/lynx-react-headless/floating/src/index.ts",
        ),
        "@seed-design/lynx-css": join(seed, "packages/lynx-css"),
      };
    },
  },
  plugins: [
    pluginReactLynx({ engineVersion: "3.5", globalPropsMode: "event" }),
    pluginLynxConfig({
      enableCSSSelector: true,
      enableCSSInvalidation: true,
      enableCSSInheritance: true,
      enableCSSInlineVariables: true,
      enableTextRefactor: true,
    }),
  ],
});
