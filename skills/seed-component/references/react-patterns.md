# React 컴포넌트 작성 패턴

React Web Styled UI(`packages/react/src/components/`)를 구현하기 전에 읽는다.

1. `packages/react/AGENTS.md`와 `packages/react/src/components/AGENTS.md`를 읽는다. `forwardRef`·`displayName`, `Primitive.*`, `clsx`, variant props 분리, Recipe·headless import 경로, 공개 slot 기준, headless `stateProps`·hook props 재사용 규칙은 그곳에 있다.
2. [pattern-catalog.md](pattern-catalog.md)에서 카테고리의 레퍼런스 파일을 연다.
3. 아래에서 필요한 절만 읽는다.

- target platform이 `lynx`이거나 `cross-platform`의 Lynx 구현 → 이 문서는 API·의미 비교에만 쓰고 [lynx-patterns.md](lynx-patterns.md)와 `packages/lynx-react/AGENTS.md`를 따른다.
- primitive prop이 union → `interface extends` 대신 `type Props = PrimitiveProps & VariantProps`로 선언한다. `interface`는 union을 확장할 수 없다.
- helper slot 공개 여부 판단 예: `Content`, `Label`, `Description`은 공개 후보이고, `ContentInner`처럼 animation·layout·padding 분리용 helper는 내부에 남긴다. namespace에도 같은 기준을 적용한다.

## createSlotRecipeContext 사용법

```typescript
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { textInput } from "@seed-design/css/recipes/text-input";

const { withProvider, withContext, useClassNames } = createSlotRecipeContext(textInput);
```

- Root가 DOM을 렌더한다 → `withProvider(Component, "root", options?)`. variant props를 분리하고 slot className과 ref를 붙이고 ClassNames context를 연다. 예: `AvatarRoot`, `TextFieldRoot`.
- Root가 DOM 없는 headless Root다(`Dialog`·`Popover` 계열 Root 등) → `withRootProvider(Component, options?)`. variant props 분리와 ClassNames context만 제공하고 className·ref는 붙이지 않는다. 예: `DialogRoot`, `HelpBubbleRoot`, `MenuSheetRoot`, `ActionSheetRoot`.
- 자식 slot → `withContext(Component, slot)`. 부모가 연 context의 slot className을 붙인다.
- `forwardRef` 안에서 className을 직접 조합해야 한다 → `useClassNames()`. provider 밖에서 호출하면 에러를 던진다.
- 저수준 제어가 필요하다 → `ClassNamesProvider`, `PropsProvider`, `useProps`

`withProvider`·`withRootProvider`의 `options.defaultProps`로 variant 기본값을 준다.

## createWithStateProps 사용법

부모 context의 `stateProps`(`data-disabled`, `data-checked` 등)를 자식에 전파한다.

```typescript
import { createWithStateProps } from "../../utils/createWithStateProps";

const withStateProps = createWithStateProps([
  useTextFieldContext,                            // 함수로 넘기면 strict: true
  { useContext: useFieldContext, strict: false }, // 객체로 넘기면 strict 기본값 false
]);
```

- wrapper가 반드시 있어야 한다 → 훅을 함수로 넘긴다. context가 없으면 에러가 난다.
- wrapper가 선택적이다(Field 등) → `{ useContext, strict: false }`로 넘긴다. context가 없으면 건너뛴다.

### Headless context stateProps 재사용

규칙은 `packages/react/src/components/AGENTS.md`에 있다. headless context hook을 `createWithStateProps([useComponentItemContext])`에 직접 연결한다. 같은 `data-*`를 만드는 `useComponentItemStateProps` 같은 helper를 새로 만들지 않는다. React 레이어는 className·variant 연결만 더하고 headless가 만든 ARIA·id·keyboard·data-state를 다시 만들지 않는다.

### Hook props와 component props 중복 선언 방지

```typescript
export interface ComponentItemProps
  extends UseComponentItemProps,
    PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}
```

- hook props를 component props에 손으로 다시 선언하지 않는다 → hook props 타입을 확장한다.
- hook props가 union → component props도 union·type alias로 유지한다.
- wrapper가 hook props를 재조합해야 한다 → mode별 branch로 나눠 불가능한 조합이 섞이지 않게 한다.

### Headless primitive wrapper의 props source

styled 컴포넌트가 headless primitive를 감싸면 headless primitive props를 원천으로 삼는다. `PrimitiveProps + React.HTMLAttributes`를 다시 선언하면 headless 전용 prop, ARIA 계약, event signature가 빠진다.

1. 같은 headless를 쓰는 기존 컴포넌트의 props 선언을 연다. 예: `packages/react/src/components/SidePanel/SidePanel.tsx`
2. subcomponent props를 대응 headless props로 선언한다. 예: `SidePanelTriggerProps extends Drawer.TriggerProps`. Content·Title·CloseButton도 대응하는 `Drawer.*Props`를 쓴다.
3. styled 레이어가 더하는 recipe·style prop만 교차한다. 예: `Drawer.ContentProps & Pick<StyleProps, "width" | "maxWidth">`

## Form/Field 통합 패턴

form 요소가 `<Field.Root>` 안에서 쓰일 수 있으면 `packages/react/src/components/TextField/TextField.tsx`를 따른다.

1. state props wrapper를 둘 만든다. Root용 `withFieldStateProps`는 Field만(non-strict), 자식 slot용 `withStateProps`는 자체 context(strict) + Field(non-strict)를 본다.
2. Root는 `withProvider(withFieldStateProps(TextField.Root), "root")`로 Field state만 받는다.
3. 자식 slot은 `withContext(withStateProps(InternalIcon), "prefixIcon")`처럼 두 state를 모두 받는다.
4. Input은 `useFieldContext({ strict: false })`로 Field를 읽고 `mergeProps`로 합성한다.

```typescript
const mergedProps = mergeProps(
  fieldContext ? fieldContext.stateProps : {},
  fieldContext ? fieldContext.inputAriaAttributes : {},
  textFieldContext.inputProps,
  fieldContext ? fieldContext.inputProps : {},
  otherProps,
);
```

금지와 대신 할 일:

- 필수 필드를 HTML `required`만으로 표시하지 않는다 → SEED headless는 커스텀 검증을 쓰므로 `aria-required`를 쓴다. 네이티브 폼 검증도 필요하면 `required`와 `aria-required`를 함께 쓴다.
- `useId()`로 ID를 직접 만들지 않는다 → Field context가 준 ID·ARIA 속성(`inputAriaAttributes`)을 `mergeProps`로 받는다.
- `useFieldContext({ strict: true })`로 Field를 필수로 만들지 않는다 → `strict: false`로 읽고 Field 없이도 동작하게 한다.

## Namespace 패턴

compound 컴포넌트(카테고리 B·C·D)에만 `ComponentName.Root` 형태의 namespace를 만든다. 단일 컴포넌트(A)와 레이아웃(E)에는 만들지 않는다.

```text
Component/
├── Component.tsx           # 구현 (ComponentRoot, ComponentLabel, ...)
├── Component.namespace.ts  # 짧은 이름 re-export
└── index.ts                # 공개 API
```

```typescript
// Component.namespace.ts
export {
  ComponentRoot as Root,
  ComponentLabel as Label,
  type ComponentRootProps as RootProps,
  type ComponentLabelProps as LabelProps,
} from "./Component";

// index.ts
export { ComponentRoot, ComponentLabel } from "./Component";
export * as ComponentName from "./Component.namespace";
export type { ComponentRootProps, ComponentLabelProps } from "./Component";
```

## Multi-Recipe 패턴

레퍼런스: `packages/react/src/components/Checkbox/Checkbox.tsx`, `Switch/Switch.tsx`.

1. recipe마다 context를 만든다. 그룹은 `createRecipeContext(checkboxGroup)`, 각 slot recipe는 `createSlotRecipeContext(checkbox)`, `createSlotRecipeContext(checkmark)`.
2. Root에서 `splitMultipleVariantsProps(props, { checkbox, checkmark })`로 variant props를 한 번에 나눈다. import는 `../../utils/splitMultipleVariantsProps`다.
3. headless primitive를 함께 노출하려면 `Object.assign(forwardRef(...), { Primitive: CheckboxPrimitive.Root })`로 Root를 만든다.

## 접근성 경고 패턴

Field 밖에서 단독으로 쓰일 수 있는 입력 컴포넌트는 label이 없을 때 `console.warn`으로 알린다. 새 경고는 개발 모드에서만 낸다(`packages/react/src/components/Icon/Icon.tsx` 방식). `TextFieldInput`·`TextFieldTextarea`의 기존 경고는 이 조건 없이 호출된다.

```typescript
if (process.env.NODE_ENV !== "production") {
  if (!fieldContext && !otherProps["aria-label"] && !otherProps["aria-labelledby"]) {
    console.warn("Component: Either use within Field.Root or provide aria-label/aria-labelledby");
  }
}
```
