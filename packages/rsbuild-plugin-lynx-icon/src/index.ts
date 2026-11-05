import type { RsbuildPlugin } from "@rsbuild/core";

/**
 * Options for selecting and converting Lynx icon SVG assets to WebP data URLs.
 */
export interface PluginLynxIconOptions {
  /**
   * Regex used to pick Lynx icon SVG modules that should be converted.
   */
  include: RegExp;

  /**
   * Maximum output icon width in pixels.
   *
   * @default 72 (24 × 3)
   */
  maxSize?: number;

  /**
   * WebP encoding quality (0–100).
   *
   * @default 90
   */
  quality?: number;
}

/**
 * Creates an Rsbuild plugin that routes matching Lynx icon SVG files to the
 * `@seed-design/rsbuild-plugin-lynx-icon/loader`.
 *
 * The plugin excludes matched files from the default `svg` rule and applies a
 * dedicated `lynx-icon` rule so they are converted to WebP data URLs.
 *
 * @param options - Matching and conversion options for target Lynx icon SVG files.
 * @returns Rsbuild plugin definition for Lynx icon asset conversion.
 */
export function pluginLynxIcon(options: PluginLynxIconOptions): RsbuildPlugin {
  return {
    name: "@seed-design/rsbuild-plugin-lynx-icon",
    setup(api) {
      api.modifyBundlerChain((chain) => {
        chain.module.rule("svg").exclude.add(options.include);

        chain.module
          .rule("lynx-icon")
          .test(/\.svg$/)
          .include.add(options.include)
          .end()
          .set("type", "javascript/auto")
          .use("lynx-icon-loader")
          .loader(require.resolve("@seed-design/rsbuild-plugin-lynx-icon/loader"))
          .options({
            maxSize: options.maxSize,
            quality: options.quality,
          });
      });
    },
  };
}
