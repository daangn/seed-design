# packages/qvism-preset

웹 CSS Recipe를 정의하는 private preset이다. Rootage가 생성한 `src/vars/`를 쓰고, `bun qvism:generate`가 이를 `packages/css/recipes/`로 만든다. Lynx Recipe는 `packages/lynx-qvism-preset/`에 따로 있다.

## 검증

- `bun --filter @seed-design/qvism-preset typecheck`
- Recipe 변경 → `bun qvism:generate` 후 `git diff packages/css/recipes/`로 의도한 CSS만 바뀌었는지 본다.
- 웹 Recipe를 고쳤으면 → Lynx 동작도 바뀌어야 하는지 확인하고, 필요하면 `packages/lynx-qvism-preset/src/recipes/`의 같은 Recipe를 따로 고친다.

## 작업 절차

`defineRecipe` ↔ `defineSlotRecipe`를 바꿀 때:

1. Recipe를 고친다. class 이름이 `.seed-{name}`에서 `.seed-{name}__{slot}`(root는 `.seed-{name}__root`)으로 바뀐다.
2. `bun qvism:generate`를 실행한다. 건너뛰면 생성 CSS·타입과 소스가 어긋나 빌드가 깨진다.
3. 이 Recipe를 쓰는 React 컴포넌트를 새 형태에 맞춘다(단일 Recipe 호출 ↔ `createSlotRecipeContext`).

## 규칙

### Interactive 상태

`engaged`·`active` 선택 규칙의 단일 원천이다.

- interactive affordance → 먼저 `engaged`를 검토한다. 생성 단계에서 hover 가능한 환경은 `:hover`, 터치 환경은 `:is(:active, [data-active])`로 풀린다(`ecosystem/postcss-engaged`).
- `active` → 눌린 순간만 표현하는 press-only semantics일 때만 쓴다. 기본 interactive 상태에는 쓰지 않는다 → `engaged`를 쓴다.
- 그 밖의 상태(`disabled`, `focusVisible`, `checked` 등) → `src/utils/pseudo.ts`의 상수를 `pseudo()`로 조합한다.
- engaged 배경 → `::before`로 배경을 깔고 `not(disabled)`로 disabled를 뺀다. engaged 상태에서 `insetInline`·`borderRadius`가 바뀌면 `::before`의 transition에 `inset-inline`·`border-radius`를 넣는다. 기준 구현은 `src/recipes/list-item.ts`다.

### 상태 기반 selector

- 새 상태 selector → 같은 headless 훅을 쓰는 다른 Recipe의 selector를 먼저 확인하고 맞춘다. 예: `useImage`를 쓰는 `avatar.ts`와 `image-frame.ts`는 둘 다 `data-loading-state`를 쓴다.
- HTML 속성(`hidden`, `disabled`)과 `data-*` 상태 속성이 모두 있음 → `data-*`를 쓴다. HTML 속성은 프레임워크 레이어에서 override될 수 있다.
- 로딩 중 상태에 `display: none`을 걸지 않는다 → 플레이스홀더는 숨기지 말고 뒤에 깐다. 레이아웃 박스가 사라지면 `loading="lazy"` 이미지가 뷰포트 교차를 감지하지 못해 로드되지 않고, LCP가 하이드레이션 시점까지 밀린다(`#1258` → `#1428` → `#1791`).

### 구조와 토큰

- Recipe는 kebab-case 이름(`action-button`)으로 `src/recipes/<name>.ts`에 두고 `src/recipes.ts`에 등록해야 생성된다.
- slot이 root 하나 → `defineRecipe`(예: `action-button.ts`). slot이 둘 이상 → `defineSlotRecipe`(예: `avatar.ts`, `badge.ts`, `chip.ts`)로 `base.<slot>`, `variants.<variant>.<value>.<slot>`에 스타일을 둔다.
- 토큰은 `vars.{variant}.{state}.{slot}.{property}`로 참조한다.
- arbitrary content slot → 근거 없이 `display: flex`, `flexDirection`, `gap` 같은 구조를 강제하지 않는다. 실제 contract가 block 구조일 때만 넣는다.
- 여러 variant가 공유하는 affordance는 `base`에, geometry나 specialization만 variant에 둔다.
