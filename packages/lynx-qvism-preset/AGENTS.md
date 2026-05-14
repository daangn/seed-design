# packages/lynx-qvism-preset

## 디렉토리 개요

Lynx 플랫폼 전용 qvism preset을 정의하는 private 패키지. `rootage`에서 생성된 토큰(`src/vars/`)과 Lynx 전용 recipe를 사용해 `@seed-design/lynx-css` 산출물을 만든다.

## 파일 작성 컨벤션

- Recipe 이름은 kebab-case를 사용하고 `src/recipes/*.ts`에 둔다.
- 생성 토큰 영역(`src/vars/`, `src/token.css`, `src/tokens.ts`)은 직접 수정하지 않고 원천 정의와 `rootage:generate`로 갱신한다.
- 공개 진입점은 `src/index.ts` 하나로 유지하고, recipe 목록은 `src/recipes.ts`에서 관리한다.

## 코드 작성 컨벤션

- Recipe 작성 시 `src/utils/define.ts`의 `defineRecipe` / `defineSlotRecipe`를 사용한다.
- `define.ts`는 `@lynx-js/types`의 CSS 타입으로 style 입력을 좁히므로, Lynx view 엔진에서 지원하지 않는 CSS property/value를 추가하지 않는다.
- Lynx에서 상태는 pseudo selector보다 boolean/string variant로 모델링한다.
- `postcss-lynx-compat`, `deriveSlots`, `extraVariants` 설정은 `src/index.ts`에서 관리한다.
