file: components/side-panel.mdx

# Side Panel

화면 좌측 또는 우측 가장자리에서 슬라이드하여 나타나는 패널 컴포넌트입니다. 데스크탑 환경에서 추가 콘텐츠나 네비게이션을 제공할 때 사용됩니다.

사용 가능 버전: @seed-design/react@2.0.0, @seed-design/css@2.0.0

## Preview

```tsx
import { ActionButton } from "seed-design/ui/action-button";
import {
  SidePanelBody,
  SidePanelContent,
  SidePanelFooter,
  SidePanelRoot,
  SidePanelTrigger,
} from "seed-design/ui/side-panel";

const SidePanelPreview = () => {
  return (
    <SidePanelRoot>
      <SidePanelTrigger asChild>
        <ActionButton variant="neutralSolid">Open Side Panel</ActionButton>
      </SidePanelTrigger>
      <SidePanelContent title="제목" description="설명을 작성할 수 있어요">
        <SidePanelBody paddingX="x6">
          패널 본문에는 사용자가 확인해야 할 내용이나 추가 입력 폼을 배치할 수 있습니다.
        </SidePanelBody>
        <SidePanelFooter>
          <ActionButton variant="neutralSolid">확인</ActionButton>
        </SidePanelFooter>
      </SidePanelContent>
    </SidePanelRoot>
  );
};

export default SidePanelPreview;
```

## Installation \[#installation]

### Default \[#default]

좌/우 가장자리에서 슬라이드되는 기본 Side Panel 컴포넌트를 포함합니다.

- npm: npx @seed-design/cli@latest add ui:side-panel
- pnpm: pnpm dlx @seed-design/cli@latest add ui:side-panel
- yarn: yarn dlx @seed-design/cli@latest add ui:side-panel
- bun: bun x @seed-design/cli@latest add ui:side-panel

<ManualInstallation name="side-panel" />

### Responsive \[#responsive]

뷰포트에 따라 Bottom Sheet로 자동 전환되는 반응형 변형입니다. dependency로 `ui:bottom-sheet`와 `ui:side-panel`이 함께 설치됩니다.

- npm: npx @seed-design/cli@latest add ui:responsive-side-panel
- pnpm: pnpm dlx @seed-design/cli@latest add ui:responsive-side-panel
- yarn: yarn dlx @seed-design/cli@latest add ui:responsive-side-panel
- bun: bun x @seed-design/cli@latest add ui:responsive-side-panel

<ManualInstallation name="responsive-side-panel" />

## Props \[#props]

### `SidePanelRoot` \[#sidepanelroot]

- `direction`
  - type: `"left" | "right" | undefined`
  - default: `"right"`
  - description: Direction the side panel slides in from.
- `size`
  - type: `"small" | "medium" | "large" | undefined`
  - default: `"medium"`
- `children`
  - type: `React.ReactNode`
- `open`
  - type: `boolean | undefined`
- `defaultOpen`
  - type: `boolean | undefined`
  - default: `false`
  - description: Opened by default. Still reacts to \`open\` state changes
- `onOpenChange`
  - type: `((open: boolean, details?: DrawerChangeDetails) => void) | undefined`
- `modal`
  - type: `boolean | undefined`
  - default: `true`
  - description: When \`false\` it allows to interact with elements outside of the drawer without closing it.
- `dismissible`
  - type: `boolean | undefined`
  - default: `true`
  - description: When \`false\` dragging, clicking outside, pressing esc, etc. will not close the drawer. Use this in combination with the \`open\` prop, otherwise you won't be able to open/close the drawer.
- `closeOnEscape`
  - type: `boolean | undefined`
  - default: `true`
  - description: Whether to close the drawer when pressing the escape key.
- `closeOnInteractOutside`
  - type: `boolean | undefined`
  - default: `true`
  - description: Whether to close the drawer when interacting outside of the drawer.
- `lazyMount`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether to lazy mount the drawer content on first open.
- `unmountOnExit`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether to unmount the drawer content on exit.
- `onAnimationEnd`
  - type: `((open: boolean) => void) | undefined`
  - description: Gets triggered after the open or close animation ends, it receives an \`open\` argument with the \`open\` state of the drawer by the time the function was triggered. Useful to revert any state changes for example.

### `SidePanelTrigger` \[#sidepaneltrigger]

- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.

### `SidePanelContent` \[#sidepanelcontent]

- `title`
  - type: `React.ReactNode`
- `description`
  - type: `React.ReactNode`
- `layerIndex`
  - type: `number | undefined`
- `showCloseButton`
  - type: `boolean | undefined`
  - default: `true`
- `width`
  - type: `ResponsiveValue<(string & {}) | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | "full"> | undefined`
- `maxWidth`
  - type: `ResponsiveValue<(string & {}) | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | "full"> | undefined`
- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.

### `SidePanelBody` \[#sidepanelbody]

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
  - type: `"flex-start" | "flex-end" | "center" | "space-between" | "space-around" | undefined`
- `alignItems`
  - type: `"flex-start" | "flex-end" | "center" | "stretch" | undefined`

### `SidePanelFooter` \[#sidepanelfooter]

- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.

### `ResponsiveSidePanelRoot` \[#responsivesidepanelroot]

- `children`
  - type: `React.ReactNode`
- `open`
  - type: `boolean | undefined`
- `defaultOpen`
  - type: `boolean | undefined`
- `onOpenChange`
  - type: `((open: boolean) => void) | undefined`
- `sidePanelBreakpoint`
  - type: `"sm" | "md" | "lg" | "xl" | undefined`
  - default: `"md"`
  - description: Breakpoint at and above which the panel renders as a SidePanel; below it, a BottomSheet. Cannot be \`"base"\`, which would always be a SidePanel.
- `sidePanelRootProps`
  - type: `Omit<SidePanelRootProps, "children" | "open" | "defaultOpen" | "onOpenChange"> | undefined`
  - description: Props forwarded to the underlying SidePanel root (at and above the breakpoint).
- `bottomSheetRootProps`
  - type: `Omit<BottomSheetRootProps, "children" | "open" | "defaultOpen" | "onOpenChange"> | undefined`
  - description: Props forwarded to the underlying BottomSheet root (below the breakpoint).

## Examples \[#examples]

### Trigger \[#trigger]

`<SidePanelTrigger>`는 `asChild` 패턴을 사용해 자식 요소가 Side Panel을 열 수 있도록 합니다.

```tsx
import { ActionButton } from "seed-design/ui/action-button";
import {
  SidePanelBody,
  SidePanelContent,
  SidePanelRoot,
  SidePanelTrigger,
} from "seed-design/ui/side-panel";

const SidePanelTriggerExample = () => {
  return (
    <SidePanelRoot>
      <SidePanelTrigger asChild>
        <ActionButton variant="neutralSolid">Open</ActionButton>
      </SidePanelTrigger>
      <SidePanelContent title="Trigger 패턴">
        <SidePanelBody paddingX="x6">
          Trigger를 클릭하면 현재 화면 위에 Side Panel이 열립니다.
        </SidePanelBody>
      </SidePanelContent>
    </SidePanelRoot>
  );
};

export default SidePanelTriggerExample;
```

### Controlled \[#controlled]

Trigger 외의 방식으로 Side Panel을 열고 닫을 수 있습니다. 이 경우 `open` prop을 사용하여 Side Panel의 상태를 제어합니다.

```tsx
import { useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  SidePanelBody,
  SidePanelContent,
  SidePanelFooter,
  SidePanelRoot,
} from "seed-design/ui/side-panel";

const SidePanelControlled = () => {
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
      <SidePanelRoot open={open} onOpenChange={setOpen}>
        <SidePanelContent title="제목" description="설명을 작성할 수 있어요">
          <SidePanelBody minHeight="x16" paddingX="x6">
            외부 상태로 패널을 열고 닫을 때도 본문과 푸터 구조는 동일하게 유지됩니다.
          </SidePanelBody>
          <SidePanelFooter>
            <ActionButton variant="neutralSolid">확인</ActionButton>
          </SidePanelFooter>
        </SidePanelContent>
      </SidePanelRoot>
    </>
  );
};

export default SidePanelControlled;
```

### Direction \[#direction]

`<SidePanelRoot>`에 `direction` prop을 설정하여 Side Panel이 열리는 방향을 변경할 수 있습니다.
`"left"` 또는 `"right"`를 지원하며, 기본값은 `"right"`입니다.

```tsx
import { Flex } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  SidePanelBody,
  SidePanelContent,
  SidePanelRoot,
  SidePanelTrigger,
} from "seed-design/ui/side-panel";

const SidePanelDirection = () => {
  return (
    <Flex gap="x3" wrap="wrap">
      <SidePanelRoot direction="right">
        <SidePanelTrigger asChild>
          <ActionButton variant="neutralSolid">Right</ActionButton>
        </SidePanelTrigger>
        <SidePanelContent title="Right Side Panel">
          <SidePanelBody paddingX="x6">
            오른쪽 가장자리에서 슬라이드되어 보조 콘텐츠를 표시합니다.
          </SidePanelBody>
        </SidePanelContent>
      </SidePanelRoot>

      <SidePanelRoot direction="left">
        <SidePanelTrigger asChild>
          <ActionButton variant="neutralSolid">Left</ActionButton>
        </SidePanelTrigger>
        <SidePanelContent title="Left Side Panel">
          <SidePanelBody paddingX="x6">
            왼쪽 가장자리에서 슬라이드되어 탐색이나 설정 영역을 표시합니다.
          </SidePanelBody>
        </SidePanelContent>
      </SidePanelRoot>
    </Flex>
  );
};

export default SidePanelDirection;
```

### Size \[#size]

`<SidePanelRoot>`에 `size` prop을 설정하여 Side Panel의 너비를 변경할 수 있습니다.
`"small"` (480px), `"medium"` (720px, 기본값), `"large"` (960px)를 지원합니다.

```tsx
import { Flex } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  SidePanelBody,
  SidePanelContent,
  SidePanelRoot,
  SidePanelTrigger,
} from "seed-design/ui/side-panel";

const SidePanelSize = () => {
  return (
    <Flex gap="x3" wrap="wrap">
      <SidePanelRoot direction="right" size="small">
        <SidePanelTrigger asChild>
          <ActionButton variant="neutralSolid">Small (480px)</ActionButton>
        </SidePanelTrigger>
        <SidePanelContent title="Small Side Panel">
          <SidePanelBody paddingX="x6">
            좁은 패널에 적합한 간결한 콘텐츠를 배치합니다.
          </SidePanelBody>
        </SidePanelContent>
      </SidePanelRoot>

      <SidePanelRoot direction="right" size="medium">
        <SidePanelTrigger asChild>
          <ActionButton variant="neutralSolid">Medium (720px)</ActionButton>
        </SidePanelTrigger>
        <SidePanelContent title="Medium Side Panel">
          <SidePanelBody paddingX="x6">
            기본 너비로 상세 정보와 주요 액션을 함께 제공합니다.
          </SidePanelBody>
        </SidePanelContent>
      </SidePanelRoot>

      <SidePanelRoot direction="right" size="large">
        <SidePanelTrigger asChild>
          <ActionButton variant="neutralSolid">Large (960px)</ActionButton>
        </SidePanelTrigger>
        <SidePanelContent title="Large Side Panel">
          <SidePanelBody paddingX="x6">
            넓은 패널에서 더 많은 폼 필드나 상세 콘텐츠를 다룹니다.
          </SidePanelBody>
        </SidePanelContent>
      </SidePanelRoot>
    </Flex>
  );
};

export default SidePanelSize;
```

### Footer Layout \[#footer-layout]

`SidePanelFooter`는 flex 레이아웃만 제공하며, 버튼 배치는 `VStack`, `HStack` 등으로 직접 구성합니다.
좁은 패널에서는 `VStack`으로 세로로 쌓고, 넓은 패널에서는 `HStack`으로 가로로 정렬할 수 있습니다.

```tsx
import { Box, Flex, HStack, VStack } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  SidePanelBody,
  SidePanelContent,
  SidePanelFooter,
  SidePanelRoot,
  SidePanelTrigger,
} from "seed-design/ui/side-panel";

const SidePanelFooterLayout = () => {
  return (
    <Flex gap="x3" wrap="wrap">
      <SidePanelRoot size="small">
        <SidePanelTrigger asChild>
          <ActionButton variant="neutralSolid">Small</ActionButton>
        </SidePanelTrigger>
        <SidePanelContent
          title="Small Side Panel"
          description="좁은 패널에서는 주요 액션이 위에 오도록 세로로 배치합니다."
        >
          <SidePanelBody paddingX="x6">
            <VStack gap="x3">
              <Box>확인이 필요한 정보를 간결하게 보여줍니다.</Box>
              <Box>버튼은 패널 너비를 채우며 위에서 아래로 쌓입니다.</Box>
            </VStack>
          </SidePanelBody>
          <SidePanelFooter>
            <VStack gap="x2">
              <ActionButton variant="neutralSolid">확인</ActionButton>
              <ActionButton variant="neutralWeak">취소</ActionButton>
            </VStack>
          </SidePanelFooter>
        </SidePanelContent>
      </SidePanelRoot>

      <SidePanelRoot size="medium">
        <SidePanelTrigger asChild>
          <ActionButton variant="neutralSolid">Medium</ActionButton>
        </SidePanelTrigger>
        <SidePanelContent
          title="Medium Side Panel"
          description="넓은 패널에서는 주요 액션을 가로로 배치합니다."
        >
          <SidePanelBody paddingX="x6">
            <VStack gap="x3">
              <Box>상세 정보와 확인 액션을 함께 제공할 수 있습니다.</Box>
              <Box>버튼은 우측 영역에 가로로 정렬됩니다.</Box>
            </VStack>
          </SidePanelBody>
          <SidePanelFooter>
            <HStack gap="x2" justify="flex-end">
              <ActionButton variant="neutralWeak">취소</ActionButton>
              <ActionButton variant="neutralSolid">확인</ActionButton>
            </HStack>
          </SidePanelFooter>
        </SidePanelContent>
      </SidePanelRoot>
    </Flex>
  );
};

export default SidePanelFooterLayout;
```

### Custom Size \[#custom-size]

`<SidePanelContent>`에 `width`, `maxWidth` prop을 전달하여 너비를 직접 제어할 수 있습니다.
프리셋 size 대신 뷰포트 기반의 유동적인 너비가 필요할 때 사용합니다.

```tsx
import { Flex } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  SidePanelBody,
  SidePanelContent,
  SidePanelRoot,
  SidePanelTrigger,
} from "seed-design/ui/side-panel";

const SidePanelCustomSize = () => {
  return (
    <Flex gap="x3" wrap="wrap">
      <SidePanelRoot direction="right">
        <SidePanelTrigger asChild>
          <ActionButton variant="neutralSolid">width 80vw, max 640px</ActionButton>
        </SidePanelTrigger>
        <SidePanelContent title="Fluid Width" width="80vw" maxWidth="640px">
          <SidePanelBody paddingX="x6">
            뷰포트 너비에 따라 커지되 최대 640px까지만 확장됩니다.
          </SidePanelBody>
        </SidePanelContent>
      </SidePanelRoot>

      <SidePanelRoot direction="left">
        <SidePanelTrigger asChild>
          <ActionButton variant="neutralSolid">width 400px</ActionButton>
        </SidePanelTrigger>
        <SidePanelContent title="Fixed Width" width="400px">
          <SidePanelBody paddingX="x6">
            고정 너비가 필요한 작업 패널에 사용할 수 있습니다.
          </SidePanelBody>
        </SidePanelContent>
      </SidePanelRoot>
    </Flex>
  );
};

export default SidePanelCustomSize;
```

### Show Close Button \[#show-close-button]

`<SidePanelContent>`에 `showCloseButton` prop을 전달하여 닫기 버튼을 표시할 수 있습니다.
기본 값은 `true`입니다.

```tsx
import { Flex } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  SidePanelBody,
  SidePanelContent,
  SidePanelRoot,
  SidePanelTrigger,
} from "seed-design/ui/side-panel";

const SidePanelShowCloseButton = () => {
  return (
    <Flex gap="x3">
      <SidePanelRoot>
        <SidePanelTrigger asChild>
          <ActionButton variant="neutralSolid">닫기 버튼 있음</ActionButton>
        </SidePanelTrigger>
        <SidePanelContent title="닫기 버튼" showCloseButton>
          <SidePanelBody paddingX="x6">
            기본적으로 닫기 버튼이 표시되어 패널을 바로 닫을 수 있습니다.
          </SidePanelBody>
        </SidePanelContent>
      </SidePanelRoot>

      <SidePanelRoot>
        <SidePanelTrigger asChild>
          <ActionButton variant="neutralSolid">닫기 버튼 없음</ActionButton>
        </SidePanelTrigger>
        <SidePanelContent title="닫기 버튼 없음" showCloseButton={false}>
          <SidePanelBody paddingX="x6">
            닫기 버튼을 숨길 때는 본문이나 푸터에 닫을 수 있는 액션을 제공하세요.
          </SidePanelBody>
        </SidePanelContent>
      </SidePanelRoot>
    </Flex>
  );
};

export default SidePanelShowCloseButton;
```

### Dismissible \[#dismissible]

`dismissible` prop을 `false`로 설정하면 Escape 키, 외부 클릭으로 닫을 수 없습니다.
의도적으로 Side Panel을 닫을 수 없게 하고 싶을 때 사용합니다.

```tsx
import { useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  SidePanelBody,
  SidePanelContent,
  SidePanelFooter,
  SidePanelRoot,
  SidePanelTrigger,
} from "seed-design/ui/side-panel";

const SidePanelDismissible = () => {
  const [open, setOpen] = useState(false);

  return (
    <SidePanelRoot open={open} onOpenChange={setOpen} dismissible={false}>
      <SidePanelTrigger asChild>
        <ActionButton variant="neutralSolid">닫기 불가 Side Panel</ActionButton>
      </SidePanelTrigger>
      <SidePanelContent title="닫기 불가" showCloseButton={false}>
        <SidePanelBody paddingX="x6">
          Escape 키, 외부 클릭으로 닫을 수 없습니다. 프로그래밍 방식으로만 닫을 수 있습니다.
        </SidePanelBody>
        <SidePanelFooter>
          <ActionButton variant="neutralSolid" onClick={() => setOpen(false)}>
            닫기
          </ActionButton>
        </SidePanelFooter>
      </SidePanelContent>
    </SidePanelRoot>
  );
};

export default SidePanelDismissible;
```

### Non-modal \[#non-modal]

`modal` prop을 `false`로 설정하면 배경과 상호작용이 가능합니다. Backdrop이 표시되지 않으며, 포커스 트랩이 비활성화됩니다.
Trigger를 다시 눌러 닫아야 하는 경우에는 `open` prop으로 상태를 직접 제어합니다.

```tsx
import type { MouseEvent } from "react";
import { useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  SidePanelBody,
  SidePanelContent,
  SidePanelRoot,
  SidePanelTrigger,
} from "seed-design/ui/side-panel";

const SidePanelNonModal = () => {
  const [open, setOpen] = useState(false);

  return (
    <SidePanelRoot modal={false} open={open} onOpenChange={setOpen}>
      <SidePanelTrigger
        asChild
        onClick={(event: MouseEvent) => {
          event.preventDefault();
          setOpen((open) => !open);
        }}
      >
        <ActionButton variant="neutralSolid">Non-modal Side Panel</ActionButton>
      </SidePanelTrigger>
      <SidePanelContent title="Non-modal">
        <SidePanelBody paddingX="x6">
          배경과 상호작용이 가능합니다. Backdrop이 표시되지 않습니다.
        </SidePanelBody>
      </SidePanelContent>
    </SidePanelRoot>
  );
};

export default SidePanelNonModal;
```

### Responsive \[#responsive-1]

`ResponsiveSidePanel`을 사용하면 md 이상에서는 Side Panel, sm 이하에서는 Bottom Sheet로 자동 전환됩니다. 뷰포트를 줄여서 전환 동작을 확인해보세요.
`onOpenChange`는 열림 상태만 전달하며, Side Panel 또는 Bottom Sheet에만 적용되는 Root 옵션은 `sidePanelRootProps`, `bottomSheetRootProps`로 전달합니다.

```tsx
import { Box, VStack } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  ResponsiveSidePanelBody,
  ResponsiveSidePanelContent,
  ResponsiveSidePanelFooter,
  ResponsiveSidePanelRoot,
  ResponsiveSidePanelTrigger,
} from "seed-design/ui/responsive-side-panel";

const SidePanelResponsive = () => {
  return (
    <ResponsiveSidePanelRoot sidePanelRootProps={{ size: "medium" }}>
      <ResponsiveSidePanelTrigger asChild>
        <ActionButton variant="neutralSolid">Open</ActionButton>
      </ResponsiveSidePanelTrigger>
      <ResponsiveSidePanelContent
        title="반응형 패널"
        description="화면 크기에 따라 적합한 컴포넌트로 자동 전환됩니다."
      >
        <ResponsiveSidePanelBody>
          <VStack gap="x3">
            <Box>본문 영역은 Header/Body/Footer 구조로 동일합니다.</Box>
            <Box>md 이상에서는 화면 우측에서 슬라이드되는 Side Panel로,</Box>
            <Box>sm 이하에서는 화면 하단에서 슬라이드되는 Bottom Sheet로 표시됩니다.</Box>
          </VStack>
        </ResponsiveSidePanelBody>
        <ResponsiveSidePanelFooter>
          <ActionButton variant="neutralSolid">확인</ActionButton>
        </ResponsiveSidePanelFooter>
      </ResponsiveSidePanelContent>
    </ResponsiveSidePanelRoot>
  );
};

export default SidePanelResponsive;
```

## Keyboard Interactions \[#keyboard-interactions]

| Key           | Behavior                                          |
| ------------- | ------------------------------------------------- |
| `Escape`      | `dismissible=true`일 때 Side Panel을 닫습니다.           |
| `Tab`         | `modal=true`일 때 Side Panel 내부 요소들 사이로 포커스를 순환합니다. |
| `Shift + Tab` | `modal=true`일 때 역방향으로 포커스를 순환합니다.                 |