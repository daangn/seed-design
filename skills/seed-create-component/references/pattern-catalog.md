# 패턴 카탈로그

구조 결정에서 정한 target platform과 카테고리에 따라 아래 레퍼런스 컴포넌트와 유틸리티를 사용한다. 구현할 레이어의 참조 파일을 먼저 읽고 패턴을 따른다.

아래 카테고리 A-E 표는 React Web의 canonical reference다. target platform이 `lynx` 또는 `cross-platform`이면 같은 카테고리 판단을 유지하되, 구현 파일과 유틸리티는 [lynx-patterns.md](lynx-patterns.md)의 Lynx mapping을 우선한다.

## 카테고리 A: Simple Presentational

단일 요소, 상태 로직 없음. 가장 간단한 형태.

**레퍼런스**: Badge, ActionButton, ToggleButton

| 항목 | 값 |
|------|---|
| 파일 구조 | `Component.tsx` + `index.ts` (2파일) |
| Recipe | `defineRecipe` |
| Recipe 사용법 | `recipe.splitVariantProps(props)` → `recipe(variantProps)` |
| React 유틸 | `forwardRef`, `Primitive.*`, `clsx` |
| Namespace | 없음 |

**Badge 패턴 요약**:
```text
1. recipe.splitVariantProps(props) → [variantProps, restProps]
2. recipe(variantProps) → { root, label } (slot별 className)
3. <Primitive.span className={clsx(root, className)} {...restProps}>
```

**참조 경로**:
- Recipe: `packages/qvism-preset/src/recipes/badge.ts`
- React: `packages/react/src/components/Badge/Badge.tsx`

## 카테고리 B: Compound (Stateless)

복수 slot, 외부 상태 로직 없음. slot recipe context로 className 배포.

**레퍼런스**: Avatar, List, ImageFrame

| 항목 | 값 |
|------|---|
| 파일 구조 | `Component.tsx` + `Component.namespace.ts` + `index.ts` (3파일) |
| Recipe | `defineSlotRecipe` |
| React 유틸 | `createSlotRecipeContext` → `withProvider`, `withContext` |
| Namespace | `ComponentRoot as Root, ComponentLabel as Label, ...` |
| Index export | `export * as Component from "./Component.namespace"` |

**Avatar 패턴 요약**:
```text
1. createSlotRecipeContext(avatar) → { withProvider, withContext }
2. AvatarRoot = withProvider(Primitive.div, "root")
3. AvatarImage = withContext(Image.Content, "image")
```

**참조 경로**:
- Recipe: `packages/qvism-preset/src/recipes/avatar.ts`
- React: `packages/react/src/components/Avatar/Avatar.tsx`

## 카테고리 C: Compound (Stateful)

복수 slot + headless 훅/컨텍스트. 가장 일반적인 인터랙티브 컴포넌트.

**레퍼런스**: TextField (form 통합의 canonical), Chip (다중 context), Switch

| 항목 | 값 |
|------|---|
| 파일 구조 | `Component.tsx` + `Component.namespace.ts` + `index.ts` + 추가 훅/유틸 (3+파일) |
| Recipe | `defineSlotRecipe` |
| React 유틸 | `createSlotRecipeContext` + `createWithStateProps` + `mergeProps` + `composeRefs` |
| Headless | `@seed-design/react-{name}` 패키지 또는 기존 headless 재사용 |
| Namespace | 있음 |

**TextField 패턴 요약** (Form 통합 canonical):
```text
1. createSlotRecipeContext(textInput) → { withProvider, withContext, useClassNames }
2. createWithStateProps([useTextFieldContext, { useContext: useFieldContext, strict: false }])
3. TextFieldRoot = withProvider(withFieldStateProps(TextField.Root), "root")
4. TextFieldInput = forwardRef(... mergeProps(stateProps, { className }, otherProps) ...)
```

**참조 경로**:
- Recipe: `packages/qvism-preset/src/recipes/text-input.ts`
- React: `packages/react/src/components/TextField/TextField.tsx`
- Headless: `packages/react-headless/text-field/`

## 카테고리 D: Multi-Recipe

2개 이상의 독립 recipe를 조합하는 복합 컴포넌트.

**레퍼런스**: Checkbox (checkbox + checkmark), Switch (switch + switchmark)

| 항목 | 값 |
|------|---|
| 파일 구조 | `Component.tsx` + `Component.namespace.ts` + `index.ts` (3파일) |
| Recipe | `defineSlotRecipe` ×2 이상 |
| React 유틸 | `splitMultipleVariantsProps`, `createRecipeContext`(parent), `createSlotRecipeContext`(each) |
| 특수 패턴 | `Object.assign(forwardRef(...), { Primitive })` |
| Namespace | 있음 |

**Checkbox 패턴 요약**:
```text
1. createRecipeContext(checkboxGroup) → { withContext: withGroupContext }
2. createSlotRecipeContext(checkbox) → { ClassNamesProvider, withContext }
3. createSlotRecipeContext(checkmark) → { withProvider: withCheckmarkProvider }
4. splitMultipleVariantsProps(props, { checkbox, checkmark }) → [variantMaps, rest]
5. CheckboxRoot = Object.assign(forwardRef(...), { Primitive: CheckboxPrimitive.Root })
```

**참조 경로**:
- Recipe: `packages/qvism-preset/src/recipes/checkbox.ts` + `checkmark.ts`
- React: `packages/react/src/components/Checkbox/Checkbox.tsx`
- Headless: `packages/react-headless/checkbox/`

## 카테고리 E: Layout

스타일 유틸리티 컴포넌트. recipe 없이 Box를 확장한다.

**레퍼런스**: Flex, Grid, Stack, Inline

| 항목 | 값 |
|------|---|
| 파일 구조 | `Component.tsx` + `index.ts` (2파일) |
| Recipe | 없음 |
| React 유틸 | Box 확장, `useStyleProps` |
| Namespace | 없음 |

**참조 경로**:
- React: `packages/react/src/components/Flex/Flex.tsx`

## Lynx 레퍼런스 매핑

Lynx 작업은 React reference를 API/semantic 비교 대상으로만 사용하고, 실제 구현 패턴은 Lynx 파일을 먼저 읽는다.

| 카테고리 | Lynx reference | 확인할 패턴 |
|----------|----------------|-------------|
| A. Simple | `packages/lynx-react/src/components/ActionButton/`, `Text/`, `Box/` | `@seed-design/lynx-css` recipe import, native `<view>`/`<text>`, ref null guard |
| B. Compound Stateless | `packages/lynx-react/src/components/TagGroup/` | inline context, slot className 전달, separator/wrap 같은 Lynx layout 보정 |
| C. Compound Stateful | `packages/lynx-react/src/components/BottomSheet/` | external Lynx UI primitive wrapping, controlled prop mapping, unsupported Web API 문서화 |
| D. Multi-Recipe | `packages/lynx-react/src/components/Checkbox/`, `Switch/`, `RadioGroup/` | `splitMultipleVariantsProps`, headless state와 recipe variant 분리 |
| E. Layout | `packages/lynx-react/src/components/Box/`, `Stack/` | Lynx style props, native layout primitive |

Lynx stateful 컴포넌트는 기존 `packages/lynx-react` hook/context 또는 외부 primitive가 상태와 이벤트를 소유하고, Styled UI가 recipe와 native UI를 조합하는 구조를 기본으로 둔다.

## Lynx 핵심 유틸리티 위치

Lynx target에서는 React 유틸리티 표를 그대로 적용하지 말고, 아래 유틸리티와 [lynx-patterns.md](lynx-patterns.md)의 선택 기준을 먼저 확인한다.

| 유틸리티/훅 | 경로 | 용도 |
|-------------|------|------|
| `createSlotRecipeContext` | `packages/lynx-react/src/utils/create-slot-recipe-context.tsx` | slot recipe className/variant props context. native intrinsic tag는 감싸지 않고 provider/use hook 중심으로 사용 가능 |
| `splitMultipleVariantsProps` | `packages/lynx-react/src/utils/split-multiple-variants-props.ts` | 여러 Lynx recipe variant props 동시 분리 |
| `usePressTap` | `packages/lynx-react/src/hooks/usePressTap.ts` | pressed/tap/disabled interaction state |
| `useControllableState` | `packages/lynx-react/src/hooks/useControllableState.ts` | controlled/uncontrolled state |
| `useSafeArea` | `packages/lynx-react/src/hooks/useSafeArea.ts` | Lynx global props/env 기반 safe-area inset |

## React 핵심 유틸리티 위치

| 유틸리티 | 경로 | 용도 |
|---------|------|-----|
| `createSlotRecipeContext` | `packages/react/src/utils/createSlotRecipeContext.tsx` | slot recipe의 className context 관리 |
| `createRecipeContext` | `packages/react/src/utils/createRecipeContext.tsx` | 단일 recipe의 props context 관리 |
| `createWithStateProps` | `packages/react/src/utils/createWithStateProps.tsx` | 부모 context의 state props 자동 전파 |
| `splitMultipleVariantsProps` | `@seed-design/css` | 여러 recipe의 variant props 동시 분리 |
| `mergeProps` | `@seed-design/dom-utils` | 여러 prop 객체를 지능적으로 병합 |
| `composeRefs` | `@radix-ui/react-compose-refs` | 여러 ref를 합성 |
| `Primitive` | `@seed-design/react-primitive` | base HTML 요소 래퍼 |
| `Slot` | `@radix-ui/react-slot` | polymorphic 렌더링 (asChild) |
