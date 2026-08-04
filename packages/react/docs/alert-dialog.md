file: components/alert-dialog.mdx

# Alert Dialog

사용자의 확인이 반드시 필요한 경우 강력한 표현 및 경고 수단으로 활용하는 컴포넌트입니다.

사용 가능 버전: @seed-design/react@0.0.1, @seed-design/css@0.0.1

## Preview

```tsx
import { ResponsivePair } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogRoot,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "seed-design/ui/alert-dialog";

const AlertDialogSingle = () => {
  return (
    // You can set z-index dialog with "--layer-index" custom property. useful for stackflow integration.
    <AlertDialogRoot>
      <AlertDialogTrigger asChild>
        <ActionButton variant="neutralSolid">열기</ActionButton>
      </AlertDialogTrigger>
      <AlertDialogContent layerIndex={50}>
        <AlertDialogHeader>
          <AlertDialogTitle>주의</AlertDialogTitle>
          <AlertDialogDescription>이 작업은 되돌릴 수 없습니다.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <ResponsivePair gap="x2">
            <AlertDialogAction variant="neutralWeak">취소</AlertDialogAction>
            <AlertDialogAction variant="neutralSolid">확인</AlertDialogAction>
          </ResponsivePair>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogRoot>
  );
};

export default AlertDialogSingle;
```

<Card title="Stackflow" href="/react/stackflow/alert-dialog" variant="example">
  Stackflow와 Alert Dialog를 함께 사용하는 방법에 대해 알아보세요.
</Card>

## Installation \[#installation]

- npm: npx @seed-design/cli@latest add ui:alert-dialog
- pnpm: pnpm dlx @seed-design/cli@latest add ui:alert-dialog
- yarn: yarn dlx @seed-design/cli@latest add ui:alert-dialog
- bun: bun x @seed-design/cli@latest add ui:alert-dialog

<ManualInstallation name="alert-dialog" />

## Props \[#props]

### `AlertDialogRoot` \[#alertdialogroot]

- `role`
  - type: `"dialog" | "alertdialog" | undefined`
  - default: `"alertdialog"`
  - description: The role of the dialog.
- `closeOnInteractOutside`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether to close the dialog when the outside is clicked
- `lazyMount`
  - type: `boolean | undefined`
  - default: `true`
  - description: Whether to enable lazy mounting
- `unmountOnExit`
  - type: `boolean | undefined`
  - default: `true`
  - description: Whether to unmount on exit.
- `skipAnimation`
  - type: `boolean | undefined`
  - default: `false`
- `children`
  - type: `React.ReactNode`
  - required: `true`
- `modal`
  - type: `boolean | undefined`
  - default: `true`
  - description: Whether the dialog should behave as a modal overlay. When true, focus is trapped, background content is hidden from assistive technology, and \`aria-modal\` is set. Set to \`false\` to temporarily suspend modal behavior (e.g., when a Stackflow Activity is pushed on top of a mounted dialog).
- `closeOnEscape`
  - type: `boolean | undefined`
  - default: `true`
  - description: Whether to close the dialog when the escape key is pressed
- `open`
  - type: `boolean | undefined`
- `defaultOpen`
  - type: `boolean | undefined`
- `onOpenChange`
  - type: `((open: boolean, details?: DialogChangeDetails) => void) | undefined`

### `AlertDialogTrigger` \[#alertdialogtrigger]

- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.

### `AlertDialogContent` \[#alertdialogcontent]

- `layerIndex`
  - type: `number | undefined`
- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.

### `AlertDialogHeader` \[#alertdialogheader]

- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.

### `AlertDialogTitle` \[#alertdialogtitle]

- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.

### `AlertDialogDescription` \[#alertdialogdescription]

- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.

### `AlertDialogFooter` \[#alertdialogfooter]

- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.

## Examples \[#examples]

### Trigger \[#trigger]

`<AlertDialogTrigger>`는 `aria-haspopup="dialog"` 속성을 설정하고, AlertDialog의 `open` 상태에 따라 `aria-expanded` 속성을 자동으로 설정합니다. 이 속성은 스크린 리더와 같은 보조 기술에 유용합니다.

## Preview

```tsx
import { ResponsivePair } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogRoot,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "seed-design/ui/alert-dialog";

const AlertDialogSingle = () => {
  return (
    // You can set z-index dialog with "--layer-index" custom property. useful for stackflow integration.
    <AlertDialogRoot>
      <AlertDialogTrigger asChild>
        <ActionButton variant="neutralSolid">열기</ActionButton>
      </AlertDialogTrigger>
      <AlertDialogContent layerIndex={50}>
        <AlertDialogHeader>
          <AlertDialogTitle>주의</AlertDialogTitle>
          <AlertDialogDescription>이 작업은 되돌릴 수 없습니다.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <ResponsivePair gap="x2">
            <AlertDialogAction variant="neutralWeak">취소</AlertDialogAction>
            <AlertDialogAction variant="neutralSolid">확인</AlertDialogAction>
          </ResponsivePair>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogRoot>
  );
};

export default AlertDialogSingle;
```

### Responsive Wrapping \[#responsive-wrapping]

`<ResponsivePair>` 컴포넌트를 사용해 버튼 컨텐츠가 길어지는 경우 레이아웃을 세로로 접을 수 있습니다.

```tsx
import { PrefixIcon, ResponsivePair } from "@seed-design/react";
import { IconCheckFill } from "@seed-design/react-icon";
import { ActionButton } from "seed-design/ui/action-button";
import {
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogRoot,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "seed-design/ui/alert-dialog";

const AlertDialogWrap = () => {
  return (
    // You can set z-index dialog with "--layer-index" custom property. useful for stackflow integration.
    <AlertDialogRoot>
      <AlertDialogTrigger asChild>
        <ActionButton variant="neutralSolid">열기</ActionButton>
      </AlertDialogTrigger>
      <AlertDialogContent layerIndex={50}>
        <AlertDialogHeader>
          <AlertDialogTitle>Wrapping</AlertDialogTitle>
          <AlertDialogDescription>
            ResponsivePair 컴포넌트를 사용해 버튼 컨텐츠가 길어지는 경우 레이아웃을 세로로 접을 수
            있습니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <ResponsivePair gap="x2">
            <AlertDialogAction variant="neutralWeak">취소</AlertDialogAction>
            <AlertDialogAction variant="neutralSolid">
              <PrefixIcon svg={<IconCheckFill />} />긴 레이블 예시
            </AlertDialogAction>
          </ResponsivePair>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogRoot>
  );
};

export default AlertDialogWrap;
```

### Single Action \[#single-action]

```tsx
import { ActionButton } from "seed-design/ui/action-button";
import {
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogRoot,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "seed-design/ui/alert-dialog";

const AlertDialogSingle = () => {
  // You can set z-index dialog with "--layer-index" custom property. useful for stackflow integration.
  return (
    <AlertDialogRoot>
      <AlertDialogTrigger asChild>
        <ActionButton variant="neutralSolid">열기</ActionButton>
      </AlertDialogTrigger>
      <AlertDialogContent layerIndex={50}>
        <AlertDialogHeader>
          <AlertDialogTitle>제목</AlertDialogTitle>
          <AlertDialogDescription>단일 선택지를 제공합니다.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction variant="neutralSolid">확인</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogRoot>
  );
};

export default AlertDialogSingle;
```

### Neutral Secondary Action \[#neutral-secondary-action]

```tsx
import { ResponsivePair } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogRoot,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "seed-design/ui/alert-dialog";

const AlertDialogNeutral = () => {
  return (
    // You can set z-index dialog with "--layer-index" custom property. useful for stackflow integration.
    <AlertDialogRoot>
      <AlertDialogTrigger asChild>
        <ActionButton variant="neutralSolid">열기</ActionButton>
      </AlertDialogTrigger>
      <AlertDialogContent layerIndex={50}>
        <AlertDialogHeader>
          <AlertDialogTitle>제목</AlertDialogTitle>
          <AlertDialogDescription>중립적인 선택지를 제공합니다.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {/* ResponsivePair component wraps layout if button content is too long. */}
          <ResponsivePair gap="x2">
            <AlertDialogAction variant="neutralWeak">취소</AlertDialogAction>
            <AlertDialogAction variant="neutralSolid">확인</AlertDialogAction>
          </ResponsivePair>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogRoot>
  );
};

export default AlertDialogNeutral;
```

### Nonpreferred \[#nonpreferred]

```tsx
import { VStack } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogRoot,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "seed-design/ui/alert-dialog";

const AlertDialogNonpreferred = () => {
  return (
    // You can set z-index dialog with "--layer-index" custom property. useful for stackflow integration.
    <AlertDialogRoot>
      <AlertDialogTrigger asChild>
        <ActionButton variant="neutralSolid">열기</ActionButton>
      </AlertDialogTrigger>
      <AlertDialogContent layerIndex={50}>
        <AlertDialogHeader>
          <AlertDialogTitle>제목</AlertDialogTitle>
          <AlertDialogDescription>중립적인 선택지를 제공합니다.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <VStack gap="x4" alignSelf="stretch">
            <AlertDialogAction size="medium" variant="neutralSolid" layout="withText">
              라벨
            </AlertDialogAction>
            <AlertDialogAction
              size="medium"
              variant="ghost"
              layout="withText"
              color="fg.neutralMuted"
              fontWeight="bold"
              bleedY="asPadding"
            >
              라벨
            </AlertDialogAction>
          </VStack>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogRoot>
  );
};

export default AlertDialogNonpreferred;
```

### Critical Action \[#critical-action]

```tsx
import { ResponsivePair } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogRoot,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "seed-design/ui/alert-dialog";

const AlertDialogCritical = () => {
  return (
    // You can set z-index dialog with "--layer-index" custom property. useful for stackflow integration.
    <AlertDialogRoot>
      <AlertDialogTrigger asChild>
        <ActionButton variant="neutralSolid">열기</ActionButton>
      </AlertDialogTrigger>
      <AlertDialogContent layerIndex={50}>
        <AlertDialogHeader>
          <AlertDialogTitle>제목</AlertDialogTitle>
          <AlertDialogDescription>파괴적, 비가역적 작업을 경고합니다.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {/* ResponsivePair component wraps layout if button content is too long. */}
          <ResponsivePair gap="x2">
            <AlertDialogAction variant="neutralWeak">취소</AlertDialogAction>
            <AlertDialogAction variant="criticalSolid">확인</AlertDialogAction>
          </ResponsivePair>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogRoot>
  );
};

export default AlertDialogCritical;
```

### Controlled \[#controlled]

Trigger 외의 방식으로 AlertDialog를 열고 닫을 수 있습니다. 이 경우 `open` prop을 사용하여 AlertDialog의 상태를 제어합니다.

```tsx
import { ResponsivePair } from "@seed-design/react";
import { useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogRoot,
  AlertDialogTitle,
} from "seed-design/ui/alert-dialog";

const AlertDialogControlled = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <ActionButton variant="neutralSolid" onClick={() => setOpen(true)}>
        열기
      </ActionButton>
      <AlertDialogRoot open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>주의</AlertDialogTitle>
            <AlertDialogDescription>이 작업은 되돌릴 수 없습니다.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <ResponsivePair gap="x2">
              <AlertDialogAction variant="neutralWeak" onClick={() => setOpen(false)}>
                취소
              </AlertDialogAction>
              <AlertDialogAction variant="neutralSolid" onClick={() => setOpen(false)}>
                확인
              </AlertDialogAction>
            </ResponsivePair>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogRoot>
    </>
  );
};

export default AlertDialogControlled;
```

### Prevent Close \[#prevent-close]

`AlertDialogAction`의 `onClick`에서 `e.preventDefault()`를 호출하면 다이얼로그가 닫히지 않습니다.

```tsx
import { Box, VStack } from "@seed-design/react";
import { useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogRoot,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "seed-design/ui/alert-dialog";
import { Switch } from "seed-design/ui/switch";

export default function AlertDialogPreventClose() {
  const [preventClose, setPreventClose] = useState(true);

  return (
    <AlertDialogRoot>
      <AlertDialogTrigger asChild>
        <ActionButton variant="neutralSolid">열기</ActionButton>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>닫기 방지</AlertDialogTitle>
          <AlertDialogDescription>
            확인 버튼을 눌러도 다이얼로그가 닫히지 않도록 설정할 수 있습니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter asChild>
          <VStack gap="x4">
            <Box alignSelf="flex-start">
              <Switch
                size="16"
                tone="neutral"
                label="preventDefault 사용"
                checked={preventClose}
                onCheckedChange={setPreventClose}
              />
            </Box>
            <AlertDialogAction
              variant="neutralSolid"
              onClick={(e) => {
                if (preventClose) {
                  e.preventDefault();
                }
              }}
            >
              확인
            </AlertDialogAction>
          </VStack>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogRoot>
  );
}
```

### `onOpenChange` Details \[#onopenchange-details]

`onOpenChange` 두 번째 인자로 `details`가 제공됩니다.

#### `reason` \[#reason]

**열릴 때** (`open: true`)

- `"trigger"`: `AlertDialogTrigger` (`Dialog.Trigger`)로 열림

**닫힐 때** (`open: false`)

- `"closeButton"`: `AlertDialogAction`으로 닫힘
- `"escapeKeyDown"`: <kbd>ESC</kbd> 키 사용
- `"interactOutside"`: 외부 영역 클릭
  - `AlertDialogRoot`는 기본적으로 `closeOnInteractOutside={false}`입니다. `interactOutside`는 이 옵션을 `true`로 설정한 경우에만 발생할 수 있습니다.
- `"cascadeDismiss"`: 상위 레이어 닫힘으로 인한 연쇄 닫힘

```tsx
import { HStack, ResponsivePair, Text, VStack } from "@seed-design/react";
import { useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogRoot,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "seed-design/ui/alert-dialog";

export default function AlertDialogOnOpenChangeReason() {
  const [open, setOpen] = useState(false);
  const [openReason, setOpenReason] = useState<string | null>(null);
  const [closeReason, setCloseReason] = useState<string | null>(null);

  return (
    <VStack gap="x4" align="center">
      <AlertDialogRoot
        open={open}
        onOpenChange={(open, details) => {
          setOpen(open);

          (open ? setOpenReason : setCloseReason)(details?.reason ?? null);
        }}
      >
        <AlertDialogTrigger asChild>
          <ActionButton variant="neutralSolid">열기</ActionButton>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>알림</AlertDialogTitle>
            <AlertDialogDescription>
              ESC 키를 누르거나 버튼을 클릭하여 닫아보세요.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <ResponsivePair gap="x2">
              <AlertDialogAction variant="neutralWeak">취소</AlertDialogAction>
              <AlertDialogAction variant="neutralSolid">확인</AlertDialogAction>
            </ResponsivePair>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogRoot>

      <HStack gap="x4">
        <Text fontSize="t3" color="fg.neutralMuted">
          마지막 열림 이유: {openReason ?? "-"}
        </Text>
        <Text fontSize="t3" color="fg.neutralMuted">
          마지막 닫힘 이유: {closeReason ?? "-"}
        </Text>
      </HStack>
    </VStack>
  );
}
```

### Portalled \[#portalled]

Portal은 기본적으로 `document.body`에 렌더링됩니다.

```tsx
import { ResponsivePair, Portal } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogRoot,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "seed-design/ui/alert-dialog";

const AlertDialogPortalled = () => {
  return (
    // You can set z-index dialog with "--layer-index" custom property. useful for stackflow integration.
    <AlertDialogRoot>
      <AlertDialogTrigger asChild>
        <ActionButton variant="neutralSolid">열기</ActionButton>
      </AlertDialogTrigger>
      <Portal>
        <AlertDialogContent layerIndex={50}>
          <AlertDialogHeader>
            <AlertDialogTitle>주의</AlertDialogTitle>
            <AlertDialogDescription>이 작업은 되돌릴 수 없습니다.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <ResponsivePair gap="x2">
              <AlertDialogAction variant="neutralWeak">취소</AlertDialogAction>
              <AlertDialogAction variant="neutralSolid">확인</AlertDialogAction>
            </ResponsivePair>
          </AlertDialogFooter>
        </AlertDialogContent>
      </Portal>
    </AlertDialogRoot>
  );
};

export default AlertDialogPortalled;
```

### Skip Animation \[#skip-animation]

`skipAnimation` prop을 사용하여 AlertDialog의 enter/exit 애니메이션을 건너뛸 수 있습니다.

```tsx
import { ResponsivePair } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogRoot,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "seed-design/ui/alert-dialog";

const AlertDialogSkipAnimation = () => {
  return (
    <AlertDialogRoot skipAnimation>
      <AlertDialogTrigger asChild>
        <ActionButton variant="neutralSolid">열기</ActionButton>
      </AlertDialogTrigger>
      <AlertDialogContent layerIndex={50}>
        <AlertDialogHeader>
          <AlertDialogTitle>주의</AlertDialogTitle>
          <AlertDialogDescription>이 작업은 되돌릴 수 없습니다.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <ResponsivePair gap="x2">
            <AlertDialogAction variant="neutralWeak">취소</AlertDialogAction>
            <AlertDialogAction variant="neutralSolid">확인</AlertDialogAction>
          </ResponsivePair>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogRoot>
  );
};

export default AlertDialogSkipAnimation;
```

### Stackflow \[#stackflow]

<StackflowExample path="/alert-dialog-stackflow">
  ```tsx
  import { useActivityZIndexBase } from "@seed-design/stackflow";
  import { type StaticActivityComponentType, useFlow } from "@stackflow/react/future";
  import {
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogRoot,
    AlertDialogTitle,
  } from "seed-design/ui/alert-dialog";

  declare module "@stackflow/config" {
    interface Register {
      ActivityAlertDialogStackflow: {};
    }
  }

  const ActivityAlertDialogStackflow: StaticActivityComponentType<
    "ActivityAlertDialogStackflow"
  > = () => {
    const { pop } = useFlow();

    return (
      <AlertDialogRoot defaultOpen onOpenChange={(open) => !open && pop()}>
        <AlertDialogContent layerIndex={useActivityZIndexBase()}>
          <AlertDialogHeader>
            <AlertDialogTitle>제목</AlertDialogTitle>
            <AlertDialogDescription>Stackflow</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction variant="neutralSolid">확인</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogRoot>
    );
  };

  export default ActivityAlertDialogStackflow;
  ```
</StackflowExample>