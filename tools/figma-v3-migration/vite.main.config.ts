import { defineConfig } from "vite";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [],
  build: {
    target: "es2015",
    // 빌드 출력 디렉토리
    outDir: "dist/main",
    // 라이브러리 모드로 빌드
    lib: {
      entry: resolve(__dirname, "src/main/index.ts"),
      formats: ["es"],
      fileName: "code",
    },
    // 소스맵 생성
    sourcemap: true,
    // 빌드시 콘솔 로그 지우지 않음
    minify: false,
  },
});
