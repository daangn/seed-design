---
name: component-flow-guide
description: 컴포넌트 개발 흐름 가이드. rootage 정의부터 문서, 테스트까지 전체 파이프라인을 안내합니다.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Component Flow Guide

컴포넌트 개발의 전체 흐름을 단계별로 안내합니다.

## Purpose

SEED Design의 컴포넌트는 여러 레이어를 거쳐 개발됩니다. 이 스킬은 새 컴포넌트 추가, 기존 컴포넌트 수정, 문서화, 테스트까지 전체 파이프라인을 안내합니다.

## When to Use

다음 상황에서 이 스킬을 사용하세요:

1. **새 컴포넌트 추가**: 처음부터 끝까지 전체 흐름 필요
2. **기존 컴포넌트 수정**: 어디서부터 시작해야 할지 파악
3. **Props 변경**: 정의부터 문서까지 동기화 필요
4. **스타일 수정**: 올바른 수정 위치 확인
5. **문서 업데이트**: 구현과 문서 일치 확인

**트리거 키워드**: "컴포넌트 추가", "컴포넌트 수정", "개발 흐름", "파이프라인", "component flow"

## Complete Flow

```
┌─────────────────────────────────────────────────────────────┐
│  1. HEADLESS (Optional) - packages/react-headless/          │
│     데이터 로직이 필요한 경우만                               │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  2. DEFINITION - packages/rootage/                          │
│     [name].yaml (스키마, 슬롯, variants)                     │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ bun generate:all
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  3. STYLES ⚠️ AUTO-GENERATED                                │
│     packages/css/, packages/qvism-preset/                   │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  4. RECIPE - packages/qvism-preset/src/recipes/             │
│     스타일 recipe 정의                                       │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  5. UI - packages/react/                                    │
│     {Component}.tsx + CSS integration                       │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  6. REGISTRY (Optional) - docs/registry/ui/                 │
│     복합 컴포넌트 snippet                                    │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  7. EXAMPLES - docs/components/example/                     │
│     preview, variants, usage patterns                       │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  8. STORYBOOK - docs/stories/                               │
│     LightTheme, DarkTheme, FontScaling 스토리               │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  9. DOCUMENTATION - docs/content/                           │
│     React 문서 + Design 문서                                 │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  10. VISUAL TESTING - Agent Browser                         │
│      docs, stackflow-spa, Storybook 테스트                  │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  11. FIGMA (Optional) - packages/figma/                     │
│      Codegen 핸들러 업데이트                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## Step 1: Headless (Optional)

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

---

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

**주의사항**:
- 컴포넌트의 모든 상태를 고려해 정의
- Figma MCP와 $FIGMA_IMAGE 참고

---

## Step 3: Styles (자동 생성)

`bun generate:all` 실행 시 자동 생성됩니다. **직접 수정하지 마세요.**

생성되는 파일:
- `packages/css/recipes/*.css` - CSS 스타일
- `packages/css/recipes/*.d.ts` - TypeScript 정의
- `packages/css/vars/component/*.ts` - 컴포넌트 변수
- `packages/qvism-preset/src/vars/component/*.ts` - Qvism 변수

---

## Step 4: Recipe (Qvism Preset)

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
      danger: { /* ... */ },
    },
    size: {
      small: { /* ... */ },
      medium: { /* ... */ },
      large: { /* ... */ },
    },
  },
  defaultVariants: {
    tone: "neutral",
    size: "medium",
  },
})
```

**주의사항**:
- hover 대신 active 상태 사용 권장 (모바일 우선)
- 사용 가능한 pseudo: active, focus, disabled 등

---

## Step 5: UI (React)

**위치**: `packages/react/src/components/[ComponentName]/`
**빌드**: 완료 후 `bun packages:build`

### 아키텍처 패턴

| 유형 | 패턴 | 예시 |
|------|------|------|
| 단일 컴포넌트 | `createRecipeContext` | Button, Badge |
| 복합 컴포넌트 | `createSlotRecipeContext` | TextField, Chip |
| 다중 슬롯 | Root, Label, Icon 분리 | List, Form |

```typescript
// ActionButton.tsx
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
```

**참고 문서**:
- Composition: `docs/content/react/components/concepts/composition.mdx`
- Icon: `docs/content/react/components/concepts/icon.mdx`

---

## Step 6: Registry UI (Optional)

**위치**: `docs/registry/ui/[name].tsx`
**조건**: 복합 컴포넌트의 경우 사용자 친화적 API 제공

```typescript
// docs/registry/ui/action-button.tsx
import { ActionButton as SeedActionButton } from "@seed-design/react"

export function ActionButton(props: ActionButtonProps) {
  return <SeedActionButton {...props} />
}
```

**추가 작업**:
1. `docs/registry/registry-ui.ts`에 entry 추가
2. `bun generate:registry` 실행 (docs 폴더에서)

---

## Step 7: Examples

**위치**: `docs/components/example/[name]-*.tsx`

```typescript
// action-button-preview.tsx
import { ActionButton } from "@seed-design/react"

export default function ActionButtonPreview() {
  return <ActionButton>Click me</ActionButton>
}

// action-button-sizes.tsx
export default function ActionButtonSizes() {
  return (
    <>
      <ActionButton size="small">Small</ActionButton>
      <ActionButton size="medium">Medium</ActionButton>
      <ActionButton size="large">Large</ActionButton>
    </>
  )
}
```

---

## Step 8: Storybook

**위치**: `docs/stories/[ComponentName].stories.tsx`
**명령어**: `bun storybook` (docs 폴더에서)

```typescript
import type { Meta, StoryObj } from "@storybook/react"
import { ActionButton } from "@seed-design/react"
import { VariantTable } from "./components/variant-table"

const meta: Meta<typeof ActionButton> = {
  component: ActionButton,
  title: "ActionButton",
}
export default meta

type Story = StoryObj<typeof ActionButton>

const variantMap = {
  tone: ["neutral", "brand", "danger"],
  size: ["small", "medium", "large"],
}

export const LightTheme: Story = {
  render: () => <VariantTable Component={ActionButton} variantMap={variantMap} />,
  parameters: { theme: "light" },
}

export const DarkTheme: Story = {
  render: () => <VariantTable Component={ActionButton} variantMap={variantMap} />,
  parameters: { theme: "dark" },
}

export const FontScalingExtraSmall: Story = {
  render: () => <VariantTable Component={ActionButton} variantMap={variantMap} />,
  parameters: { fontScale: "extraSmall" },
}

export const FontScalingExtraExtraExtraLarge: Story = {
  render: () => <VariantTable Component={ActionButton} variantMap={variantMap} />,
  parameters: { fontScale: "extraExtraExtraLarge" },
}
```

---

## Step 9: Documentation

### 9.1 React 문서

**위치**: `docs/content/react/components/[name].mdx`

```mdx
---
title: Action Button
description: React에서 Action Button 사용하기
---

<ComponentExample name="action-button-preview" />

## Installation

<package-install packages={["@seed-design/react"]} />

## Props

<react-type-table path="registry/ui/action-button.tsx" name="ActionButtonProps" />

## Examples

### Sizes

<ComponentExample name="action-button-sizes" />
```

### 9.2 Design 문서

**위치**: `docs/content/docs/components/[name].mdx`

```mdx
---
title: Action Button
description: 사용자 액션을 트리거하는 버튼
---

## 개요

Action Button은 ...

## 옵션

| 옵션 | 설명 |
|------|------|
| tone | 버튼의 색상 톤 |
| size | 버튼의 크기 |

## 스펙

<ComponentSpecBlock id="action-button" />
```

---

## Step 10: Visual Testing (Agent Browser)

Agent Browser를 사용하여 3개 환경에서 테스트합니다.

### 10.1 서버 시작

```bash
# 터미널 1: docs 개발 서버
cd docs && bun dev
# → localhost:3000

# 터미널 2: stackflow-spa 개발 서버
cd examples/stackflow-spa && bun dev
# → localhost:5173

# 터미널 3: Storybook
cd docs && bun storybook
# → localhost:6006
```

### 10.2 Agent Browser 테스트 플로우

```bash
# docs 테스트 - 컴포넌트 페이지
agent-browser open http://localhost:3000/react/components/[name]
agent-browser snapshot -i
agent-browser screenshot docs-[name].png
agent-browser close

# stackflow-spa 테스트 - 실제 앱 환경
agent-browser open http://localhost:5173
# Activity[ComponentName]으로 이동
agent-browser snapshot -i
agent-browser screenshot stackflow-[name].png
agent-browser close

# Storybook 테스트 - 테마별 검증
agent-browser open http://localhost:6006/?path=/story/[name]--light-theme
agent-browser snapshot -i
agent-browser screenshot storybook-[name]-light.png

agent-browser open http://localhost:6006/?path=/story/[name]--dark-theme
agent-browser screenshot storybook-[name]-dark.png

agent-browser open http://localhost:6006/?path=/story/[name]--font-scaling-extra-small
agent-browser screenshot storybook-[name]-font-xs.png

agent-browser open http://localhost:6006/?path=/story/[name]--font-scaling-extra-extra-extra-large
agent-browser screenshot storybook-[name]-font-xxxl.png
agent-browser close
```

### 10.3 테스트 체크리스트

| 환경 | URL | 확인 사항 |
|------|-----|----------|
| docs | localhost:3000 | 컴포넌트 렌더링, 예제 동작 |
| stackflow-spa | localhost:5173 | 실제 앱 환경 동작 |
| Storybook Light | localhost:6006 | 라이트 모드 스타일 |
| Storybook Dark | localhost:6006 | 다크 모드 스타일 |
| Storybook Font XS | localhost:6006 | 작은 폰트 스케일 |
| Storybook Font XXXL | localhost:6006 | 큰 폰트 스케일 |

### 10.4 Figma 비교 (선택)

Figma 이미지와 Storybook 스크린샷 비교:

```bash
# 스크린샷 저장 위치
playwright-report/

# 비교 스크립트 (수동)
# Figma: $FIGMA_IMAGE
# Storybook: localhost:6006/?path=/story/[name]--[theme]
```

**불일치 발견 시**: Step 2(Rootage)부터 다시 검토

---

## Step 11: Figma Integration (Optional)

**위치**: `packages/figma/src/codegen/targets/react/component/handlers/[name].ts`
**조건**: Figma Codegen이 필요한 컴포넌트

```typescript
// handlers/action-button.ts
export const actionButtonHandler: ComponentHandler = {
  match: (node) => node.name.startsWith("ActionButton"),
  generate: (node, context) => {
    // Figma 노드를 React 코드로 변환
    return `<ActionButton tone="${getTone(node)}" size="${getSize(node)}" />`
  },
}
```

---

## Generated Files (수정 금지)

다음 파일들은 자동 생성되므로 직접 수정하지 마세요:

| 패턴 | 소스 |
|------|------|
| `packages/css/recipes/*` | rootage |
| `packages/css/vars/component/*` | rootage |
| `packages/qvism-preset/src/vars/component/*` | rootage |
| `packages/rootage/components/schema.json` | rootage |
| `docs/registry/*.json` | registry-*.ts |

**수정 방법**: 소스 파일 수정 후 `bun generate:all` 실행

---

## Verification Checklist

컴포넌트 작업 완료 전 확인:

- [ ] Rootage 정의가 완전한가?
- [ ] `bun generate:all` 실행했는가?
- [ ] Recipe가 `recipes/index.ts`에 export 되었는가?
- [ ] React 컴포넌트가 빌드되는가? (`bun packages:build`)
- [ ] 문서가 실제 API와 일치하는가?
- [ ] 예제가 동작하는가?
- [ ] Storybook 스토리가 테마별로 정상인가?
- [ ] `bun generate:registry` 실행했는가?
- [ ] 타입 에러가 없는가? (`bun typecheck`)
- [ ] Visual Test 통과했는가? (Agent Browser)

---

## MCP 사용 주의사항

### Seed Design MCP

- Figma에서 선택된 frame이 없으면 사용자에게 선택 요청
- 연결 오류 시: `bun mcp:start` 실행

### Agent Browser

- 스크린샷은 `playwright-report/` 폴더에 저장
- Storybook 스크롤 위치 조정 후 전체 캡처
- `agent-browser --help`로 명령어 확인

---

## Common Mistakes

### 잘못된 순서

```
❌ React 먼저 → Rootage 나중에
   → CSS 변수가 없어서 스타일 깨짐

✅ Rootage → generate → Recipe → React → Docs → Test
```

### Recipe export 누락

```
❌ Recipe 작성 후 index.ts에 추가 안 함
   → 컴포넌트에서 import 실패

✅ recipes/index.ts에 반드시 export 추가
```

### 테스트 생략

```
❌ 구현만 하고 Visual Test 안 함
   → 다크모드/폰트 스케일링 버그 발견 못함

✅ Agent Browser로 모든 환경 테스트
```
