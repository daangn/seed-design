import { seedDesignPlugin } from "@seed-design/vite-plugin";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import legacy from "@vitejs/plugin-legacy";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";

export default defineConfig({
  build: {
    cssCodeSplit: true,
    minify: false,
    rolldownOptions: {
      treeshake: true,
    },
    target: ["chrome77", "safari14"],
  },

  resolve: {
    tsconfigPaths: true,
  },

  plugins: [
    react(),
    checker({
      typescript: true,
    }),

    /**
     * 당근 웹뷰의 브라우저 최소 버전은 Chrome 77, Safari 14이에요.
     * (최신 버전의 당근 앱은 Android 7.0, iOS 15부터 지원하지만 구버전 앱 사용자를 위해 그 이전 브라우저까지 지원해요.)
     * 모던 브라우저의 polyfills 지원을 위해 modernPolyfills와 modernTargets를 설정해요.
     */
    legacy({
      modernPolyfills: true,
      modernTargets: ["chrome >= 77", "ios_saf >= 14"],
      renderLegacyChunks: false,
    }),

    vanillaExtractPlugin(),

    seedDesignPlugin({
      fontScaling: true,
    }),

    process.env.VISUALIZER
      ? visualizer({
          open: true,
          filename: "stats.html",
          gzipSize: true,
          brotliSize: true,
        })
      : null,
  ],
});
