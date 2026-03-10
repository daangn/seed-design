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

## Step 5: Registry UI (Snippet 레이어)

**위치**: `docs/registry/ui/[name].tsx`

### Snippet 레이어가 필요한 경우

다음 조건 중 하나라도 해당하면 snippet 레이어를 추가해야 합니다:
1. **복합 컴포넌트**: Root+Content+Fallback 등 여러 서브컴포넌트를 조합해야 하는 경우 (Avatar, ImageFrame 등)
2. **서드파티 의존성 통합**: 외부 아이콘 라이브러리나 다른 패키지를 함께 사용해야 하는 경우
3. **보일러플레이트 단순화**: 사용자가 매번 직접 조합하면 너무 복잡한 경우 (Image.Root + Image.Fallback + Image.Content 등)

### 반대로 Snippet이 필요 없는 경우

- 단일 컴포넌트 (`<Button>`, `<Badge>` 등): `@seed-design/react`에서 직접 사용
- 이미 심플한 API를 가진 경우

### Snippet 파일 작성 패턴 (Avatar 참고)

```typescript
"use client";

import { ComponentName as SeedComponentName } from "@seed-design/react";
import * as React from "react";

export interface ComponentNameProps extends SeedComponentName.RootProps {
  src?: string;
  alt?: string;
  fallback?: React.ReactNode;
}

/**
 * @see https://seed-design.io/react/components/component-name
 */
export const ComponentName = React.forwardRef<HTMLDivElement, ComponentNameProps>(
  ({ src, alt, fallback, children, ...otherProps }, ref) => {
    return (
      <SeedComponentName.Root ref={ref} {...otherProps}>
        <SeedComponentName.Fallback>{fallback}</SeedComponentName.Fallback>
        <SeedComponentName.Image src={src} alt={alt} />
        {children}
      </SeedComponentName.Root>
    );
  },
);
ComponentName.displayName = "ComponentName";

// 하위 컴포넌트들도 re-export
export interface ComponentNameBadgeProps extends SeedComponentName.BadgeProps {}
export const ComponentNameBadge = SeedComponentName.Badge;
```

**추가 작업**:
1. `docs/registry/registry-ui.ts`에 entry 추가 (의존성 버전은 해당 컴포넌트가 추가된 버전 기준)
2. `bun --filter @seed-design/docs generate:registry` 실행

### React 문서 업데이트

Snippet 레이어가 있는 컴포넌트의 문서는 반드시 다음 형태로 업데이트해야 합니다:
- `## Installation` 섹션 추가: `npx @seed-design/cli@latest add ui:[name]` 명령어
- `<ManualInstallation name="[name]" />` 컴포넌트 추가
- `## Usage`의 import 경로를 `seed-design/ui/[name]`으로 변경
- Props 섹션 경로를 `./registry/ui/[name].tsx`로 변경

## Step 6: Examples

**위치**: `docs/examples/react/[name]/`

### Snippet 레이어가 있는 경우
```typescript
// preview.tsx - snippet에서 import
import { ComponentName } from "seed-design/ui/component-name";
// Layout 컴포넌트(Flex, VStack 등)는 계속 @seed-design/react에서
import { Flex } from "@seed-design/react";
```

### Snippet 레이어가 없는 경우
```typescript
// preview.tsx - @seed-design/react에서 직접 import
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
