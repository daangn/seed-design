# packages/qvism-preset

## 디렉토리 개요

**CSS Recipe를 정의**하는 패키지. `rootage`에서 생성된 토큰(`src/vars/`)을 사용하여 컴포넌트별 스타일을 정의한다. `bun qvism:generate`로 `css/recipes`에 CSS를 생성한다.

## 파일 작성 컨벤션

- 레시피 소스, 생성 토큰, 유틸리티를 역할별로 분리한다.
- 생성 토큰 영역은 직접 수정하지 않고 원천 정의를 통해 갱신한다.

## 코드 작성 컨벤션

- Recipe 이름: kebab-case (예: `action-button`)
- interactive affordance는 기본적으로 `engaged`를 먼저 검토한다. `engaged`는 hover 가능한 환경에서는 hover, 터치 환경에서는 active 계열 상호작용으로 풀린다.
- `active`는 "눌린 순간만 표현해야 하는 press-only semantics" 같은 좁은 경우에만 사용하고, 기본 interactive 상태 설명에는 쓰지 않는다.
- 토큰 참조: `vars.{variant}.{state}.{slot}.{property}`
- arbitrary content slot에는 근거 없이 `display: flex`, `flexDirection`, `gap` 같은 구조 강제를 넣지 않는다. 실제 contract가 block 구조일 때만 추가한다.
- base에는 여러 variant가 공유하는 affordance를 두고, variant에는 geometry나 specialization만 올린다.

## 상태 기반 선택자 작성 규칙

같은 headless 훅을 사용하는 recipe 간에는 CSS 선택자 전략을 통일한다.

- 새로운 상태 기반 선택자를 추가할 때, 동일 훅을 사용하는 다른 recipe의 선택자 패턴을 먼저 확인한다.
- HTML 속성(`hidden`, `disabled`)보다 `data-*` 상태 속성(`data-loading-state` 등)을 우선 사용한다. HTML 속성은 프레임워크 레이어에서 override될 수 있어 불안정하다.
- 예시: `useImage` 훅을 사용하는 Avatar와 ImageFrame은 모두 `data-loading-state` 기반 선택자를 사용한다.

## defineRecipe vs defineSlotRecipe

| 기준 | `defineRecipe` | `defineSlotRecipe` |
|------|---------------|-------------------|
| 슬롯 수 | 1개 (root만) | 2개 이상 |
| 예시 | ActionButton, Badge | Avatar, TextField, Chip |
| CSS 클래스명 | `.seed-{name}` | `.seed-{name}__{slot}` |

### defineSlotRecipe 사용법

`defineSlotRecipe`는 `name`, `slots` 배열, `base`, `variants` 등을 인자로 받는다. `base.slotName` 형태로 슬롯별 기본 스타일을 작성하고, `variants.variantName.variantValue.slotName` 형태로 슬롯별 variants를 적용한다.

### ⚠️ defineRecipe ↔ defineSlotRecipe 전환 시 주의사항

1. **반드시 `bun generate:all` 실행**: Recipe 타입을 변경한 후 generate를 실행하지 않으면 CSS와 소스가 불일치해 빌드가 깨집니다.
2. **CSS 클래스명 패턴이 변경됨**: `defineRecipe`의 `.seed-{name}` → `defineSlotRecipe`의 `.seed-{name}__root`로 변경되므로 React 컴포넌트에서 사용하는 import도 업데이트 필요.
3. **올바른 순서**: Recipe 수정 → `bun generate:all` → React 코드 수정

## 플랫폼별 preset 분리

Lynx view 엔진은 웹 CSS inline flow(`display: inline` / `inline-flex` / `inline-block`, `vertical-align`, `::after` 등)를 지원하지 않는다. 공통 recipe로 두 플랫폼을 모두 감당하려 하면 한쪽이 깨지므로 preset 자체를 두 entry로 분리한다.

| Entry | 대상 | 경로 |
|-------|------|------|
| `@seed-design/qvism-preset` | 웹 | `src/index.ts` |
| `@seed-design/qvism-preset/lynx` | Lynx | `src/lynx.ts` |

### Recipe 배치 규칙

- `src/recipes/*.ts` — 공통 recipe. 기본은 웹 대상. Lynx에서도 그대로 쓸 수 있는 단순 recipe(예: ActionButton)는 Lynx preset에서 재사용.
- `src/recipes/lynx/*.ts` — Lynx 전용 recipe. 웹 recipe의 inline flow 트릭·pseudo element·`vertical-align` 등이 Lynx에서 깨지는 컴포넌트를 `defineLynxSlotRecipe`로 재작성.
- `src/recipes-lynx.ts` — Lynx preset이 포함할 recipe 목록. 공통 recipe를 재사용할지 Lynx 전용을 쓸지 여기서 결정.

### Lynx recipe 타입 제약

`defineLynxSlotRecipe` / `defineLynxRecipe`(`src/utils/define-lynx.ts`)는 `@lynx-js/types`의 `CSSProperties`로 style 입력을 좁힌다. `display: "inline-block"`, `verticalAlign`, `textOverflow: "clip"` 외 값처럼 Lynx가 지원하지 않는 property/value는 컴파일 시점에 에러로 잡힌다. 반드시 `defineLynxSlotRecipe`로 Lynx recipe를 작성한다.

### 공통 recipe를 Lynx에서 쓰기 전 체크리스트

다음 중 하나라도 해당하면 `recipes/lynx/`에 재작성한다.
- `display`가 `inline` / `inline-flex` / `inline-block` 중 하나
- `vertical-align`, `::after`, `::before` 사용
- `white-space: pre` 또는 `font-size: 0` 같은 inline flow 트릭
- CSS variable로 `display` 값을 동적 주입

해당 없으면 `recipes-lynx.ts`에 그대로 import해서 재사용한다.
