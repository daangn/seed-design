import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { pluginLynxConfig } from "@lynx-js/config-rsbuild-plugin";
import { registerConsoleShortcuts } from "@lynx-js/qrcode-rsbuild-plugin/shortcuts";
import { pluginReactLynx } from "@lynx-js/react-rsbuild-plugin";
import type { RsbuildPlugin, Rspack } from "@lynx-js/rspeedy";
import { defineConfig } from "@lynx-js/rspeedy";
import { pluginLynxIcon } from "@seed-design/rsbuild-plugin-lynx-icon";
import { pluginLynxPlayground } from "../../docs/scripts/lynx-examples/playground-plugin.js";

const LYNX_ICON_ASSET_PATTERN =
  /node_modules\/@karrotmarket\/assets-(monochrome|multicolor)\/svg\//;
const CONFIG_DIRECTORY = dirname(fileURLToPath(import.meta.url));

function pluginCompatibleQRCode(): RsbuildPlugin {
  return {
    name: "seed-lynx-spa-qrcode",
    setup(api) {
      let port: number | undefined;
      let entries: string[] | undefined;
      let compiled = false;
      let unregister: (() => void) | undefined;

      async function printWhenReady() {
        if (!compiled || port == null || entries == null || unregister != null) return;
        unregister = await registerConsoleShortcuts({
          api,
          entries,
          port,
          schema(url) {
            const fullscreenUrl = new URL(url);
            fullscreenUrl.searchParams.set("fullscreen", "true");
            return fullscreenUrl.toString();
          },
        });
      }

      api.onAfterStartDevServer(async ({ port: devServerPort }) => {
        port = devServerPort;
        await printWhenReady();
      });
      api.onAfterDevCompile(async ({ environments, stats }) => {
        if (stats.hasErrors()) return;
        compiled = true;
        entries = Object.keys(environments.lynx?.entry ?? {});
        await printWhenReady();
      });
      api.onCloseDevServer(() => unregister?.());
    },
  };
}

export default defineConfig(async () => ({
  source: {
    entry: { main: "./src/index.tsx" },
    define: {
      console: "globalThis.console",
    },
  },
  plugins: [
    pluginCompatibleQRCode(),
    await pluginLynxPlayground(),
    pluginLynxIcon({ include: LYNX_ICON_ASSET_PATTERN }),
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
  dev: {
    writeToDisk: false,
  },
  resolve: {
    alias: {
      "@/components/ui": resolve(CONFIG_DIRECTORY, "../../docs/registry/lynx/ui"),
    },
  },
  server: {
    port: Number(process.env.PORT) || 3000,
  },
  output: {
    assetPrefix: process.env.ASSET_PREFIX ?? process.env.PORTLESS_URL ?? "/",
    filename: {
      bundle: "[name].[platform].bundle",
    },
  },
  tools: {
    rspack(config: Rspack.Configuration) {
      if (!config.module?.rules) return;

      config.module.rules = config.module.rules.map((rule) => {
        if (!rule || typeof rule !== "object" || !(rule.test instanceof RegExp)) {
          return rule;
        }

        const includes = Array.isArray(rule.include) ? rule.include : [rule.include];
        const isLynxIconRule = includes.some(
          (include) =>
            include instanceof RegExp && include.source === LYNX_ICON_ASSET_PATTERN.source,
        );
        if (isLynxIconRule) return rule;

        const excludes = Array.isArray(rule.exclude)
          ? rule.exclude
          : rule.exclude
            ? [rule.exclude]
            : [];
        return {
          ...rule,
          exclude: [...excludes, /\.svg$/],
        };
      });
      config.module.rules.unshift({
        test: /\.svg$/,
        exclude: LYNX_ICON_ASSET_PATTERN,
        use: {
          loader: resolve(CONFIG_DIRECTORY, "icon-loader.js"),
        },
      });
    },
  },
  environments: {
    lynx: {},
  },
}));
