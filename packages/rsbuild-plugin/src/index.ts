import type { HtmlBasicTag, RsbuildPlugin } from "@rsbuild/core";
import { generateThemingScript, type ColorMode } from "@seed-design/css/theming";
import path from "node:path";

// Regex to match the special comment at the end of a recipe.
// For example: "// @recipe(seed): action-button"
const recipeRegex = /\/\/\s*@recipe\(\s*([^)]*)\s*\):\s*(\S+)/;

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
}

export const seedDesignPlugin = (options: Options = {}): RsbuildPlugin => {
  const { colorMode = "system", injectColorSchemeTag = true } = options;

  const colorScheme = {
    system: "light dark",
    "light-only": "light",
    "dark-only": "dark",
  }[colorMode];

  const themeScript = generateThemingScript({ mode: colorMode });

  return {
    name: PLUGIN_NAME,
    setup(api) {
      api.transform({ test: /\.(m?)js$/ }, ({ resourcePath, code }) => {
        if (code.match(recipeRegex)) {
          const filename = path.basename(resourcePath);
          const cssFileName = filename.replace(/\.(m?js)$/, ".css");

          // If the import is already present, skip injecting
          if (code.includes(`import "./${cssFileName}"`)) {
            return code;
          }

          // Otherwise, inject the CSS import at the end of the file
          return `${code}\nimport "./${cssFileName}";\n`;
        }
        return code;
      });

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
