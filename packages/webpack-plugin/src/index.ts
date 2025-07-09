import type { Compiler } from "webpack";
import type { Compiler as RspackCompiler } from "@rspack/core";
import { generateThemingScript, type ColorMode } from "@seed-design/css/theming";

// Optional import attempt for html-webpack-plugin
let HtmlWebpackPlugin: typeof import("html-webpack-plugin") | undefined;
try {
  HtmlWebpackPlugin = require("html-webpack-plugin");
} catch {
  // If not installed, HtmlWebpackPlugin remains undefined
}

// Optional import attempt for Rspack
let RspackCore: typeof import("@rspack/core") | undefined;
try {
  RspackCore = require("@rspack/core");
} catch {
  // If not installed, RspackCore remains undefined
}

function isRspack(compiler: Compiler | RspackCompiler): compiler is RspackCompiler {
  return "rspack" in compiler;
}

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

export class SeedDesignPlugin {
  private readonly colorMode: ColorMode;
  private readonly injectColorSchemeTag: boolean;
  private readonly fontScaling: boolean;
  private themingScript: string;
  private colorScheme: string;

  constructor(options: Options = {}) {
    this.colorMode = options.colorMode ?? "system";
    this.injectColorSchemeTag = options.injectColorSchemeTag ?? true;
    this.fontScaling = options.fontScaling ?? false;

    // E.g. 'system' => "light dark"
    this.colorScheme = {
      system: "light dark",
      "light-only": "light",
      "dark-only": "dark",
    }[this.colorMode];

    this.themingScript = generateThemingScript({ mode: this.colorMode, fontScaling: this.fontScaling });
  }

  private transformHtml(input: string): string {
    let html = input;

    // 1) <meta name="color-scheme">
    // 2) Theming script
    if (this.injectColorSchemeTag) {
      html = html.replace(
        /<head(\s[^>]*)?>/i,
        (_m, attrs) =>
          `<head${attrs || ""}>\n<meta name="color-scheme" content="${this.colorScheme}">\n<script>${this.themingScript}</script>`,
      );
    }

    return html;
  }

  apply(compiler: Compiler | RspackCompiler) {
    if (isRspack(compiler)) {
      compiler.hooks.compilation.tap("SeedDesignPlugin", (compilation) => {
        //
        // RSPACK Flow
        //
        // Use the HTMLRspackPlugin from '@rspack/core' if installed
        const hooks = RspackCore!.HtmlRspackPlugin.getCompilationHooks(compilation);

        // The 'beforeEmit' hook is a tapPromise in Rspack
        hooks.beforeEmit.tapPromise("SeedDesignPlugin", async (data) => {
          data.html = this.transformHtml(data.html);
          return data;
        });
      });
    } else {
      //
      // WEBPACK Flow
      //
      // Use HtmlWebpackPlugin's hooks if installed
      if (HtmlWebpackPlugin && typeof HtmlWebpackPlugin.getHooks === "function") {
        compiler.hooks.compilation.tap("SeedDesignPlugin", (compilation) => {
          const webpackHooks = HtmlWebpackPlugin.getHooks(compilation);
          webpackHooks.beforeEmit.tapAsync("SeedDesignPlugin", (data, cb) => {
            data.html = this.transformHtml(data.html);
            cb(null, data);
          });
        });
      }
    }
  }
}
