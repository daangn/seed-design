# Getting Started

프로젝트에 SEED Design을 처음 도입할 때의 가이드입니다. 아래 예시는 npm 기준이며, 1단계에서 감지한 패키지 매니저에 맞춰 변환합니다.

## 최단 경로: 5분 안에 첫 컴포넌트 띄우기

### 1. 패키지 설치

```bash
npm install @seed-design/react @seed-design/css
```

### 2. seed-design.json 생성

CLI로 생성 (권장):

```bash
npx @seed-design/cli@latest init
```

또는 직접 생성:

```json
{
  "rsc": false,
  "tsx": true,
  "path": "./seed-design"
}
```

주요 설정:
- `rsc`: React Server Components 사용 시 `true` → snippet에 `"use client"` 유지
- `tsx`: TypeScript 사용 시 `true`
- `path`: snippet이 설치될 디렉토리 경로

### 3. base.css import

앱의 엔트리 파일에 추가:

```ts
import "@seed-design/css/base.css";
```

### 4. tsconfig.json 경로 설정

```json
{
  "compilerOptions": {
    "paths": {
      "seed-design/*": ["./seed-design/*"]
    }
  }
}
```

### 5. 번들러 플러그인 설정

번들러에 따라 설정이 다릅니다. 상세 내용은 llms.txt를 참조합니다.

#### Vite (권장)

```bash
npm install -D @seed-design/vite-plugin
```

```ts
// vite.config.ts
import { seedDesign } from "@seed-design/vite-plugin";

export default defineConfig({
  plugins: [seedDesign()],
});
```

- Vite 7 이하는 `vite-tsconfig-paths` 추가 필요
- 상세: https://seed-design.io/llms/react/getting-started/installation/vite.txt

#### Rsbuild

```bash
npm install -D @seed-design/rsbuild-plugin
```

- 상세: https://seed-design.io/llms/react/getting-started/installation/rsbuild.txt

#### Webpack

```bash
npm install -D @seed-design/webpack-plugin
```

- 상세: https://seed-design.io/llms/react/getting-started/installation/webpack.txt

#### Manual (번들러 플러그인 없이)

- 상세: https://seed-design.io/llms/react/getting-started/installation/manual.txt

### 6. 테마 설정

HTML의 `<html>` 태그에 테마 속성 추가:

```html
<html data-seed-color-mode="system" data-seed-user-color-scheme="light">
```

- `data-seed-color-mode`: `system` | `light-only` | `dark-only`
- `data-seed-user-color-scheme`: `light` | `dark` (system 모드에서 OS 설정 반영)

번들러 플러그인을 사용하면 이 설정이 자동으로 적용됩니다.

### 7. 첫 컴포넌트 추가

```bash
npx @seed-design/cli@latest add ui:action-button
```

```tsx
import { ActionButton } from "seed-design/ui/action-button";

function App() {
  return <ActionButton>시작하기</ActionButton>;
}
```

## 셋업 완료 후 다음 단계

- 컴포넌트 탐색/추가: `references/components.md` 참조
- 파운데이션(색상, 타이포, 스페이싱) 활용: `references/foundation.md` 참조
- 전체 React 문서 인덱스: https://seed-design.io/react/llms.txt
- 디자인 가이드라인 인덱스: https://seed-design.io/docs/llms.txt
