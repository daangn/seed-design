# Data Attributes 가이드

## 원칙

Data attributes는 컴포넌트의 **상태를 나타내는 데이터** 위주로 작성합니다.

✅ Good - 상태를 나타내는 data attributes:
```typescript
<button
  data-checked={checked}
  data-disabled={disabled}
  data-invalid={invalid}
  data-required={required}
  data-focused={focused}
/>
```

❌ Bad - 스타일을 위한 computed prop:
```typescript
<button
  data-button-color="red"     // ❌ 스타일 용도
  data-button-size="large"    // ❌ 스타일 용도
  data-should-have-shadow     // ❌ 스타일 용도
/>
```

## 일반적인 Data Attributes

| 속성 | 용도 | 사용 컴포넌트 |
|------|------|--------------|
| `data-checked` | 선택 상태 | Checkbox, Radio, Switch |
| `data-disabled` | 비활성 상태 | 모든 상호작용 컴포넌트 |
| `data-invalid` | 유효하지 않은 상태 | Form fields |
| `data-required` | 필수 입력 | Form fields |
| `data-focused` | 포커스 상태 | 모든 상호작용 컴포넌트 |
| `data-pressed` | 눌린 상태 | Button |
| `data-selected` | 선택된 상태 | List items, Tabs |
| `data-expanded` | 확장된 상태 | Accordion, Dropdown |
| `data-loading` | 로딩 상태 | Button, 비동기 컴포넌트 |
| `data-state` | 복합 상태 | "open" / "closed" 등 |

## CSS에서 활용

Headless에서 정의한 data attributes는 `@seed-design/react`에서 스타일링에 활용됩니다:

```css
/* packages/css/recipes/checkbox.css */
[data-checked="true"] {
  background: var(--seed-color-brand);
}

[data-disabled="true"] {
  opacity: 0.4;
  cursor: not-allowed;
}

[data-focused="true"] {
  outline: 2px solid var(--seed-color-focus);
}
```

## 타입 정의

```typescript
interface RootProps {
  'data-checked': boolean
  'data-disabled': boolean
  'data-focused': boolean
  onClick: () => void
}
```

## Boolean vs String

- **Boolean 상태**: `data-checked={true}` → `data-checked="true"`
- **열거형 상태**: `data-state="open"` | `data-state="closed"`

```typescript
// Boolean
<div data-checked={checked} />  // → data-checked="true" or data-checked="false"

// Enum
<div data-state={isOpen ? "open" : "closed"} />  // → data-state="open" or data-state="closed"
```
