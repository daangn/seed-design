import { defineConfig, loadEnv } from "vite";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, "");
  const isDev = mode === "development";

  return {
    plugins: [],
    define: {
      "Env.MODE": isDev ? '"dev"' : '"prod"',
      "Env.POSTHOG_API_KEY": JSON.stringify(env.POSTHOG_API_KEY || ""),
      "Env.POSTHOG_HOST": JSON.stringify(env.POSTHOG_HOST || ""),
    },
    build: {
      target: "es2017",
      // 빌드 출력 디렉토리
      outDir: "dist/main",
      // 라이브러리 모드로 빌드
      lib: {
        name: "code",
        entry: resolve(__dirname, "src/main/index.ts"),
        // formats: ["iife"],
        fileName: "code",
      },
      rollupOptions: {},
      // 소스맵 생성
      sourcemap: true,
      // 빌드시 콘솔 로그 지우지 않음
      minify: false,
    },
  };
});
