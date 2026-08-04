file: components/bottom-sheet.mdx

# Bottom Sheet

화면 하단에서 올라오는 모달 컴포넌트입니다. 추가 정보나 액션 목록을 제공하면서도 현재 컨텍스트를 유지할 때 사용됩니다.

사용 가능 버전: @seed-design/react@0.0.1, @seed-design/css@0.0.1

## Preview

```tsx
import { ActionButton } from "seed-design/ui/action-button";
import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
  BottomSheetTrigger,
} from "seed-design/ui/bottom-sheet";

const BottomSheetPreview = () => {
  return (
    <BottomSheetRoot>
      <BottomSheetTrigger asChild>
        <ActionButton variant="neutralSolid">Open</ActionButton>
      </BottomSheetTrigger>
      <BottomSheetContent title="제목" description="설명을 작성할 수 있어요">
        {/* If you need to omit padding, pass px={0}. */}
        <BottomSheetBody>Content</BottomSheetBody>
        <BottomSheetFooter>
          <ActionButton variant="neutralSolid">확인</ActionButton>
        </BottomSheetFooter>
      </BottomSheetContent>
    </BottomSheetRoot>
  );
};

export default BottomSheetPreview;
```

<Card title="Stackflow" href="/react/stackflow/bottom-sheet" variant="example">
  Stackflow와 Bottom Sheet를 함께 사용하는 방법에 대해 알아보세요.
</Card>

## Installation \[#installation]

- npm: npx @seed-design/cli@latest add ui:bottom-sheet
- pnpm: pnpm dlx @seed-design/cli@latest add ui:bottom-sheet
- yarn: yarn dlx @seed-design/cli@latest add ui:bottom-sheet
- bun: bun x @seed-design/cli@latest add ui:bottom-sheet

<ManualInstallation name="bottom-sheet" />

## Props \[#props]

### `BottomSheetRoot` \[#bottomsheetroot]

- `headerAlign`
  - type: `"left" | "center" | undefined`
  - default: `"left"`
- `skipAnimation`
  - type: `boolean | undefined`
  - default: `false`
- `children`
  - type: `React.ReactNode`
- `activeSnapPoint`
  - type: `string | number | null | undefined`
- `setActiveSnapPoint`
  - type: `((snapPoint: number | string | null) => void) | undefined`
- `open`
  - type: `boolean | undefined`
- `closeThreshold`
  - type: `number | undefined`
  - default: `0.25`
  - description: Number between 0 and 1 that determines when the drawer should be closed. Example: threshold of 0.5 would close the drawer if the user swiped for 50% of the height of the drawer or more.
- `onOpenChange`
  - type: `((open: boolean, details?: DrawerChangeDetails) => void) | undefined`
- `scrollLockTimeout`
  - type: `number | undefined`
  - default: `500ms`
  - description: Duration for which the drawer is not draggable after scrolling content inside of the drawer.
- `fixed`
  - type: `boolean | undefined`
  - description: When \`true\`, don't move the drawer upwards if there's space, but rather only change it's height so it's fully scrollable when the keyboard is open
- `handleOnly`
  - type: `boolean | undefined`
  - default: `false`
  - description: When \`true\` only allows the drawer to be dragged by the \`\<Drawer.Handle />\` component.
- `dismissible`
  - type: `boolean | undefined`
  - default: `true`
  - description: When \`false\` dragging, clicking outside, pressing esc, etc. will not close the drawer. Use this in combination with the \`open\` prop, otherwise you won't be able to open/close the drawer.
- `onDrag`
  - type: `((event: React.PointerEvent<HTMLDivElement>, percentageDragged: number) => void) | undefined`
- `onRelease`
  - type: `((event: React.PointerEvent<HTMLDivElement>, open: boolean) => void) | undefined`
- `modal`
  - type: `boolean | undefined`
  - default: `true`
  - description: When \`false\` it allows to interact with elements outside of the drawer without closing it.
- `nested`
  - type: `boolean | undefined`
- `onClose`
  - type: `(() => void) | undefined`
- `defaultOpen`
  - type: `boolean | undefined`
  - default: `false`
  - description: Opened by default. Still reacts to \`open\` state changes
- `repositionInputs`
  - type: `boolean | undefined`
  - default: `true when {@link snapPoints} is defined`
  - description: When \`true\` Vaul will reposition inputs rather than scroll then into view if the keyboard is in the way. Setting it to \`false\` will fall back to the default browser behavior.
- `snapToSequentialPoint`
  - type: `boolean | undefined`
  - default: `false`
  - description: Disabled velocity based swiping for snap points. This means that a snap point won't be skipped even if the velocity is high enough. Useful if each snap point in a drawer is equally important.
- `container`
  - type: `HTMLElement | null | undefined`
- `onAnimationEnd`
  - type: `((open: boolean) => void) | undefined`
  - description: Gets triggered after the open or close animation ends, it receives an \`open\` argument with the \`open\` state of the drawer by the time the function was triggered. Useful to revert any state changes for example.
- `autoFocus`
  - type: `boolean | undefined`
- `snapPoints`
  - type: `(string | number)[] | undefined`
  - default: `undefined`
  - description: Array of snap points to use. Example: snapPoints=\{\["100px", "200px", 1]} will use the snap points 100px, 200px and fully open (1 = 100% of the container).
- `fadeFromIndex`
  - type: `number | undefined`
  - default: `snapPoints.length - 1`
  - description: Index of the snap point to start fading from. Example: fadeFromIndex=\{0} will start fading from the first snap point.
- `closeOnInteractOutside`
  - type: `boolean | undefined`
  - default: `true`
  - description: Whether to close the drawer when interacting outside of the drawer.
- `closeOnEscape`
  - type: `boolean | undefined`
  - default: `true`
  - description: Whether to close the drawer when pressing the escape key.
- `lazyMount`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether to lazy mount the drawer content on first open.
- `unmountOnExit`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether to unmount the drawer content on exit.

### `BottomSheetTrigger` \[#bottomsheettrigger]

- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.

### `BottomSheetContent` \[#bottomsheetcontent]

- `title`
  - type: `React.ReactNode`
- `description`
  - type: `React.ReactNode`
- `layerIndex`
  - type: `number | undefined`
- `showCloseButton`
  - type: `boolean | undefined`
  - default: `true`
- `showHandle`
  - type: `boolean | undefined`
  - default: `false`
- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.

### `BottomSheetBody` \[#bottomsheetbody]

- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.
- `paddingX`
  - type: `ResponsiveValue<0 | (string & {}) | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText"> | undefined`
- `height`
  - type: `ResponsiveValue<(string & {}) | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | "full"> | undefined`
- `maxHeight`
  - type: `ResponsiveValue<(string & {}) | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | "full"> | undefined`
- `minHeight`
  - type: `ResponsiveValue<(string & {}) | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | "full"> | undefined`
- `justifyContent`
  - type: `"center" | "flex-start" | "flex-end" | "space-between" | "space-around" | undefined`
- `alignItems`
  - type: `"center" | "flex-start" | "flex-end" | "stretch" | undefined`

### `BottomSheetFooter` \[#bottomsheetfooter]

- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.

## Examples \[#examples]

### Trigger \[#trigger]

`<BottomSheetTrigger>`는 `asChild` 패턴을 사용해 자식 요소가 BottomSheet를 열 수 있도록 합니다.

`<BottomSheetTrigger>`는 `aria-haspopup="dialog"` 속성을 설정하고, `BottomSheet`의 `open` 상태에 따라 `aria-expanded` 속성을 자동으로 설정합니다. 이 속성은 스크린 리더와 같은 보조 기술에 유용합니다.

```tsx
import { ActionButton } from "seed-design/ui/action-button";
import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
  BottomSheetTrigger,
} from "seed-design/ui/bottom-sheet";

const BottomSheetTriggerExample = () => {
  return (
    <BottomSheetRoot>
      <BottomSheetTrigger asChild>
        <ActionButton variant="neutralSolid">Open</ActionButton>
      </BottomSheetTrigger>
      <BottomSheetContent title="제목">
        <BottomSheetBody minHeight="x16">Content</BottomSheetBody>
        <BottomSheetFooter>
          <ActionButton variant="neutralSolid">확인</ActionButton>
        </BottomSheetFooter>
      </BottomSheetContent>
    </BottomSheetRoot>
  );
};

export default BottomSheetTriggerExample;
```

### Controlled \[#controlled]

Trigger 외의 방식으로 BottomSheet를 열고 닫을 수 있습니다. 이 경우 `open` prop을 사용하여 BottomSheet의 상태를 제어합니다.

```tsx
import { useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
} from "seed-design/ui/bottom-sheet";

const BottomSheetControlled = () => {
  const [open, setOpen] = useState(false);

  const scheduleOpen = () => {
    setTimeout(() => {
      setOpen(true);
    }, 1000);
  };

  return (
    <>
      <ActionButton variant="neutralSolid" onClick={scheduleOpen}>
        1초 후 열기
      </ActionButton>
      <BottomSheetRoot open={open} onOpenChange={setOpen}>
        <BottomSheetContent title="제목" description="설명을 작성할 수 있어요">
          {/* If you need to omit padding, pass px={0}. */}
          <BottomSheetBody minHeight="x16">Content</BottomSheetBody>
          <BottomSheetFooter>
            <ActionButton variant="neutralSolid">확인</ActionButton>
          </BottomSheetFooter>
        </BottomSheetContent>
      </BottomSheetRoot>
    </>
  );
};

export default BottomSheetControlled;
```

### `onOpenChange` Details \[#onopenchange-details]

`onOpenChange` 두 번째 인자로 `details`가 제공됩니다.

#### `reason` \[#reason]

**열릴 때** (`open: true`)

- `"trigger"`: `BottomSheetTrigger` (`BottomSheet.Trigger`)로 열림

**닫힐 때** (`open: false`)

- `"closeButton"`: `BottomSheet.CloseButton`으로 닫힘
- `"escapeKeyDown"`: <kbd>ESC</kbd> 키 사용
- `"interactOutside"`: 외부 영역 클릭
- `"drag"`: 드래그로 닫힘
- `"handleClickOnLastSnapPoint"`: 마지막 스냅 포인트에서 핸들 클릭으로 닫힘

```tsx
import { HStack, Text, VStack } from "@seed-design/react";
import { useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetRoot,
  BottomSheetTrigger,
} from "seed-design/ui/bottom-sheet";

const snapPoints = ["200px", "400px", 1];

export default function BottomSheetOnOpenChangeReason() {
  const [open, setOpen] = useState(false);
  const [snap, setSnap] = useState<number | string | null>(snapPoints[0]);
  const [openReason, setOpenReason] = useState<string | null>(null);
  const [closeReason, setCloseReason] = useState<string | null>(null);

  return (
    <VStack gap="x4" align="center">
      <BottomSheetRoot
        open={open}
        onOpenChange={(open, details) => {
          setOpen(open);

          (open ? setOpenReason : setCloseReason)(details?.reason ?? null);
        }}
        snapPoints={snapPoints}
        activeSnapPoint={snap}
        setActiveSnapPoint={setSnap}
      >
        <BottomSheetTrigger asChild>
          <ActionButton variant="neutralSolid">열기</ActionButton>
        </BottomSheetTrigger>
        <BottomSheetContent title="알림" showHandle style={{ height: "100%", maxHeight: "97%" }}>
          <BottomSheetBody minHeight="x16">
            <Text textStyle="t4Medium" color="fg.neutralMuted">
              ESC 키를 누르거나, 외부 영역을 클릭하거나, 아래로 스와이프하거나, 핸들을 탭하여 snap
              point를 순환해보세요.
            </Text>
          </BottomSheetBody>
        </BottomSheetContent>
      </BottomSheetRoot>

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

### Header Align \[#header-align]

`<BottomSheetRoot>`에 `headerAlign` prop을 설정하여 title과 description의 정렬을 설정할 수 있습니다.

```tsx
import { HStack } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
  BottomSheetTrigger,
} from "seed-design/ui/bottom-sheet";

const BottomSheetHeaderAlign = () => {
  return (
    <HStack gap="x4">
      <BottomSheetRoot headerAlign="left">
        <BottomSheetTrigger asChild>
          <ActionButton variant="neutralSolid">Left (기본값)</ActionButton>
        </BottomSheetTrigger>
        <BottomSheetContent title="제목" description="설명을 작성할 수 있어요">
          <BottomSheetBody>Content</BottomSheetBody>
          <BottomSheetFooter>
            <ActionButton variant="neutralSolid">확인</ActionButton>
          </BottomSheetFooter>
        </BottomSheetContent>
      </BottomSheetRoot>

      <BottomSheetRoot headerAlign="center">
        <BottomSheetTrigger asChild>
          <ActionButton variant="neutralSolid">Center</ActionButton>
        </BottomSheetTrigger>
        <BottomSheetContent title="제목" description="설명을 작성할 수 있어요">
          <BottomSheetBody>Content</BottomSheetBody>
          <BottomSheetFooter>
            <ActionButton variant="neutralSolid">확인</ActionButton>
          </BottomSheetFooter>
        </BottomSheetContent>
      </BottomSheetRoot>
    </HStack>
  );
};

export default BottomSheetHeaderAlign;
```

### Max Height \[#max-height]

`<BottomSheetBody>`에 `maxHeight` prop을 전달하여 BottomSheet의 최대 높이를 설정할 수 있습니다.

```tsx
import { Box, VStack } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
  BottomSheetTrigger,
} from "seed-design/ui/bottom-sheet";

const BottomSheetMaxHeight = () => {
  return (
    <BottomSheetRoot>
      <BottomSheetTrigger asChild>
        <ActionButton variant="neutralSolid">Open</ActionButton>
      </BottomSheetTrigger>
      <BottomSheetContent title="제목" description="설명을 작성할 수 있어요">
        {/* If you need to omit padding, pass px={0}. */}
        <BottomSheetBody>
          <VStack maxHeight="300px" overflowY="auto">
            <VStack justifyContent="center" alignItems="center" gap="x4" height="100%">
              <Box width="100%" height="100px" bg="bg.layerBasement" />
              <Box width="100%" height="100px" bg="bg.layerBasement" />
              <Box width="100%" height="100px" bg="bg.layerBasement" />
              <Box width="100%" height="100px" bg="bg.layerBasement" />
            </VStack>
          </VStack>
        </BottomSheetBody>
        <BottomSheetFooter>
          <ActionButton variant="neutralSolid">확인</ActionButton>
        </BottomSheetFooter>
      </BottomSheetContent>
    </BottomSheetRoot>
  );
};

export default BottomSheetMaxHeight;
```

### Snap Points \[#snap-points]

`snapPoints` prop을 사용하여 BottomSheet의 커스텀 스냅 포인트를 설정할 수 있습니다.

```tsx
import { useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
  BottomSheetTrigger,
} from "seed-design/ui/bottom-sheet";

const snapPoints = ["300px", "500px", 1];

const BottomSheetSnapPoints = () => {
  const [snap, setSnap] = useState<number | string | null>(snapPoints[0]);

  return (
    <BottomSheetRoot snapPoints={snapPoints} activeSnapPoint={snap} setActiveSnapPoint={setSnap}>
      <BottomSheetTrigger asChild>
        <ActionButton variant="neutralSolid">Open</ActionButton>
      </BottomSheetTrigger>
      <BottomSheetContent
        title="제목"
        description="설명을 작성할 수 있어요"
        /**
         * snap points를 사용할 때는 handle을 표시해야 합니다.
         */
        showHandle
        /**
         * 높이를 100%로 설정해야 snap points가 제대로 작동합니다.
         */
        style={{ height: "100%", maxHeight: "97%" }}
      >
        <BottomSheetBody>Content</BottomSheetBody>
        <BottomSheetFooter>
          <ActionButton variant="neutralSolid">확인</ActionButton>
        </BottomSheetFooter>
      </BottomSheetContent>
    </BottomSheetRoot>
  );
};

export default BottomSheetSnapPoints;
```

### Fade From Index \[#fade-from-index]

`<BottomSheetRoot>`에 `fadeFromIndex` prop을 전달하여 뒷 배경이 어두워지는 시작 인덱스를 설정할 수 있습니다.

```tsx
import { useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
  BottomSheetTrigger,
} from "seed-design/ui/bottom-sheet";

const snapPoints = ["300px", "500px", 1];

const BottomSheetFadeFromIndex = () => {
  const [snap, setSnap] = useState<number | string | null>(snapPoints[0]);

  return (
    <BottomSheetRoot
      fadeFromIndex={0}
      snapPoints={snapPoints}
      activeSnapPoint={snap}
      setActiveSnapPoint={setSnap}
    >
      <BottomSheetTrigger asChild>
        <ActionButton variant="neutralSolid">Open</ActionButton>
      </BottomSheetTrigger>
      <BottomSheetContent
        title="제목"
        description="설명을 작성할 수 있어요"
        /**
         * snap points를 사용할 때는 handle을 표시해야 합니다.
         */
        showHandle
        /**
         * 높이를 100%로 설정해야 snap points가 제대로 작동합니다.
         */
        style={{ height: "100%", maxHeight: "97%" }}
      >
        <BottomSheetBody>Content</BottomSheetBody>
        <BottomSheetFooter>
          <ActionButton variant="neutralSolid">확인</ActionButton>
        </BottomSheetFooter>
      </BottomSheetContent>
    </BottomSheetRoot>
  );
};

export default BottomSheetFadeFromIndex;
```

### Show Handle \[#show-handle]

`<BottomSheetContent>`에 `showHandle` prop을 전달하여 Handle을 표시할 수 있습니다.
기본 값은 `false`입니다.

```tsx
import { useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
  BottomSheetTrigger,
} from "seed-design/ui/bottom-sheet";

const BottomSheetShowHandle = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <BottomSheetRoot open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <BottomSheetTrigger asChild>
        <ActionButton variant="neutralSolid">Open</ActionButton>
      </BottomSheetTrigger>
      <BottomSheetContent title="제목" description="설명을 작성할 수 있어요" showHandle>
        {/* If you need to omit padding, pass px={0}. */}
        <BottomSheetBody minHeight="x16">Content</BottomSheetBody>
        <BottomSheetFooter>
          <ActionButton variant="neutralSolid" onClick={() => setIsSheetOpen(false)}>
            닫기
          </ActionButton>
        </BottomSheetFooter>
      </BottomSheetContent>
    </BottomSheetRoot>
  );
};

export default BottomSheetShowHandle;
```

### Show Close Button \[#show-close-button]

`<BottomSheetContent>`에 `showCloseButton` prop을 전달하여 닫기 버튼을 표시할 수 있습니다.
기본 값은 `true`입니다.

showCloseButton을 `false`로 설정하면 닫기 버튼이 표시되지 않습니다.
이 경우 유저가 BottomSheet를 닫을 수 있는 방법을 제공해야 합니다.

```tsx
import { useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
  BottomSheetTrigger,
} from "seed-design/ui/bottom-sheet";

const BottomSheetShowCloseButton = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <BottomSheetRoot open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <BottomSheetTrigger asChild>
        <ActionButton variant="neutralSolid">Open</ActionButton>
      </BottomSheetTrigger>
      <BottomSheetContent
        title="제목"
        description="설명을 작성할 수 있어요"
        showCloseButton={false}
      >
        {/* If you need to omit padding, pass px={0}. */}
        <BottomSheetBody minHeight="x16">Content</BottomSheetBody>
        <BottomSheetFooter>
          <ActionButton variant="neutralSolid" onClick={() => setIsSheetOpen(false)}>
            닫기
          </ActionButton>
        </BottomSheetFooter>
      </BottomSheetContent>
    </BottomSheetRoot>
  );
};

export default BottomSheetShowCloseButton;
```

### Dismissible \[#dismissible]

`dismissible` prop을 `false`로 설정하면 closeOnEscape, closeOnInteractOutside, draggable 기능이 비활성화됩니다.
의도적으로 BottomSheet를 닫을 수 없게 하고 싶을 때 사용합니다. 이외에는 유저가 BottomSheet를 닫을 수 있는 방법을 제공해야 합니다.

```tsx
import { useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
  BottomSheetTrigger,
} from "seed-design/ui/bottom-sheet";

const BottomSheetDismissible = () => {
  const [open, setOpen] = useState(false);

  return (
    <BottomSheetRoot open={open} onOpenChange={setOpen} dismissible={false}>
      <BottomSheetTrigger asChild>
        <ActionButton variant="neutralSolid">Open</ActionButton>
      </BottomSheetTrigger>
      <BottomSheetContent title="제목" description="설명을 작성할 수 있어요">
        {/* If you need to omit padding, pass px={0}. */}
        <BottomSheetBody>Content</BottomSheetBody>
        <BottomSheetFooter>
          <ActionButton variant="neutralSolid" onClick={() => setOpen(false)}>
            닫기
          </ActionButton>
        </BottomSheetFooter>
      </BottomSheetContent>
    </BottomSheetRoot>
  );
};

export default BottomSheetDismissible;
```

### With Scroll Fog \[#with-scroll-fog]

`<BottomSheetBody>`에 [Scroll Fog](/react/components/scroll-fog)를 사용하여 스크롤 힌트 효과를 적용할 수 있습니다.

ScrollFog는 항상 효과를 표시하므로, 충분한 padding을 제공해야 합니다.
권장 padding인 하단 `80px`, 상단 `20px`을 유지해야 합니다.

```tsx
import { Box, ScrollFog, VStack } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
  BottomSheetTrigger,
} from "seed-design/ui/bottom-sheet";

const BottomSheetMaxHeight = () => {
  return (
    <BottomSheetRoot>
      <BottomSheetTrigger asChild>
        <ActionButton variant="neutralSolid">Open</ActionButton>
      </BottomSheetTrigger>
      <BottomSheetContent title="제목" description="설명을 작성할 수 있어요">
        {/* If you need to omit padding, pass px={0}. */}
        <BottomSheetBody>
          <VStack maxHeight="300px" overflowY="auto">
            <ScrollFog placement={["top", "bottom"]}>
              <VStack
                justifyContent="center"
                alignItems="center"
                gap="x4"
                height="100%"
                pb="80px"
                pt="20px"
              >
                <Box width="100%" height="100px" bg="bg.layerBasement" />
                <Box width="100%" height="100px" bg="bg.layerBasement" />
                <Box width="100%" height="100px" bg="bg.layerBasement" />
                <Box width="100%" height="100px" bg="bg.layerBasement" />
              </VStack>
            </ScrollFog>
          </VStack>
        </BottomSheetBody>
        <BottomSheetFooter>
          <ActionButton variant="neutralSolid">확인</ActionButton>
        </BottomSheetFooter>
      </BottomSheetContent>
    </BottomSheetRoot>
  );
};

export default BottomSheetMaxHeight;
```

### Bottom Inset \[#bottom-inset]

`<BottomSheetContent>`에 `style` prop을 전달하여 아래 여백을 주기 위해 사용합니다.

```tsx
import { ActionButton } from "seed-design/ui/action-button";
import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
  BottomSheetTrigger,
} from "seed-design/ui/bottom-sheet";

const BottomSheetBottomInset = () => {
  return (
    <BottomSheetRoot>
      <BottomSheetTrigger asChild>
        <ActionButton variant="neutralSolid">Open</ActionButton>
      </BottomSheetTrigger>
      <BottomSheetContent
        title="제목"
        description="설명을 작성할 수 있어요"
        // 모바일 브라우저에서 아래 여백을 주기 위해 사용
        style={{ paddingBottom: "var(--seed-safe-area-bottom)" }}
      >
        {/* If you need to omit padding, pass px={0}. */}
        <BottomSheetBody minHeight="x16">Content</BottomSheetBody>
        <BottomSheetFooter>
          <ActionButton variant="neutralSolid">확인</ActionButton>
        </BottomSheetFooter>
      </BottomSheetContent>
    </BottomSheetRoot>
  );
};

export default BottomSheetBottomInset;
```

### Handle Only \[#handle-only]

`<BottomSheetRoot>`에 `handleOnly` prop을 제공하는 경우 쓸어서(swipe) Bottom Sheet를 움직일 수 있는 영역이 핸들 부분으로 제한됩니다.

이 옵션은 `<BottomSheetContent showHandle={true}>`와 함께 사용할 때만 작동합니다.

```tsx
import { ActionButton } from "seed-design/ui/action-button";
import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
  BottomSheetTrigger,
} from "seed-design/ui/bottom-sheet";

const BottomSheetHandleOnly = () => {
  return (
    <BottomSheetRoot handleOnly>
      <BottomSheetTrigger asChild>
        <ActionButton variant="neutralSolid">Open</ActionButton>
      </BottomSheetTrigger>
      <BottomSheetContent showHandle title="제목" description="설명을 작성할 수 있어요">
        <BottomSheetBody>Content</BottomSheetBody>
        <BottomSheetFooter>
          <ActionButton variant="neutralSolid">확인</ActionButton>
        </BottomSheetFooter>
      </BottomSheetContent>
    </BottomSheetRoot>
  );
};

export default BottomSheetHandleOnly;
```

### Skip Animation \[#skip-animation]

`skipAnimation` prop을 사용하여 BottomSheet의 enter/exit 애니메이션을 건너뛸 수 있습니다.

```tsx
import { ActionButton } from "seed-design/ui/action-button";
import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
  BottomSheetTrigger,
} from "seed-design/ui/bottom-sheet";

const BottomSheetSkipAnimation = () => {
  return (
    <BottomSheetRoot skipAnimation>
      <BottomSheetTrigger asChild>
        <ActionButton variant="neutralSolid">Open</ActionButton>
      </BottomSheetTrigger>
      <BottomSheetContent title="제목" description="설명을 작성할 수 있어요">
        <BottomSheetBody>Content</BottomSheetBody>
        <BottomSheetFooter>
          <ActionButton variant="neutralSolid">확인</ActionButton>
        </BottomSheetFooter>
      </BottomSheetContent>
    </BottomSheetRoot>
  );
};

export default BottomSheetSkipAnimation;
```