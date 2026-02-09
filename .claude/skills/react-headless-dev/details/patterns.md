# Headless 컴포넌트 패턴

## Custom Hook Pattern

중요 비즈니스 로직은 커스텀 훅 파일에 작성합니다.

```typescript
// use{Component}.ts
export function useCheckbox(props: UseCheckboxProps) {
  const [checked, setChecked] = useState(props.defaultChecked);
  const [focused, setFocused] = useState(false);

  const handleChange = useCallback(() => {
    setChecked((prev) => !prev);
    props.onChange?.(!checked);
  }, [checked, props.onChange]);

  return {
    rootProps: {
      "data-checked": checked,
      "data-focused": focused,
      onClick: handleChange,
    },
    inputProps: {
      type: "checkbox",
      checked,
      onChange: handleChange,
      onFocus: () => setFocused(true),
      onBlur: () => setFocused(false),
    },
  };
}
```

**가이드라인**:

- 파일명: `use{Component}.ts`
- 각 hook은 parts별 props 반환 (rootProps, inputProps, labelProps 등)
- 상태 관리, 이벤트 핸들링, 접근성 로직 캡슐화

## Primitive Composition

컴포넌트 파일은 커스텀 훅의 parts를 spread하여 조합합니다.

```typescript
// {Component}.tsx
import { useCheckbox } from "./useCheckbox";

export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(
  (props, ref) => {
    const { rootProps, inputProps } = useCheckbox(props);

    return (
      <button ref={ref} {...rootProps}>
        <input {...inputProps} />
        {props.children}
      </button>
    );
  }
);
Checkbox.displayName = "Checkbox";
```

## Namespace Pattern (Multi-Part Components)

Parts가 여러 개인 경우 `{Component}.namespace.ts` 파일을 정의합니다.

```typescript
// Dialog.namespace.ts
export { Dialog as Root } from "./Dialog";
export { DialogTrigger as Trigger } from "./DialogTrigger";
export { DialogContent as Content } from "./DialogContent";
export { DialogHeader as Header } from "./DialogHeader";
export { DialogTitle as Title } from "./DialogTitle";
export { DialogDescription as Description } from "./DialogDescription";
export { DialogFooter as Footer } from "./DialogFooter";
export { DialogClose as Close } from "./DialogClose";
```

```typescript
// index.ts
import * as Dialog from "./Dialog.namespace";
export { Dialog };
```

**사용 예시**:

```typescript
import { Dialog } from "@seed-design/react-headless";

<Dialog.Root>
  <Dialog.Trigger>Open</Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Title</Dialog.Title>
    </Dialog.Header>
  </Dialog.Content>
</Dialog.Root>;
```

## Context Pattern (Multi-Part)

Parts 간 상태 공유가 필요한 경우 Context를 사용합니다.

```typescript
// DialogContext.tsx
const DialogContext = createContext<UseDialogReturn | null>(null);

export function useDialogContext() {
  const context = useContext(DialogContext);
  if (!context) throw new Error("Dialog parts must be used within Dialog.Root");
  return context;
}
```

## Controlled & Uncontrolled 지원

`@seed-design/react-use-controllable-state` 패키지를 사용하여 controlled/uncontrolled 상태를 관리합니다.

```typescript
import { useControllableState } from "@seed-design/react-use-controllable-state";

export function useCheckbox(props: UseCheckboxProps) {
  // value가 있으면 controlled, 없으면 uncontrolled
  const [internalValue, setInternalValue] = useControllableState({
    prop: props.value,
    defaultProp: props.defaultValue ?? false,
    onChange: props.onChange,
  });
  const checked = props.value ?? internalValue;

  const handleChange = useCallback(() => {
    if (props.disabled) return;
    const newValue = !checked;
    setInternalValue(newValue);
    props.onChange?.(newValue);
  }, [checked, props.disabled, props.onChange]);

  // ...
}
```
