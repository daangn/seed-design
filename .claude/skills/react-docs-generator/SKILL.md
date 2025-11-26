---
name: react-docs-generator
description: Generate React component documentation for SEED Design System. Use when creating new React component docs in ./docs/content/react/components or updating existing implementation documentation. Helps document component APIs, props, installation, and usage examples.
allowed-tools: Read, Write, Glob, Grep, Bash
---

# React Component Documentation Generator

Generate comprehensive React component documentation following SEED Design patterns.

## Purpose

이 스킬은 SEED Design System의 React 컴포넌트 구현 문서를 생성합니다. 컴포넌트 API, Props, 설치 방법, 사용 예시 등을 표준화된 형식으로 작성할 수 있도록 돕습니다.

## When to Use

다음 상황에서 이 스킬을 사용하세요:

1. **새 React 컴포넌트 문서 작성**: 새로운 컴포넌트의 React 구현 문서를 처음 생성할 때
2. **기존 문서 업데이트**: 컴포넌트 API 변경, 새로운 Props 추가, 예시 업데이트 시
3. **예시 코드 추가**: 새로운 사용 패턴이나 use case 예시를 추가할 때
4. **설치 가이드 작성**: CLI 설치 또는 수동 설치 방법을 문서화할 때

**트리거 키워드**: "React 문서", "component docs", "implementation docs", "API documentation", "usage examples"

## Key Features

- **ComponentExample 통합**: `doc-gen:file` 구문으로 실제 코드 예시 임베드
- **설치 가이드 자동화**: CLI 및 수동 설치 방법 템플릿 제공
- **Props 문서화**: TypeScript 타입과 함께 Props 테이블 생성
- **Usage 패턴**: Import 문부터 컴포넌트 사용까지 단계별 가이드
- **MDX 컴포넌트 활용**: 자동으로 import되는 특수 컴포넌트 사용

## Documentation Structure

React 컴포넌트 문서는 다음 구조를 따릅니다:

```markdown
---
title: {Component Name}
description: {한국어 설명}
---

## Example           # 컴포넌트 사용 예시
## Installation      # CLI 또는 수동 설치 방법 (Snippet 레이어가 있는 경우)
## Usage             # Import 및 기본 사용법
## Props             # Props API 문서 (선택)
## Examples          # 다양한 사용 사례
## Accessibility     # 접근성 가이드 (선택)
## API Reference     # 상세 API 레퍼런스 (선택)
```

## Workflow

### Step 1: 컴포넌트 정보 수집

사용자에게 다음 정보를 요청합니다:

**필수 정보**:
- **Component ID**: 예) `alert-dialog`, `badge`, `button`
- **Component Name**: 예) "Alert Dialog", "Badge", "Button"
- **Description**: 한국어로 컴포넌트 설명 (1-2문장)

**선택 정보**:
- **Has Snippet Layer**: Snippet 레이어 존재 여부 (있으면 Installation 섹션 포함)
- **Component Type**:
  - **Composite**: 여러 sub-component로 구성 (예: Alert Dialog)
  - **Simple**: 단일 컴포넌트 (예: Badge)
- **Custom Sections**: Props, Accessibility, API Reference 등 추가 섹션

### Step 2: Snippet 레이어 확인

`./docs/registry/ui/{component-id}.tsx` 파일이 있는지 확인합니다:

- **Snippet 있음** → Installation 섹션 포함, Usage에서 Snippet import 사용
- **Snippet 없음** → `@seed-design/react`에서 직접 import, Usage만 작성

```bash
# Snippet 레이어 확인
ls docs/registry/ui/{component-id}.tsx
```

### Step 3: 컴포넌트 구조 파악

**Composite 컴포넌트인 경우**:
- Snippet 파일 또는 `@seed-design/react` export를 확인하여 sub-component 목록 추출
- 예) Alert Dialog: AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, etc.

**Simple 컴포넌트인 경우**:
- 단일 컴포넌트만 문서화
- 예) Badge: Badge만

### Step 4: 문서 생성

## Example Section

`<ComponentExample>` 컴포넌트를 사용하여 대표 예시를 작성합니다.

```markdown
## Example

<ComponentExample name="react/{component-id}/default">
  ```json doc-gen:file
  {
    "file": "examples/react/{component-id}/default.tsx",
    "codeblock": true
  }
  ```
</ComponentExample>
```

**참고**:
- `<ComponentExample>` 컴포넌트는 mdx-components에서 자동 import됨
- `name` 속성: `react/{component-id}/{example-name}` 패턴
- `doc-gen:file`을 사용하면 실제 파일 내용이 코드블록으로 렌더링됨

## Installation Section (Snippet 레이어가 있는 경우만)

Snippet 레이어가 존재하는 경우 CLI 설치 방법을 안내합니다:

```markdown
## Installation

다음 명령어로 컴포넌트를 설치할 수 있습니다:

```package-install
npx @seed-design/cli@latest add ui:{component-id}
```

### 수동 설치

CLI를 사용하지 않고 직접 설치하려면 다음 방법을 사용하세요:

<ManualInstallation name="{component-id}">
  ```json doc-gen:file
  {
    "file": "examples/react/{component-id}/manual-installation.tsx",
    "codeblock": true
  }
  ```
</ManualInstallation>
```

**Snippet 레이어가 없는 경우**:
- Installation 섹션 생략
- Usage 섹션에서 바로 `@seed-design/react`에서 import 안내

## Usage Section

컴포넌트의 기본 사용법을 안내합니다.

### Composite 컴포넌트 예시 (Alert Dialog):

```markdown
## Usage

Alert Dialog는 다음 sub-component들로 구성됩니다:

```tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"  // Snippet이 있는 경우
// 또는
// } from "@seed-design/react"  // Snippet이 없는 경우
```

기본 사용 예시:

```tsx
<AlertDialog>
  <AlertDialogTrigger>Open</AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```
```

### Simple 컴포넌트 예시 (Badge):

```markdown
## Usage

Badge 컴포넌트를 사용하려면 다음과 같이 import합니다:

```tsx
import { Badge } from "@seed-design/react";
```

기본 사용 예시:

```tsx
<Badge>Badge</Badge>
```
```

**Usage 작성 가이드**:
1. **Import 경로 명확히**:
   - Snippet 있음: `@/components/ui/{component-id}`
   - Snippet 없음: `@seed-design/react`
2. **Sub-component 목록**: Composite인 경우 모든 sub-component 나열
3. **기본 구조**: 컴포넌트의 전형적인 계층 구조 예시 제공
4. **간결함**: Usage는 가장 기본적인 사용법만, 상세한 예시는 Examples 섹션에

## Examples Section

다양한 사용 사례와 패턴을 보여줍니다.

```markdown
## Examples

### {Use Case 1}

<ComponentExample name="react/{component-id}/{example-name}">
  ```json doc-gen:file
  {
    "file": "examples/react/{component-id}/{example-name}.tsx",
    "codeblock": true
  }
  ```
</ComponentExample>

### {Use Case 2}

<ComponentExample name="react/{component-id}/{example-name-2}">
  ```json doc-gen:file
  {
    "file": "examples/react/{component-id}/{example-name-2}.tsx",
    "codeblock": true
  }
  ```
</ComponentExample>
```

**Examples 작성 가이드**:
- 각 예시는 명확한 use case를 보여줘야 함
- 예시 이름은 의미 있는 케밥케이스 사용 (예: `with-icon`, `loading-state`, `custom-variant`)
- 실제 `examples/react/{component-id}/` 폴더에 예시 파일이 있어야 함
- 복잡한 패턴일수록 상세한 설명 추가

**일반적인 Examples**:
- Default: 기본 사용
- With Icon: 아이콘 포함
- Variants: 다양한 variant 조합
- Sizes: 다양한 size 조합
- States: disabled, loading 등 상태 변화
- Custom Styling: 커스텀 스타일 적용
- Composition: 다른 컴포넌트와 조합

## Props Section (선택)

컴포넌트의 Props API를 문서화합니다.

```markdown
## Props

### {ComponentName}

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | `'default' \| 'primary' \| 'secondary'` | `'default'` | 컴포넌트의 시각적 스타일을 지정합니다. |
| size | `'small' \| 'medium' \| 'large'` | `'medium'` | 컴포넌트의 크기를 지정합니다. |
| disabled | `boolean` | `false` | 컴포넌트를 비활성화합니다. |
| children | `React.ReactNode` | - | 컴포넌트의 자식 요소입니다. |
```

**Props 작성 가이드**:
- TypeScript 타입을 정확히 표기 (Union 타입은 백틱 내에서 `\|` 사용)
- Default 값이 있으면 명시, 없으면 `-`
- Description은 한국어로 명확하게
- Composite 컴포넌트는 각 sub-component마다 Props 테이블 작성

## File Paths

**문서 파일**:
```
docs/content/react/components/{component-id}.mdx
```

**예시 파일**:
```
examples/react/{component-id}/default.tsx
examples/react/{component-id}/with-icon.tsx
examples/react/{component-id}/variants.tsx
```

**Snippet 파일** (있는 경우):
```
docs/registry/ui/{component-id}.tsx
```

**수동 설치 예시** (Snippet이 있는 경우):
```
examples/react/{component-id}/manual-installation.tsx
```

## Special MDX Components

React 문서에서 사용 가능한 특수 컴포넌트들:

### 1. ComponentExample

컴포넌트 예시를 표시하는 컨테이너입니다.

```tsx
<ComponentExample name="react/component-id/example-name">
  ```json doc-gen:file
  {
    "file": "examples/react/component-id/example-name.tsx",
    "codeblock": true
  }
  ```
</ComponentExample>
```

- `name`: 예시의 고유 ID (`react/{component-id}/{example-name}`)
- `doc-gen:file`: 실제 파일 내용을 가져와 코드블록으로 렌더링
- `codeblock: true`: 코드블록으로 표시

### 2. ManualInstallation

수동 설치 방법을 안내하는 컴포넌트입니다.

```tsx
<ManualInstallation name="component-id">
  ```json doc-gen:file
  {
    "file": "examples/react/component-id/manual-installation.tsx",
    "codeblock": true
  }
  ```
</ManualInstallation>
```

- Snippet 레이어가 있는 컴포넌트에만 사용
- CLI 대신 수동으로 설치하는 방법 제공

### 3. package-install

패키지 설치 명령어를 표시하는 코드블록입니다.

```markdown
```package-install
npx @seed-design/cli@latest add ui:component-id
```
```

- Snippet 레이어 설치 명령어에 사용
- 자동으로 패키지 매니저별 명령어 변환 (npm, yarn, pnpm, bun)

## Checklist

문서 생성 후 다음 사항을 확인합니다:

- [ ] Frontmatter의 title과 description이 정확한가?
- [ ] Snippet 레이어 존재 여부에 따라 Installation/Usage 섹션이 올바른가?
- [ ] Import 경로가 정확한가? (`@/components/ui/*` vs `@seed-design/react`)
- [ ] ComponentExample의 name 속성이 `react/{component-id}/{example-name}` 패턴인가?
- [ ] 모든 예시 파일 경로가 실제 파일과 일치하는가?
- [ ] Composite 컴포넌트의 모든 sub-component가 문서화되었는가?
- [ ] Props 테이블의 타입이 정확하게 표기되었는가?
- [ ] 한국어 설명이 명확하고 일관된가?

## Reference Files

**참조할 기존 문서**:
- Composite 예시: `/docs/content/react/components/alert-dialog.mdx`
- Simple 예시: `/docs/content/react/components/badge.mdx`
- Snippet 레이어: `/docs/registry/ui/*.tsx`
- 예시 코드: `/examples/react/*/*.tsx`

## Tips

1. **Snippet vs Direct Import**:
   - Snippet이 있으면 사용자가 커스터마이징 가능
   - Snippet이 없으면 `@seed-design/react`에서 직접 사용
   - Installation 섹션은 Snippet이 있을 때만 작성

2. **Example 파일 작성**:
   - 예시 파일은 실제로 동작하는 코드여야 함
   - TypeScript로 작성하고 타입 안정성 확보
   - 필요한 import를 모두 포함

3. **MDX 컴포넌트 활용**:
   - `<ComponentExample>`, `<ManualInstallation>`은 자동 import됨
   - Import 문 불필요

4. **한국어 작성**:
   - Description, Props 설명은 한국어로
   - 코드 예시와 기술 용어는 영어 유지

5. **문서 업데이트**:
   - 기존 문서를 먼저 읽어서 내용 보존
   - 변경이 필요한 부분만 수정
   - 예시 추가 시 Examples 섹션만 업데이트
