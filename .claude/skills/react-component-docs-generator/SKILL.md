---
name: react-docs-generator
description: Generate React component documentation for SEED Design System. Use when generating documentation for new components or updating existing components. You have to use this skill when generating in ./docs/content/react directory.
---

# React Component Docs Generator

## Example

TBD

## Installation

TBD

## Usage

Example (Alert Dialog):

```tsx showLineNumbers
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

```tsx showLineNumbers
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

```tsx showLineNumbers
import { Badge } from "@seed-design/react";
```

```tsx showLineNumbers
<Badge>Badge</Badge>
```

- 각 컴포넌트의 Snippet 레이어를 참고하여 유저 입장에서 import 해야하는 part와 대략적인 컴포넌트 계층 구조를 알려줍니다.
- Snippet이 존재하지 않는다면 `@seed-design/react` 패키지에서 참고할 수 있습니다. (Badge 예시)
- ./docs/registry/ui/* 폴더에서 Snippet 레이어를 참고할 수 있습니다. (Alert Dialog 예시)
- Example, Installation 이후 Usage 섹션을 작성합니다.
