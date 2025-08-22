import type { HtmlBasicTag, RsbuildPlugin } from "@rsbuild/core";
import { generateThemingScript, type ColorMode } from "@seed-design/css/theming";

const PLUGIN_NAME = "rsbuild:seed-design";

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

  /**
   * Whether to enable font scaling for iOS devices.
   * When enabled, text will scale according to the user's system font size preferences.
   * @default false
   */
  fontScaling?: boolean;
}

export const seedDesignPlugin = (options: Options = {}): RsbuildPlugin => {
  const { colorMode = "system", injectColorSchemeTag = true, fontScaling = false } = options;

  const colorScheme = {
    system: "light dark",
    "light-only": "light",
    "dark-only": "dark",
  }[colorMode];

  const themeScript = generateThemingScript({ mode: colorMode, fontScaling });

  return {
    name: PLUGIN_NAME,
    setup(api) {
      api.modifyHTMLTags(({ headTags, bodyTags }) => {
        const scriptTags: HtmlBasicTag[] = [];
        // 1. Inject meta tag to notify the browser about the color scheme.
        if (injectColorSchemeTag) {
          scriptTags.push({
            tag: "meta",
            attrs: {
              name: "color-scheme",
              content: colorScheme,
            },
          });
        }

        // 2. Inject the theming script.
        scriptTags.push({
          tag: "script",
          children: themeScript,
        });

        return { headTags: [...scriptTags, ...headTags], bodyTags };
      });
    },
  };
};
