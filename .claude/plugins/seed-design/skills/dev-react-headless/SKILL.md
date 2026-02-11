---
name: dev-react-headless
description: Develop style-free SEED React headless components with hook-first architecture, data-* state attributes, and forwardRef/displayName conventions. Use when creating or refactoring packages/react-headless components.
---

# Dev React Headless

스타일 없이 순수한 로직만 제공하는 Headless 컴포넌트를 개발합니다.

## Quick Start

1. `use{Component}.ts`에 상태/이벤트 로직을 작성합니다.
2. `{Component}.tsx`는 DOM 조합과 `data-*` 상태 표현만 담당하게 유지합니다.
3. Controlled/Uncontrolled, `forwardRef`, `displayName`을 체크합니다.
4. Multi-part 컴포넌트는 namespace 패턴을 사용하고 상세 패턴은 `details/patterns.md`를 참고합니다.

## 핵심 원칙

### 1. Style-Free Logic

**스타일 관련 로직 없이 순수 컴포넌트 데이터 로직만 제공**

✅ Good:

```typescript
const Button = () => {
  return <button data-size={size} />; // data-* 속성으로 상태 표현
};
```

❌ Bad:

```typescript
const Button = () => {
  const className = size === "large" ? "btn-lg" : "btn-sm"; // 스타일 로직
  return <button className={className} />;
};
```

### 2. Data Attributes로 상태 표현

| 속성            | 용도                        |
| --------------- | --------------------------- |
| `data-checked`  | 선택 상태 (checkbox, radio) |
| `data-disabled` | 비활성 상태                 |
| `data-focused`  | 포커스 상태                 |
| `data-pressed`  | 눌린 상태 (button)          |
| `data-expanded` | 확장 상태 (accordion)       |
| `data-loading`  | 로딩 상태                   |

### 3. Custom Hook + Component 분리

```text
use{Component}.ts  → 로직 (상태, 이벤트 핸들링)
{Component}.tsx    → DOM 조합 (훅 결과 spread)
```

## 파일 구조

```text
packages/react-headless/
├── {component-name}/
│   ├── src/
│   │   ├── use{Component}.ts      # Custom hook
│   │   ├── {Component}.tsx        # Component
│   │   ├── {Component}.namespace.ts  # Multi-part용 barrel (선택)
│   │   └── index.ts               # Public exports
│   ├── package.json
│   └── tsconfig.json
```

## Quick Reference

### Single Component

```typescript
// useCheckbox.ts
export function useCheckbox(props: UseCheckboxProps) {
  const [checked, setChecked] = useState(props.defaultChecked ?? false);

  return {
    rootProps: {
      "data-checked": checked,
      "data-disabled": props.disabled,
      onClick: () => setChecked(!checked),
    },
  };
}

// Checkbox.tsx
export const Checkbox = forwardRef<HTMLDivElement, CheckboxProps>(
  (props, ref) => {
    const { rootProps } = useCheckbox(props);
    return (
      <div ref={ref} {...rootProps}>
        {props.children}
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";
```

### Multi-Part Component

```typescript
// Dialog.namespace.ts
export { Dialog as Root } from "./Dialog";
export { DialogTrigger as Trigger } from "./DialogTrigger";
export { DialogContent as Content } from "./DialogContent";

// index.ts
import * as Dialog from "./Dialog.namespace";
export { Dialog };
```

## 체크리스트

- [ ] 스타일 관련 로직이 없는가?
- [ ] data-\* 속성으로 상태를 표현하는가?
- [ ] Controlled & Uncontrolled 모두 지원하는가?
- [ ] forwardRef가 적용되었는가?
- [ ] displayName이 설정되었는가?
- [ ] Multi-part인 경우 namespace 파일이 있는가?

## 상세 가이드

각 패턴의 상세 내용은 `details/` 폴더 참조:

- `details/patterns.md` - Hook, Namespace, Context 패턴

## 참고 자료

- 기존 컴포넌트: `packages/react-headless/` 폴더
- 외부 라이브러리: Radix UI, React Aria, Headless UI
