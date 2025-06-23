import { seedDesignPlugin } from "@seed-design/vite-plugin";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import legacy from "@vitejs/plugin-legacy";
import react from "@vitejs/plugin-react-swc";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";

export default defineConfig({
  build: {
    cssCodeSplit: true,
    minify: false,
    rollupOptions: {
      treeshake: true,
    },
    target: ["chrome64", "safari14"],
  },

  plugins: [
    /**
     * Babel 컴파일러를 사용하는 @vitejs/plugin-react 대신에
     * 속도가 개선된 SWC 컴파일러를 적용한 @vitejs/plugin-react-swc을 사용해요.
     */
    react(),
    checker({
      typescript: true,
    }),

    /**
     * 당근 웹뷰의 브라우저 최소 버전은 Chrome 64, Safari 14이에요.
     * (최신 버전의 당근 앱은 Android 7.0, iOS 15부터 지원하지만 구버전 앱 사용자를 위해 그 이전 브라우저까지 지원해요.)
     * 모던 브라우저의 polyfills 지원을 위해 modernPolyfills와 modernTargets를 설정해요.
     */
    legacy({
      modernPolyfills: true,
      modernTargets: ["chrome >= 64", "ios_saf >= 14"],
      renderLegacyChunks: false,
    }),

    vanillaExtractPlugin(),

    seedDesignPlugin(),

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
