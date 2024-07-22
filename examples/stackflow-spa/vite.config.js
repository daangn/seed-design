import legacy from "@vitejs/plugin-legacy";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";

export default defineConfig({
  build: {
    cssCodeSplit: false,
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
     * 당근마켓 웹뷰의 브라우저 최소 버전은 Android Chrome 51, iOS 13이에요.
     * (매우 소수의 iOS 11 구버전 유저가 남아있을 수 있어요. 최신 버전 당근마켓은 iOS 13부터 지원해요)
     * 모던 브라우저의 polyfills 지원을 위해 modernPolyfills와 modernTargets를 설정해요.
     */
    legacy({
      modernPolyfills: true,
      modernTargets: ["chrome >= 64", "ios_saf >= 13"],
      targets: ["chrome >= 51", "ios_saf >= 13"],
    }),
  ],
});
