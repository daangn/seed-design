# packages/react

스타일드 React 컴포넌트 패키지(`@seed-design/react`)다. `@seed-design/css` Recipe와 `packages/react-headless/*` 로직을 조합한다. 컴포넌트 public surface와 headless 재사용 규칙은 [`src/components/AGENTS.md`](src/components/AGENTS.md)에 있다.

## 규칙

- 컴포넌트는 `forwardRef`로 감싸고 `displayName`을 설정한다.
- Recipe는 `@seed-design/css/recipes/<name>`에서, headless 로직은 `@seed-design/react-<name>`에서 import한다.
- HTML 요소 대신 `@seed-design/react-primitive`의 `Primitive.*`를 쓰고, Recipe 결과와 사용자 `className`을 `clsx`로 병합한다.
- React 레이어에 `style`을 직접 쓰지 않는다 → `packages/qvism-preset` Recipe의 `base`·slot 정의로 옮긴다.
- variant props(`variant`, `size`, `tone` 등)를 손으로 destructuring하지 않는다 → `recipe.splitVariantProps(props)`, `createRecipeContext`, `createSlotRecipeContext`(`src/utils/`) 중 하나를 쓴다.
- `asChild` 같은 escape hatch → 런타임 구현이 실제로 지원할 때만 공개한다.

### Slot Recipe

- 여러 slot을 가진 compound 컴포넌트 → `../../utils/createSlotRecipeContext`의 `createSlotRecipeContext`에 slot Recipe 함수를 직접 넘긴다.
- Root가 root slot DOM을 렌더링함 → `withProvider`로 연결하고 두 번째 인자로 slot 이름을 준다. 하위 slot은 `withContext`로 같은 방식으로 연결한다.
- Root가 DOM 없는 headless Root임(`Dialog`, `ActionSheet`, `MenuSheet` 등) → slot 이름 없이 `withRootProvider`로 props만 전달한다. 예: `Dialog/Dialog.tsx`의 `DialogRoot`.
