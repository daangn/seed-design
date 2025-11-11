---
name: react-docs-generator
description: Generate React component documentation for SEED Design System. Use when generating documentation for new components or updating existing components. You have to use this skill when generating in ./docs/content/react directory.
---

# React Component Docs Generator

## Example

`<ComponentExample>` 컴포넌트를 사용하여 컴포넌트 예시를 작성합니다.

```tsx
<ComponentExample name="react/component-name/example-name">
  ```json doc-gen:file
  {
    "file": "examples/react/component-name/example-name.tsx",
    "codeblock": true
  }
</ComponentExample>
```

- `<ComponentExample>` 컴포넌트는 mdx-components 폴더에서 자동으로 가져오기 때문에 import 필요 없음

## Installation

Snippet 레이어가 존재하는 경우만 아래와 같이 컴포넌트 설치 명령어를 작성합니다.
Snippet 레이어가 존재하지 않는 경우 바로 Usage로 넘어갑니다.

```package-install
npx @seed-design/cli@latest add ui:component-name
```

`<ManualInstallation>` 컴포넌트를 사용하면 CLI를 통한 설치가 아닌 수동 설치 방법을 알려줍니다.

```tsx
<ManualInstallation name="component-name">
  ```json doc-gen:file
  {
    "file": "examples/react/component-name/manual-installation.tsx",
    "codeblock": true
  }
</ManualInstallation>
```

## Usage

Example (Alert Dialog):

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
} from "@/components/ui/alert-dialog"
```

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

Example (Badge):

```tsx
import { Badge } from "@seed-design/react";
```

```tsx
<Badge>Badge</Badge>
```

- 각 컴포넌트의 Snippet 레이어를 참고하여 유저 입장에서 import 해야하는 part와 대략적인 컴포넌트 계층 구조를 알려줍니다.
- Snippet이 존재하지 않는다면 `@seed-design/react` 패키지에서 참고할 수 있습니다. (Badge 예시)
- ./docs/registry/ui/* 폴더에서 Snippet 레이어를 참고할 수 있습니다. (Alert Dialog 예시)
- Example, Installation 이후 Usage 섹션을 작성합니다.

## Examples

`<ComponentExample>` 컴포넌트를 사용하여 컴포넌트 예시를 작성합니다.

```tsx
<ComponentExample name="react/component-name/example-name">
  ```json doc-gen:file
  {
    "file": "examples/react/component-name/example-name.tsx",
    "codeblock": true
  }
</ComponentExample>
```

- examples/* 폴더에 있는 예시 컴포넌트를 참고하여 컴포넌트 예시를 작성합니다.
