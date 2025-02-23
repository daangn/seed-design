import { generateThemingScript, type ColorMode } from "@seed-design/css/theming";
import type { HtmlTagDescriptor, Plugin } from "vite";

const PLUGIN_NAME = "vite-plugin-seed-design";

// Regex to match the special comment at the end of a recipe.
// For example: "// @recipe(seed): action-button"
const recipeRegex = /\/\/\s*@recipe\(\s*([^)]*)\s*\):\s*(\S+)/;

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

export function seedPlugin(options: Options = {}): Plugin {
  const { colorMode = "system", injectColorSchemeTag = true } = options;

  const colorScheme = {
    system: "light dark",
    "light-only": "light",
    "dark-only": "dark",
  }[colorMode];

  const themeScript = generateThemingScript({ mode: colorMode });

  return {
    name: PLUGIN_NAME,

    transform: {
      order: "pre",
      handler(code, id) {
        const match = code.match(recipeRegex);
        if (match) {
          const cssFileName = id.replace(/\.(m?)js$/, ".css");

          if (
            code.includes(`import "${cssFileName}"`) ||
            code.includes(`import '${cssFileName}'`)
          ) {
            return code;
          }

          return {
            code: `${code}\nimport "${cssFileName}";`,
            map: null,
          };
        }
        return null;
      },
    },

    transformIndexHtml(html) {
      // 1. Set data-seed on <html> tag.
      const seedHtml = html.replace(/<html(.*?)>/i, (_match, attrs) => `<html${attrs} data-seed>`);

      // 2. Inject meta tag right after the opening <head> tag.
      const colorSchemeTagDescriptor: HtmlTagDescriptor = {
        tag: "meta",
        attrs: {
          name: "color-scheme",
          content: colorScheme,
        },
        injectTo: "head",
      };

      // 3. Inject the theming script at the beginning of <body>.
      const themeScriptTagDescriptor: HtmlTagDescriptor = {
        tag: "script",
        children: themeScript,
        injectTo: "body-prepend",
      };

      return {
        html: seedHtml,
        tags: injectColorSchemeTag
          ? [colorSchemeTagDescriptor, themeScriptTagDescriptor]
          : [themeScriptTagDescriptor],
      };
    },
  };
}
