# 패턴 카탈로그

[architecture-decisions.md](architecture-decisions.md)에서 정한 target platform과 카테고리의 레퍼런스 파일을 연다. 구현할 레이어의 파일을 먼저 읽고 그 구조를 따른다.

- target platform이 `react` → 아래 카테고리 A–E
- target platform이 `lynx`이거나 `cross-platform`의 Lynx 쪽 → 같은 카테고리 판단을 유지하고 [Lynx 레퍼런스 매핑](#lynx-레퍼런스-매핑)의 파일을 연다. React 파일은 API·의미 비교에만 쓴다.
- 유틸리티 사용법 → React는 [react-patterns.md](react-patterns.md), Lynx는 [lynx-patterns.md](lynx-patterns.md)「유틸리티 선택」

## 카테고리 A: Simple Presentational

단일 요소, 상태 로직 없음. 레퍼런스: Badge, ActionButton.

- 먼저 열 파일: `packages/qvism-preset/src/recipes/badge.ts`, `packages/react/src/components/Badge/Badge.tsx`
- 파일: `Component.tsx`, `index.ts`. Namespace 없음
- Recipe: 단일 요소면 `defineRecipe`(`action-button.ts`). Badge처럼 내부 slot(`root`, `label`)이 있어도 공개 API가 단일 컴포넌트면 `defineSlotRecipe`를 쓰고 A로 둔다.
- 흐름: `recipe.splitVariantProps(props)` → `recipe(variantProps)` → `<Primitive.span className={clsx(root, className)} {...restProps}>`

## 카테고리 B: Compound (Stateless)

복수 slot, 외부 상태 로직 없음. slot recipe context로 className을 배포한다. 레퍼런스: Avatar, List.

- 먼저 열 파일: `packages/qvism-preset/src/recipes/avatar.ts`, `packages/react/src/components/Avatar/Avatar.tsx`
- 파일: `Component.tsx`, `Component.namespace.ts`, `index.ts`. namespace 형식은 [react-patterns.md](react-patterns.md)「Namespace 패턴」
- Recipe: `defineSlotRecipe`
- 흐름: `createSlotRecipeContext(avatar)` → `AvatarRoot = withProvider(Image.Root, "root")` → `AvatarImage = withContext(Image.Content, "image")`

## 카테고리 C: Compound (Stateful)

복수 slot과 headless 훅·context. 가장 흔한 인터랙티브 컴포넌트다. 레퍼런스: TextField(form 통합 기준), Chip(다중 context), Switch.

- 먼저 열 파일: `packages/qvism-preset/src/recipes/text-input.ts`, `packages/react/src/components/TextField/TextField.tsx`, `packages/react-headless/text-field/`
- 파일: 카테고리 B의 3파일 + 필요한 훅·유틸
- Recipe: `defineSlotRecipe`
- 유틸: `createSlotRecipeContext`, `createWithStateProps`, `mergeProps`, `composeRefs`
- Headless: 기존 `packages/react-headless/*`를 먼저 찾는다. 새 `@seed-design/react-*` 패키지가 필요하면 구현 전에 사용자에게 확인한다.
- Form 통합: [react-patterns.md](react-patterns.md)「Form/Field 통합 패턴」

## 카테고리 D: Multi-Recipe

독립 recipe 2개 이상을 조합한다. 레퍼런스: Checkbox(checkbox + checkmark), Switch(switch + switchmark).

- 먼저 열 파일: `packages/qvism-preset/src/recipes/checkbox.ts`, `checkmark.ts`, `packages/react/src/components/Checkbox/Checkbox.tsx`, `packages/react-headless/checkbox/`
- 파일: 카테고리 B의 3파일
- Recipe: `defineSlotRecipe` 2개 이상
- 흐름: [react-patterns.md](react-patterns.md)「Multi-Recipe 패턴」

## 카테고리 E: Layout

recipe 없이 Box를 확장하는 스타일 유틸리티 컴포넌트다. 레퍼런스: Flex, Grid, Stack, Inline.

- 먼저 열 파일: `packages/react/src/components/Flex/Flex.tsx`, `packages/react/src/components/Box/Box.tsx`
- 파일: `Component.tsx`, `index.ts`. Recipe·Namespace 없음
- style props는 `Box`가 `useStyleProps`(`packages/react/src/utils/styled.tsx`)로 처리한다. Flex는 `BoxProps`를 좁혀 `Box`를 렌더한다.

## Lynx 레퍼런스 매핑

Lynx 파일을 먼저 읽고 React 파일은 API·의미 비교에만 쓴다. 상태·이벤트는 `packages/lynx-react-headless/*`나 기존 외부 Lynx primitive가 소유하고, `packages/lynx-react`의 Styled UI는 그 계약을 소비해 recipe와 native UI를 조합한다. 레이어 경계는 [lynx-patterns.md](lynx-patterns.md)「책임 분리」를 따른다.

- A. Simple → `packages/lynx-react/src/components/ActionButton/`, `Text/`, `Box/`: `@seed-design/lynx-css` recipe import, native `<view>`·`<text>`, ref null guard
- B. Compound Stateless → `packages/lynx-react/src/components/TagGroup/`: `createSlotRecipeContext`로 slot className 전달, separator·wrap 같은 Lynx layout 보정
- C. Compound Stateful → `packages/lynx-react/src/components/BottomSheet/`: 외부 primitive(`@lynx-js/lynx-ui-sheet`) 감싸기, controlled prop 매핑, 지원하지 않는 Web API 문서화
- D. Multi-Recipe → `packages/lynx-react/src/components/Checkbox/`, `Switch/`, `RadioGroup/`: `splitMultipleVariantsProps`, headless 상태 훅(`useControllableState`, `usePressTap`)과 recipe variant 분리
- E. Layout → `packages/lynx-react/src/components/Box/`, `Stack/`: Lynx style props, native layout primitive

## Lynx 핵심 유틸리티 위치

React 유틸 목록을 그대로 적용하지 않는다 → 적용 기준은 [lynx-patterns.md](lynx-patterns.md)「유틸리티 선택」을 따른다.

- `createSlotRecipeContext` → `packages/lynx-react/src/utils/create-slot-recipe-context.tsx`
- `splitMultipleVariantsProps` → `packages/lynx-react/src/utils/split-multiple-variants-props.ts`
- `usePressTap`, `useControllableState` → `packages/lynx-react/src/hooks/`에서 import한다. 구현은 `packages/lynx-react-headless/use-press-tap/`, `use-controllable-state/`에 있고 hooks 파일은 re-export다.
- `useSafeArea` → `packages/lynx-react/src/hooks/useSafeArea.ts`: global props·env 기반 safe-area inset

## React 핵심 유틸리티 위치

- `createSlotRecipeContext` → `packages/react/src/utils/createSlotRecipeContext.tsx`: slot recipe의 className context
- `createRecipeContext` → `packages/react/src/utils/createRecipeContext.tsx`: 단일 recipe의 props context
- `createWithStateProps` → `packages/react/src/utils/createWithStateProps.tsx`: 부모 context의 `stateProps` 전파
- `splitMultipleVariantsProps` → `packages/react/src/utils/splitMultipleVariantsProps.mjs`: 여러 recipe의 variant props 동시 분리. 컴포넌트에서는 `../../utils/splitMultipleVariantsProps`로 import한다(`@seed-design/css`에는 없다).
- 패키지 유틸: `mergeProps`(`@seed-design/dom-utils`), `composeRefs`·`useComposedRefs`(`@radix-ui/react-compose-refs`), `Primitive`(`@seed-design/react-primitive`), `Slot`(`@radix-ui/react-slot`, `asChild` 렌더링)
