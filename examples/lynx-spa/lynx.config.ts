import { defineConfig } from "@lynx-js/rspeedy";

import { pluginQRCode } from "@lynx-js/qrcode-rsbuild-plugin";
import { pluginReactLynx } from "@lynx-js/react-rsbuild-plugin";
import { pluginTypeCheck } from "@rsbuild/plugin-type-check";
import { pluginLynxConfig } from "@lynx-js/config-rsbuild-plugin";

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
      // 기본 활성화이지만 명시적으로 설정
      enableCSSSelector: true,
      enableCSSInvalidation: true,

      // CSS
      enableCSSInheritance: true,
      enableCSSInlineVariables: true,
      enableCSSStrictMode: true,

      // 텍스트 & 레이아웃
      enableTextRefactor: true,
      fontScaleEffectiveOnlyOnSp: true,
      enableFixedNew: true,

      // 이벤트 (필요 시)
      // enableNewGesture: true,
      // enableEventHandleRefactor: true,
      // enablePlatformGesture: true,

      // 관찰 & 렌더링 (필요 시)
      // enableNewIntersectionObserver: true,
      // enableVsyncAlignedFlush: true,
      // unifyVWVHBehavior: true,

      // 성능 (필요 시)
      // enableCSSLazyImport: true,
      // enableTextLayoutCache: true,
    }),
  ],
  output: {
    filename: "[name].[platform].bundle",
  },
  tools: {
    rspack(config) {
      if (config.module?.rules) {
        config.module.rules = config.module.rules.map((rule) => {
          if (!rule || typeof rule !== "object" || !(rule.test instanceof RegExp)) {
            return rule;
          }

          return {
            ...rule,
            exclude: [...(Array.isArray(rule.exclude) ? rule.exclude : []), /\.svg$/],
          };
        });
        config.module.rules.unshift({
          test: /\.svg$/,
          use: {
            loader: "./icon-loader.js",
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
