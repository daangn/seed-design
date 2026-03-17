import { defineConfig } from '@lynx-js/rspeedy';

import { pluginQRCode } from '@lynx-js/qrcode-rsbuild-plugin';
import { pluginReactLynx } from '@lynx-js/react-rsbuild-plugin';
import { pluginTypeCheck } from '@rsbuild/plugin-type-check';
import { pluginLynxConfig } from '@lynx-js/config-rsbuild-plugin';
import { seedDesign } from '@seed-design/rsbuild-plugin/lynx';

export default defineConfig({
  plugins: [
    pluginQRCode({
      schema(url) {
        // We use `?fullscreen=true` to open the page in LynxExplorer in full screen mode
        return `${url}?fullscreen=true`;
      },
    }),
    pluginReactLynx(),
    pluginTypeCheck(),
    pluginLynxConfig({
      enableCSSInlineVariables: true,
    }),
    seedDesign({ colorMode: 'system' }),
  ],
  output: {
    filename: '[name].[platform].bundle',
  },
  tools: {
    rspack(config) {
      if (config.module?.rules) {
        config.module.rules = config.module.rules.map((rule) => {
          if (
            !rule ||
            typeof rule !== 'object' ||
            !(rule.test instanceof RegExp)
          ) {
            return rule;
          }

          return {
            ...rule,
            exclude: [
              ...(Array.isArray(rule.exclude) ? rule.exclude : []),
              /\.svg$/,
            ],
          };
        });
        config.module.rules.unshift({
          test: /\.svg$/,
          use: {
            loader: './icon-loader.js',
          },
        });
      }

      return config;
    },
  },
  environments: {
    web: {},
    lynx: {},
  },
});
