# 컴포넌트 구현 상세 가이드

## Step 1: Headless (선택)

**위치**: `packages/react-headless/[name]/`
**조건**: 데이터 로직이 필요한 경우만 (단순 UI 컴포넌트는 생략)

```typescript
// use{Component}.ts
export function useActionButton(props: UseActionButtonProps) {
  const [pressed, setPressed] = useState(false)

  return {
    rootProps: {
      'data-pressed': pressed,
      'data-disabled': props.disabled,
      onPointerDown: handlePointerDown,
      onClick: props.onClick,
    },
  }
}
```

## Step 2: Definition (Rootage)

**위치**: `packages/rootage/components/[name].yaml`
**명령어**: 완료 후 `bun generate:all`

```yaml
# [component-name].yaml
id: action-button
name: Action Button
description: 사용자 액션을 트리거하는 버튼

slots:
  root:
    description: 버튼 루트 요소

variants:
  tone:
    values: [neutral, brand, danger]
    default: neutral
  size:
    values: [small, medium, large]
    default: medium

states:
  - default
  - hover
  - pressed
  - disabled
```

## Step 3: Recipe (Qvism Preset)

**위치**: `packages/qvism-preset/src/recipes/[name].ts`
**추가 작업**: `recipes/index.ts`에 export 추가

```typescript
import { defineRecipe } from "@seed-design/qvism"
import { actionButton } from "../vars/component/action-button"

export const actionButtonRecipe = defineRecipe({
  base: actionButton.root,
  variants: {
    tone: {
      neutral: { /* ... */ },
      brand: { /* ... */ },
    },
    size: {
      small: { /* ... */ },
      medium: { /* ... */ },
    },
  },
  defaultVariants: {
    tone: "neutral",
    size: "medium",
  },
})
```

**주의**: hover 대신 active 상태 사용 (모바일 우선)

## Step 4: React 컴포넌트

**위치**: `packages/react/src/components/[ComponentName]/`
**빌드**: 완료 후 `bun packages:build`

### 아키텍처 패턴

| 유형 | 패턴 | 예시 |
|------|------|------|
| 단일 컴포넌트 | `createRecipeContext` | Button, Badge |
| 복합 컴포넌트 | `createSlotRecipeContext` | TextField, Chip |

```typescript
import { ActionButton as HeadlessActionButton } from '@seed-design/react-headless'
import { actionButton } from '@seed-design/css/components/action-button'

export const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(
  ({ tone = 'neutral', size = 'medium', ...props }, ref) => {
    return (
      <HeadlessActionButton
        ref={ref}
        className={actionButton({ tone, size })}
        {...props}
      />
    )
  }
)
ActionButton.displayName = "ActionButton"
```

## Step 5: Registry UI (선택)

**위치**: `docs/registry/ui/[name].tsx`
**조건**: 복합 컴포넌트의 경우

**추가 작업**:
1. `docs/registry/registry-ui.ts`에 entry 추가
2. `bun --filter @seed-design/docs generate:registry` 실행

## Step 6: Examples

**위치**: `docs/components/example/[name]-*.tsx`

```typescript
// action-button-preview.tsx
import { ActionButton } from "@seed-design/react"

export default function ActionButtonPreview() {
  return <ActionButton>Click me</ActionButton>
}
```

## Step 7: Storybook

**위치**: `docs/stories/[ComponentName].stories.tsx`
**명령어**: `bun storybook` (docs 폴더에서)

필수 스토리:
- `LightTheme` - 라이트 테마
- `DarkTheme` - 다크 테마
- `FontScalingExtraSmall` - 작은 폰트
- `FontScalingExtraExtraExtraLarge` - 큰 폰트

## Step 8: Documentation

### React 문서
**위치**: `docs/content/react/components/[name].mdx`

### Design 문서
**위치**: `docs/content/docs/components/[name].mdx`
