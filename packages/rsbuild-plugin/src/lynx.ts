import type { RsbuildPlugin } from "@rsbuild/core";
import type { ColorMode } from "@seed-design/css/theming";

export { getThemeClassName } from "./lynx-theming.js";
export type { ColorMode };

const PLUGIN_NAME = "rsbuild:seed-design-lynx";

interface LynxOptions {
  /**
   * The color mode to use.
   * If set to "system", the theme will follow the device's dark mode setting
   * (determined by `lynx.__globalProps.theme`).
   * If set to "light-only", the theme will always be light.
   * If set to "dark-only", the theme will always be dark.
   * @default "system"
   */
  colorMode?: ColorMode;
}

/**
 * SEED Design rsbuild plugin for Lynx.
 *
 * Injects `__SEED_COLOR_MODE__` as a build-time define constant.
 * Use `getThemeClassName()` at runtime to determine the page class:
 *
 * ```tsx
 * import { getThemeClassName } from "@seed-design/rsbuild-plugin/lynx";
 *
 * const themeClass = getThemeClassName(__SEED_COLOR_MODE__, lynx.__globalProps?.theme);
 * root.render(<page className={themeClass}><App /></page>);
 * ```
 */
export const seedDesign = (options: LynxOptions = {}): RsbuildPlugin => {
  const { colorMode = "system" } = options;

  return {
    name: PLUGIN_NAME,
    setup(api) {
      api.modifyRsbuildConfig((config) => {
        config.source ??= {};
        config.source.define ??= {};
        config.source.define.__SEED_COLOR_MODE__ = JSON.stringify(colorMode);
      });
    },
  };
};
