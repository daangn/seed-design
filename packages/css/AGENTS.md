# packages/css

## 디렉토리 개요

**CSS 변수와 Recipe를 제공**하는 패키지. `vars/`, `recipes/`, 루트 `*.css`는 **자동 생성**이므로 직접 수정 금지. 나머지는 손으로 쓰는 소스다.

## 파일 작성 컨벤션

| 경로 | 생성 원천 |
|------|-----------|
| `vars/` | `rootage/*.yaml` |
| `recipes/` | `qvism-preset/src/recipes/*.ts` |
| `*.css` (루트) | qvism-preset |
| `theming/`, `breakpoints/`, `scale-feedback/`, `qvism.config.mjs` | 없음 (손으로 작성) |

수정 가능 여부는 이 표가 아니라 `.gitattributes`가 정한다. `git check-attr linguist-generated -- <파일 경로>`가 `set`이면 생성물이다.

`theming/`, `breakpoints/`, `scale-feedback/`는 `.mjs`와 `.cjs`, `.d.ts`를 손으로 함께 맞춘다. `bun generate:all`은 이 디렉토리를 건드리지 않는다.

## 코드 작성 컨벤션

스타일 변경이 필요하면:
1. 토큰 → `packages/rootage/*.yaml` 수정
2. Recipe → `packages/qvism-preset/src/recipes/*.ts` 수정
3. `bun generate:all` 실행

## 소스-생성물 관계

| 소스 | 생성 명령 | 생성물 |
|------|----------|--------|
| `packages/qvism-preset/src/recipes/*.ts` | `bun qvism:generate` | `packages/css/recipes/*.{css,mjs,d.ts}` |
| `packages/rootage/components/*.yaml` | `bun rootage:generate` | `packages/css/vars/component/*.{mjs,d.ts}` |

## defineRecipe vs defineSlotRecipe 생성물 차이

| Recipe 타입 | 클래스명 패턴 | 예시 |
|------------|-------------|------|
| `defineRecipe` | `.seed-{name}` | `.seed-button` |
| `defineSlotRecipe` | `.seed-{name}__{slot}` | `.seed-avatar__root`, `.seed-avatar__fallback` |
