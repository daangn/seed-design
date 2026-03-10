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

### defineRecipe vs defineSlotRecipe

슬롯이 하나인 단순 컴포넌트는 `defineRecipe`, 여러 슬롯이 필요한 복합 컴포넌트는 `defineSlotRecipe`를 사용합니다.

**defineSlotRecipe 예시 (Avatar 패턴)**:
```typescript
const avatar = defineSlotRecipe({
  name: "avatar",
  slots: ["root", "image", "fallback", "badge"],
  base: {
    root: { /* root 슬롯 스타일 */ },
    fallback: {
      display: "flex",
      width: "100%",
      height: "100%",
    },
  },
  variants: {
    size: {
      48: {
        root: { "--avatar-size": "48px" },   // 슬롯별로 variants 적용
        badge: { "--badge-size": "16px" },
      },
    },
  },
})
```

⚠️ **중요**: `defineSlotRecipe`로 변경하거나 슬롯을 추가한 후에는 반드시 `bun generate:all`을 실행하세요.
- CSS 클래스명이 `.seed-{name}` → `.seed-{name}__root` 형태로 변경됩니다.
- generate 없이 React 코드만 수정하면 CSS와 불일치가 발생합니다.

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

### SlotRecipe 기반 복합 컴포넌트 패턴

슬롯 recipe를 사용하는 경우 `createSlotRecipeContext`를 활용합니다:

```typescript
// ✅ 올바른 패턴 (Avatar 참고)
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { avatar } from "@seed-design/css/recipes/avatar";

const { withProvider, withContext } = createSlotRecipeContext(avatar);
// avatar는 (props) => { root: string, image: string, fallback: string, badge: string } 반환

export const AvatarRoot = withProvider<HTMLDivElement, AvatarRootProps>(Image.Root, "root");
export const AvatarFallback = withContext<HTMLDivElement, AvatarFallbackProps>(Image.Fallback, "fallback");
// → AvatarFallback에 자동으로 seed-avatar__fallback 클래스 적용
```

**⚠️ 흔한 실수들**:

1. **존재하지 않는 패키지 import**:
   - ❌ `import { createSlotRecipeContext } from "@seed-design/react-utils"` (이 패키지 없음)
   - ✅ `import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext"`

2. **잘못된 createSlotRecipeContext 호출**:
   - ❌ `createSlotRecipeContext({ root: imageFrameRecipe })` (단일 recipe를 객체로 감싸면 안 됨)
   - ✅ `createSlotRecipeContext(imageFrameRecipe)` (slotRecipe를 직접 전달)

3. **React 레이어에 style 직접 작성**:
   - ❌ `<Image.Fallback style={{ width: "100%", height: "100%" }}>`
   - ✅ qvism-preset recipe의 해당 슬롯(예: `fallback`)에 스타일을 작성하고, `withContext(Image.Fallback, "fallback")`으로 연결

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
