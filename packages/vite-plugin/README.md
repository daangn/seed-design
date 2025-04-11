# @seed-design/vite-plugin

Seed Design의 테마를 Vite 프로젝트에 적용하기 위한 플러그인입니다.

## 설치

```sh
yarn add @seed-design/vite-plugin
```

```sh
npm install @seed-design/vite-plugin
```

## 사용 방법

```ts
// vite.config.ts
import { defineConfig } from "vite";
import { seedDesignPlugin } from "@seed-design/vite-plugin";

export default defineConfig({
  plugins: [
    // ...다른 플러그인
    seedDesignPlugin(),
  ],
});
```

## 옵션

```ts
interface Options {
  /**
   * 사용할 컬러 모드
   * "system": 사용자 시스템 환경설정에 따라 컬러 모드 결정
   * "light-only": 항상 라이트 모드 사용
   * "dark-only": 항상 다크 모드 사용
   * @default "system"
   */
  colorMode?: "system" | "light-only" | "dark-only";

  /**
   * color-scheme 메타 태그 주입 여부
   * @default true
   */
  injectColorSchemeTag?: boolean;
}
```

### 예시

```ts
// vite.config.ts
import { defineConfig } from "vite";
import { seedDesignPlugin } from "@seed-design/vite-plugin";

export default defineConfig({
  plugins: [
    seedDesignPlugin({
      colorMode: "light-only",
      injectColorSchemeTag: true,
    }),
  ],
});
```

## 기능

이 플러그인은 다음과 같은 기능을 제공합니다:

1. Seed Design CSS 테마 스크립트를 자동으로 HTML에 주입합니다.
2. 선택적으로 color-scheme 메타 태그를 추가하여 브라우저에 컬러 스킴을 알립니다.
3. Recipe 주석 (`// @recipe(seed): 컴포넌트명`)이 있는 파일에 자동으로 CSS 파일을 임포트합니다.

## 라이센스

MIT
