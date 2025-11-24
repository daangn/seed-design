---
name: react-headless-dev
description: SEED React Headless component development specialist. Use when developing unstyled, logic-only components in packages/react-headless folder. Focuses on data-driven primitives, custom hooks, and state management without styling concerns.
allowed-tools: Read, Write, Edit, MultiEdit, Bash, Glob, Grep
---

# React Headless Component Developer

Develop unstyled React components following SEED headless architecture patterns.

## Purpose

이 스킬은 SEED Design System의 React Headless 컴포넌트를 개발합니다. Headless 컴포넌트는 스타일 없이 순수한 데이터 로직과 상태 관리만 제공하며, `@seed-design/react` 패키지에서 스타일을 입힐 수 있는 기반을 제공합니다.

## When to Use

다음 상황에서 이 스킬을 사용하세요:

1. **새 Headless 컴포넌트 생성**: `packages/react-headless/` 폴더에 새로운 컴포넌트 추가
2. **Headless 로직 리팩토링**: 기존 컴포넌트의 비즈니스 로직 개선 또는 분리
3. **Custom Hook 구현**: 컴포넌트의 상태 관리와 이벤트 핸들링 로직 작성
4. **Primitive 조합**: React 기본 요소들을 조합한 컴포지션 패턴 구현
5. **Data Attributes 정의**: 컴포넌트 상태를 표현하는 data attributes 설계

**트리거 키워드**: "headless component", "unstyled component", "custom hook", "primitive composition", "packages/react-headless"

## Architecture Principles

### 1. Style-Free Logic

**원칙**: 스타일 관련 로직 없이 순수 컴포넌트 데이터 로직만 제공

```typescript
// ❌ Bad: 스타일 관련 로직 포함
const Button = () => {
  const className = size === 'large' ? 'btn-lg' : 'btn-sm'
  return <button className={className} />
}

// ✅ Good: 데이터만 제공, 스타일은 @seed-design/react에서 처리
const Button = () => {
  return <button data-size={size} />
}
```

**스타일 관련 컴포넌트 로직 및 옵션은 `@seed-design/react` 패키지에서 제공합니다.**

### 2. Custom Hook Pattern

**원칙**: 중요 비즈니스 로직은 커스텀 훅 파일에 작성

```typescript
// use{Component}.ts
export function useCheckbox(props: UseCheckboxProps) {
  const [checked, setChecked] = useState(props.defaultChecked)
  const [focused, setFocused] = useState(false)

  const handleChange = useCallback(() => {
    setChecked(prev => !prev)
    props.onChange?.(!checked)
  }, [checked, props.onChange])

  return {
    rootProps: {
      'data-checked': checked,
      'data-focused': focused,
      onClick: handleChange,
    },
    inputProps: {
      type: 'checkbox',
      checked,
      onChange: handleChange,
      onFocus: () => setFocused(true),
      onBlur: () => setFocused(false),
    },
  }
}
```

**가이드라인**:
- 파일명: `use{Component}.ts` (예: `useCheckbox.ts`, `useRadio.ts`)
- 컴포넌트 복잡도에 따라 여러 개의 커스텀 훅 파일 작성 가능
- 각 hook은 parts별 props를 반환 (rootProps, inputProps, labelProps 등)
- 상태 관리, 이벤트 핸들링, 접근성 로직을 캡슐화

### 3. Primitive Composition

**원칙**: 컴포넌트 파일은 커스텀 훅의 parts를 spread하여 조합된 Primitive 컴포넌트들을 내보냄

```typescript
// {Component}.tsx
import { useCheckbox } from './useCheckbox'

export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(
  (props, ref) => {
    const { rootProps, inputProps } = useCheckbox(props)

    return (
      <button ref={ref} {...rootProps}>
        <input {...inputProps} />
        {props.children}
      </button>
    )
  }
)
```

**가이드라인**:
- 파일명: `{Component}.tsx` (예: `Checkbox.tsx`, `Radio.tsx`)
- 단순히 커스텀 훅에서 반환된 props를 spread
- DOM 요소 조합 및 children 배치만 담당
- 복잡한 로직은 hook에 위임

### 4. State-Driven Data Attributes

**원칙**: Data attributes는 컴포넌트의 상태를 나타내는 데이터 위주로 작성

```typescript
// ✅ Good: 상태를 나타내는 data attributes
<button
  data-checked={checked}
  data-disabled={disabled}
  data-invalid={invalid}
  data-required={required}
  data-focused={focused}
/>

// ❌ Bad: 스타일을 위한 computed prop
<button
  data-button-color="red"
  data-button-size="large"
  data-should-have-shadow={true}
/>
```

**일반적인 Data Attributes**:
- `data-checked`: 선택 상태 (checkbox, radio, switch)
- `data-disabled`: 비활성 상태
- `data-invalid`: 유효하지 않은 상태 (form fields)
- `data-required`: 필수 입력 (form fields)
- `data-focused`: 포커스 상태
- `data-pressed`: 눌린 상태 (button)
- `data-selected`: 선택된 상태 (list items, tabs)
- `data-expanded`: 확장된 상태 (accordion, dropdown)
- `data-loading`: 로딩 상태

### 5. Namespace Pattern (Multi-Part Components)

**원칙**: Parts가 여러 개인 경우 `{Component}.namespace.ts` barrel file을 정의하여 내보냄

```typescript
// Dialog.namespace.ts
export { Dialog as Root } from './Dialog'
export { DialogTrigger as Trigger } from './DialogTrigger'
export { DialogContent as Content } from './DialogContent'
export { DialogHeader as Header } from './DialogHeader'
export { DialogTitle as Title } from './DialogTitle'
export { DialogDescription as Description } from './DialogDescription'
export { DialogFooter as Footer } from './DialogFooter'
export { DialogClose as Close } from './DialogClose'
```

```typescript
// index.ts
import * as Dialog from './Dialog.namespace'
export { Dialog }
```

**사용 예시**:
```typescript
import { Dialog } from '@seed-design/react-headless'

<Dialog.Root>
  <Dialog.Trigger>Open</Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Title</Dialog.Title>
    </Dialog.Header>
  </Dialog.Content>
</Dialog.Root>
```

## Development Workflow

### Step 1: Requirements Analysis

사용자에게 다음 정보를 요청합니다:

**필수 정보**:
- **Component Name**: 예) `Checkbox`, `Radio`, `Dialog`
- **Component Type**:
  - **Single**: 단일 컴포넌트 (예: Checkbox, Switch)
  - **Multi-Part**: 여러 parts로 구성 (예: Dialog, Dropdown)
- **State Requirements**: 관리할 상태 목록 (checked, open, selected 등)
- **Event Handlers**: 필요한 이벤트 핸들러 (onChange, onOpen, onClose 등)

**선택 정보**:
- **Data Attributes**: 제공할 data attributes 목록
- **Accessibility**: ARIA attributes 요구사항
- **Controlled vs Uncontrolled**: 제어 컴포넌트 vs 비제어 컴포넌트

### Step 2: Package Structure Setup

Headless 컴포넌트는 `packages/react-headless/` 폴더 내에 위치합니다:

```
packages/react-headless/
├── checkbox/
│   ├── src/
│   │   ├── useCheckbox.ts        # Custom hook
│   │   ├── Checkbox.tsx           # Component
│   │   └── index.ts               # Public exports
│   ├── package.json
│   └── tsconfig.json
├── dialog/
│   ├── src/
│   │   ├── useDialog.ts           # Main hook
│   │   ├── Dialog.tsx             # Root component
│   │   ├── DialogTrigger.tsx      # Trigger part
│   │   ├── DialogContent.tsx      # Content part
│   │   ├── Dialog.namespace.ts    # Namespace barrel
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
```

**디렉토리 생성**:
```bash
mkdir -p packages/react-headless/{component-name}/src
```

### Step 3: Implement Custom Hook

**Step 3-1**: `use{Component}.ts` 파일 생성

```typescript
import { useCallback, useState } from 'react'

export interface Use{Component}Props {
  defaultValue?: boolean
  value?: boolean
  disabled?: boolean
  onChange?: (value: boolean) => void
}

export interface Use{Component}Return {
  // Part별 props 반환
  rootProps: {
    'data-checked': boolean
    'data-disabled': boolean
    onClick: () => void
  }
  inputProps: {
    type: 'checkbox'
    checked: boolean
    disabled: boolean
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  }
}

export function use{Component}(props: Use{Component}Props): Use{Component}Return {
  // 1. State management (controlled vs uncontrolled)
  const [internalValue, setInternalValue] = useState(props.defaultValue ?? false)
  const checked = props.value ?? internalValue

  // 2. Event handlers
  const handleChange = useCallback(() => {
    if (props.disabled) return

    const newValue = !checked
    setInternalValue(newValue)
    props.onChange?.(newValue)
  }, [checked, props.disabled, props.onChange])

  // 3. Return parts props
  return {
    rootProps: {
      'data-checked': checked,
      'data-disabled': props.disabled ?? false,
      onClick: handleChange,
    },
    inputProps: {
      type: 'checkbox',
      checked,
      disabled: props.disabled ?? false,
      onChange: handleChange,
    },
  }
}
```

**Hook 작성 가이드**:
1. **Controlled & Uncontrolled 모두 지원**:
   - `defaultValue` + `value` props 제공
   - `value`가 있으면 controlled, 없으면 uncontrolled
2. **이벤트 핸들러 최적화**:
   - `useCallback`으로 메모이제이션
   - 의존성 배열 정확히 명시
3. **접근성 고려**:
   - ARIA attributes 포함 (aria-checked, aria-disabled 등)
4. **타입 안정성**:
   - Props와 Return 타입 명확히 정의
   - Generic 타입 활용 가능

### Step 4: Implement Component

**Step 4-1**: `{Component}.tsx` 파일 생성

```typescript
import { forwardRef } from 'react'
import { use{Component}, Use{Component}Props } from './use{Component}'

export interface {Component}Props extends Use{Component}Props {
  children?: React.ReactNode
  className?: string
}

export const {Component} = forwardRef<HTMLButtonElement, {Component}Props>(
  (props, ref) => {
    const { children, className, ...hookProps } = props
    const { rootProps, inputProps } = use{Component}(hookProps)

    return (
      <button
        ref={ref}
        className={className}
        {...rootProps}
      >
        <input {...inputProps} />
        {children}
      </button>
    )
  }
)

{Component}.displayName = '{Component}'
```

**Component 작성 가이드**:
1. **Props Spreading**:
   - Hook props와 DOM props 분리
   - Hook에서 반환된 props를 spread
2. **Ref Forwarding**:
   - `forwardRef` 사용하여 ref 전달
   - 적절한 DOM 요소에 ref 연결
3. **Children Composition**:
   - children의 위치와 렌더링 방식 고려
4. **DisplayName**:
   - 디버깅을 위해 displayName 설정

### Step 5: Multi-Part Components (선택)

Parts가 여러 개인 경우:

**Step 5-1**: 각 Part별 파일 생성
```typescript
// DialogTrigger.tsx
export const DialogTrigger = forwardRef<HTMLButtonElement, DialogTriggerProps>(
  (props, ref) => {
    const { triggerProps } = useDialogContext()
    return <button ref={ref} {...triggerProps} {...props} />
  }
)
```

**Step 5-2**: Context 생성 (필요 시)
```typescript
// DialogContext.tsx
const DialogContext = createContext<UseDialogReturn | null>(null)

export function useDialogContext() {
  const context = useContext(DialogContext)
  if (!context) throw new Error('Dialog parts must be used within Dialog.Root')
  return context
}
```

**Step 5-3**: Namespace 파일 생성
```typescript
// Dialog.namespace.ts
export { Dialog as Root } from './Dialog'
export { DialogTrigger as Trigger } from './DialogTrigger'
export { DialogContent as Content } from './DialogContent'
// ... 다른 parts
```

### Step 6: Public Exports

**Step 6-1**: `index.ts` 파일 작성

**Single Component**:
```typescript
// index.ts
export { Checkbox } from './Checkbox'
export type { CheckboxProps } from './Checkbox'
export { useCheckbox } from './useCheckbox'
export type { UseCheckboxProps, UseCheckboxReturn } from './useCheckbox'
```

**Multi-Part Component**:
```typescript
// index.ts
import * as Dialog from './Dialog.namespace'
export { Dialog }

export type { DialogProps } from './Dialog'
export type { DialogTriggerProps } from './DialogTrigger'
// ... 다른 types

export { useDialog } from './useDialog'
export type { UseDialogProps, UseDialogReturn } from './useDialog'
```

### Step 7: Package Configuration

**Step 7-1**: `package.json` 확인

```json
{
  "name": "@seed-design/react-headless-{component-name}",
  "version": "1.0.0",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    }
  },
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  }
}
```

## Examples

### Example 1: Simple Checkbox Component

```typescript
// useCheckbox.ts
export function useCheckbox(props: UseCheckboxProps) {
  const [checked, setChecked] = useState(props.defaultChecked ?? false)
  const isChecked = props.checked ?? checked

  const handleChange = useCallback(() => {
    if (props.disabled) return
    const newValue = !isChecked
    setChecked(newValue)
    props.onChange?.(newValue)
  }, [isChecked, props.disabled, props.onChange])

  return {
    rootProps: {
      'data-checked': isChecked,
      'data-disabled': props.disabled ?? false,
      role: 'checkbox',
      'aria-checked': isChecked,
      onClick: handleChange,
    },
    inputProps: {
      type: 'checkbox',
      checked: isChecked,
      disabled: props.disabled,
      onChange: handleChange,
    },
  }
}

// Checkbox.tsx
export const Checkbox = forwardRef<HTMLDivElement, CheckboxProps>(
  (props, ref) => {
    const { children, ...hookProps } = props
    const { rootProps, inputProps } = useCheckbox(hookProps)

    return (
      <div ref={ref} {...rootProps}>
        <input {...inputProps} />
        {children}
      </div>
    )
  }
)
```

### Example 2: Multi-Part Dialog Component

```typescript
// useDialog.ts
export function useDialog(props: UseDialogProps) {
  const [open, setOpen] = useState(props.defaultOpen ?? false)
  const isOpen = props.open ?? open

  const handleOpenChange = useCallback((newOpen: boolean) => {
    setOpen(newOpen)
    props.onOpenChange?.(newOpen)
  }, [props.onOpenChange])

  return {
    isOpen,
    triggerProps: {
      'data-state': isOpen ? 'open' : 'closed',
      onClick: () => handleOpenChange(true),
    },
    contentProps: {
      'data-state': isOpen ? 'open' : 'closed',
      hidden: !isOpen,
    },
    closeProps: {
      onClick: () => handleOpenChange(false),
    },
  }
}

// Dialog.tsx
export const Dialog = (props: DialogProps) => {
  const dialog = useDialog(props)

  return (
    <DialogContext.Provider value={dialog}>
      {props.children}
    </DialogContext.Provider>
  )
}

// DialogTrigger.tsx
export const DialogTrigger = forwardRef<HTMLButtonElement, DialogTriggerProps>(
  (props, ref) => {
    const { triggerProps } = useDialogContext()
    return <button ref={ref} {...triggerProps} {...props} />
  }
)

// Dialog.namespace.ts
export { Dialog as Root } from './Dialog'
export { DialogTrigger as Trigger } from './DialogTrigger'
export { DialogContent as Content } from './DialogContent'
export { DialogClose as Close } from './DialogClose'
```

## Testing Guidelines

Headless 컴포넌트는 스타일이 없으므로 데이터 로직과 상태 관리를 테스트합니다:

```typescript
describe('useCheckbox', () => {
  it('should toggle checked state', () => {
    const { result } = renderHook(() => useCheckbox({}))

    expect(result.current.rootProps['data-checked']).toBe(false)

    act(() => {
      result.current.rootProps.onClick()
    })

    expect(result.current.rootProps['data-checked']).toBe(true)
  })

  it('should call onChange callback', () => {
    const onChange = vi.fn()
    const { result } = renderHook(() => useCheckbox({ onChange }))

    act(() => {
      result.current.rootProps.onClick()
    })

    expect(onChange).toHaveBeenCalledWith(true)
  })
})
```

**테스트 항목**:
- 상태 변화 (checked, open, selected 등)
- 이벤트 핸들러 호출
- Controlled vs Uncontrolled 모드
- Data attributes 정확성
- 접근성 attributes (ARIA)

## Checklist

컴포넌트 개발 후 다음 사항을 확인합니다:

- [ ] 스타일 관련 로직이 없는가?
- [ ] 커스텀 훅이 올바른 parts props를 반환하는가?
- [ ] Data attributes가 상태를 정확히 표현하는가?
- [ ] Controlled & Uncontrolled 모드를 모두 지원하는가?
- [ ] Ref forwarding이 올바르게 구현되었는가?
- [ ] Multi-part 컴포넌트의 경우 namespace 파일이 있는가?
- [ ] 접근성 attributes (ARIA)가 포함되었는가?
- [ ] TypeScript 타입이 정확하게 정의되었는가?
- [ ] Public exports (`index.ts`)가 올바르게 설정되었는가?
- [ ] 테스트가 작성되었는가?

## Reference

**기존 Headless 컴포넌트**:
- `packages/react-headless/` 폴더의 다른 컴포넌트들 참조
- 유사한 컴포넌트의 패턴 활용

**외부 라이브러리 참고**:
- Radix UI Primitives
- React Aria Components
- Headless UI

## Tips

1. **로직 분리**:
   - 비즈니스 로직은 hook에
   - DOM 조합은 컴포넌트에
   - 스타일은 `@seed-design/react`에

2. **상태 관리**:
   - Controlled와 Uncontrolled 모두 지원
   - `value`와 `defaultValue` 패턴 사용

3. **접근성 우선**:
   - ARIA attributes 항상 포함
   - 키보드 네비게이션 고려
   - 스크린 리더 호환성 확보

4. **타입 안정성**:
   - Props와 Return 타입 명확히
   - Generic 타입 적극 활용
   - JSDoc 주석으로 문서화

5. **테스트 작성**:
   - 상태 변화 테스트
   - 이벤트 핸들러 테스트
   - 엣지 케이스 커버

6. **Performance**:
   - `useCallback`, `useMemo` 활용
   - 불필요한 리렌더링 방지
   - 의존성 배열 정확히 관리
