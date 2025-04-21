import { generateThemingScript, type ColorMode } from "@seed-design/css/theming";
import type { HtmlTagDescriptor, Plugin } from "vite";

const PLUGIN_NAME = "vite-plugin-seed-design";

interface Options {
  /**
   * The color mode to use.
   * If set to "system", the global color mode will be determined by the user's system preferences.
   * If set to "light-only", the global color mode will always be light.
   * If set to "dark-only", the global color mode will always be dark.
   * @default "system"
   */
  colorMode?: ColorMode;

  /**
   * Whether to inject the color-scheme meta tag.
   * @default true
   */
  injectColorSchemeTag?: boolean;
}

export function seedDesignPlugin(options: Options = {}): Plugin {
  const { colorMode = "system", injectColorSchemeTag = true } = options;

  const colorScheme = {
    system: "light dark",
    "light-only": "light",
    "dark-only": "dark",
  }[colorMode];

  const themeScript = generateThemingScript({ mode: colorMode });

  return {
    name: PLUGIN_NAME,

    enforce: "pre",

    transformIndexHtml(html) {
      // 1. Inject meta tag which notifies the browser about the color scheme.
      const colorSchemeTagDescriptor: HtmlTagDescriptor = {
        tag: "meta",
        attrs: {
          name: "color-scheme",
          content: colorScheme,
        },
        injectTo: "head-prepend",
      };

      // 2. Inject the theming script.
      const themeScriptTagDescriptor: HtmlTagDescriptor = {
        tag: "script",
        children: themeScript,
        injectTo: "head-prepend",
      };

      return {
        html,
        tags: injectColorSchemeTag
          ? [colorSchemeTagDescriptor, themeScriptTagDescriptor]
          : [themeScriptTagDescriptor],
      };
    },
  };
}
