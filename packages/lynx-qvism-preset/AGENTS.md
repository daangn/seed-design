# packages/lynx-qvism-preset

## 디렉토리 개요

Lynx 플랫폼 전용 qvism preset을 정의하는 private 패키지. `rootage`에서 생성된 토큰(`src/vars/`)과 Lynx 전용 recipe를 사용해 `@seed-design/lynx-css` 산출물을 만든다.

## 파일 작성 컨벤션

- Recipe 이름은 kebab-case를 사용하고 `src/recipes/*.ts`에 둔다.
- 생성 토큰 영역(`src/vars/`, `src/token.css`, `src/tokens.ts`)은 직접 수정하지 않고 원천 정의와 `rootage:generate`로 갱신한다.
- 공개 진입점은 `src/index.ts` 하나로 유지하고, recipe 목록은 `src/recipes.ts`에서 관리한다.

## 코드 작성 컨벤션

- Recipe 작성 시 `src/utils/define.ts`의 `defineRecipe` / `defineSlotRecipe`를 사용한다.
- `define.ts`는 SEED Lynx strict style type으로 style 입력을 좁힌다. `boxSizing`, `verticalAlign`, SVG stroke/fill CSS, `content`, CSS-wide keyword(`initial`, `inherit`, `unset`)처럼 Lynx preset source에서 허용하지 않는 property/value를 추가하지 않는다.
- `inset` / `inset-*` shorthand는 Lynx preset source에서 사용하지 않는다. 전체 영역 채움은 `top` / `right` / `bottom` / `left` longhand로 작성하고, Lightning CSS의 `Features.LogicalProperties` include 옵션으로 최종 CSS에서도 longhand를 유지한다.
- Lynx에서 상태는 pseudo selector보다 boolean/string variant로 모델링한다.
- Root와 text를 분리해야 하는 recipe는 qvism core에서 slot을 파생하지 않고 `defineSlotRecipe`로 slot을 명시한다.
- Lynx 전용 selector/theme/platform 차이는 qvism core나 PostCSS 후처리에 넣지 않고 이 preset source에서 class selector와 명시적인 fallback 값으로 해결한다.
