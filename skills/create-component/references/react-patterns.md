# React 컴포넌트 작성 패턴

`packages/react/AGENTS.md`에 기본 컨벤션이 있다. 이 문서는 전체 73개 컴포넌트에서 추출한 공통 패턴을 보충한다.

## 필수 규칙 (모든 카테고리)

- `forwardRef` + `displayName` 필수
- `Primitive.*` 사용 (`@seed-design/react-primitive`)
- `clsx`로 className 병합
- variant props는 반드시 `splitVariantProps` 또는 context 유틸 사용 (수동 destructuring 금지)
- recipe는 `@seed-design/css/recipes/{name}`에서 import
- primitive prop이 union인 경우 `interface extends` 대신 `type Props = PrimitiveProps & VariantProps` 형태를 허용한다

## 공개 Export Surface

React 레이어의 export는 구현 편의가 아니라 **사용자 의미**를 기준으로 잡는다.

- `index.ts`와 namespace에는 user-meaningful slot을 우선 export한다
- animation/layout/padding 분리를 위한 helper slot은 기본적으로 비공개로 둔다
- helper slot을 공개하려면 direct composition이나 styling escape hatch 같은 명확한 사용자 시나리오가 있어야 한다

예: `Content`, `Label`, `Description`은 공개 후보가 될 수 있지만, `ContentInner` 같은 implementation helper는 기본적으로 내부에 남긴다.

## createSlotRecipeContext 사용법

slot recipe 기반 컴포넌트의 className 관리를 자동화한다.

```typescript
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { textInput } from "@seed-design/css/recipes/text-input";

const { withProvider, withContext, useClassNames } = createSlotRecipeContext(textInput);
```

**반환값**:
- `withRootProvider(Component, options?)` — root에서 variant props 분리, ClassNames context 제공
- `withProvider(Component, slot, options?)` — slot에서 새 ClassNames context 생성
- `withContext(Component, slot)` — 기존 ClassNames context 소비, slot className 적용
- `useClassNames()` — context에서 classNames 객체 직접 접근
- `ClassNamesProvider` / `PropsProvider` — 저수준 context provider

**언제 무엇을 사용하는지**:
- Root 컴포넌트: `withRootProvider` (variant props 분리 담당)
- Root가 headless wrapper인 경우: `withProvider` (variant props를 직접 분리해야 할 때)
- 자식 slot: `withContext` (부모가 제공한 classNames 소비)
- 직접 className 접근이 필요한 경우: `useClassNames()` (forwardRef 내부에서)

## createWithStateProps 사용법

부모 context의 state props(`data-disabled`, `data-checked` 등)를 자식 컴포넌트에 자동 전파한다.

```typescript
import { createWithStateProps } from "../../utils/createWithStateProps";

// 단일 context (strict)
const withStateProps = createWithStateProps([useCheckboxContext]);

// 다중 context (strict + non-strict 혼합)
const withStateProps = createWithStateProps([
  useTextFieldContext,                          // strict: true (default)
  { useContext: useFieldContext, strict: false } // Field는 선택적 wrapper
]);
```

- `strict: true` (default) → context 없으면 에러 (반드시 해당 wrapper 안에서 사용)
- `strict: false` → context 없으면 null 반환 (wrapper가 선택적일 때)

## Form/Field 통합 패턴

form 요소가 `<Field.Root>` 안에서 사용될 수 있는 경우 TextField를 canonical reference로 따른다.

### 핵심 패턴 (TextField 기준)

```typescript
// 1. 두 종류의 state props wrapper
const withFieldStateProps = createWithStateProps([
  { useContext: useFieldContext, strict: false }  // Field만 (root에 적용)
]);
const withStateProps = createWithStateProps([
  useTextFieldContext,                            // 자체 context (strict)
  { useContext: useFieldContext, strict: false }   // Field context (non-strict)
]);

// 2. Root에는 Field state만
export const TextFieldRoot = withProvider<HTMLDivElement, TextFieldRootProps>(
  withFieldStateProps(TextField.Root), "root"
);

// 3. 자식 slot에는 자체 + Field state 모두
export const TextFieldPrefixIcon = withContext<SVGSVGElement, TextFieldPrefixIconProps>(
  withStateProps(InternalIcon), "prefixIcon"
);

// 4. Input에서는 mergeProps로 모든 props 합성
const mergedProps = mergeProps(
  fieldContext ? fieldContext.stateProps : {},
  fieldContext ? fieldContext.inputAriaAttributes : {},
  textFieldContext.inputProps,
  otherProps,
);
```

### 금지 패턴

- SEED Design headless 컴포넌트에서는 네이티브 폼 검증 대신 커스텀 검증을 사용하므로, HTML `required` 속성 대신 `aria-required`로 보조 기술에 필수 필드임을 알린다. 네이티브 폼 검증이 필요한 경우 `required`와 `aria-required`를 함께 사용할 수 있다
- `useId()`로 직접 ID 생성하지 않음 (Field context가 관리)
- `useFieldContext({ strict: true })`로 Field를 필수로 만들지 않음 (Field 래핑은 선택적)

## Namespace 패턴

compound 컴포넌트(카테고리 B/C/D)에서 `ComponentName.Root`, `ComponentName.Label` 형태의 API를 제공한다.

**파일 구조**:
```text
Component/
├── Component.tsx           # 실제 구현 (export ComponentRoot, ComponentLabel, ...)
├── Component.namespace.ts  # 짧은 이름 re-export
└── index.ts               # 공개 API
```

**Component.namespace.ts**:
```typescript
export {
  ComponentRoot as Root,
  ComponentLabel as Label,
  ComponentPrefixIcon as PrefixIcon,
  type ComponentRootProps as RootProps,
  type ComponentLabelProps as LabelProps,
} from "./Component";
```

**index.ts**:
```typescript
export { ComponentRoot, ComponentLabel, ... } from "./Component";
export * as ComponentName from "./Component.namespace";
export type { ComponentRootProps, ... } from "./Component";
```

**사용 조건**: compound 컴포넌트에만. 단일 컴포넌트(카테고리 A)와 레이아웃(카테고리 E)에는 namespace를 만들지 않는다.

namespace export에도 동일한 기준을 적용한다. 짧은 이름 re-export가 가능하더라도 helper slot은 namespace surface에 올리지 않는다.

## Multi-Recipe 패턴

2개 이상의 독립 recipe를 사용하는 컴포넌트(Checkbox, Switch).

```typescript
import { splitMultipleVariantsProps } from "@seed-design/css";

const [{ checkbox: checkboxVariantProps, checkmark: checkmarkVariantProps }, otherProps] =
  splitMultipleVariantsProps(props, { checkbox, checkmark });
```

각 recipe별로 별도의 context를 생성한다:
```typescript
const { withContext: withGroupContext } = createRecipeContext(checkboxGroup);
const { ClassNamesProvider, withContext } = createSlotRecipeContext(checkbox);
const { withProvider: withCheckmarkProvider } = createSlotRecipeContext(checkmark);
```

Headless primitive을 노출하는 패턴:
```typescript
export const CheckboxRoot = Object.assign(
  forwardRef<HTMLLabelElement, CheckboxRootProps>((...) => { ... }),
  { Primitive: CheckboxPrimitive.Root }
);
```

## 접근성 경고 패턴

standalone으로 사용되는 컴포넌트(Field 밖에서)에 접근성 경고를 표시한다:

```typescript
if (process.env.NODE_ENV !== "production") {
  if (!fieldContext && !otherProps["aria-label"] && !otherProps["aria-labelledby"]) {
    console.warn("Component: Either use within Field.Root or provide aria-label/aria-labelledby");
  }
}
```
