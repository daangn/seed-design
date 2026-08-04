file: components/help-bubble.mdx

# Help Bubble

사용자에게 컴포넌트의 상태나 특정 기능에 대한 추가 정보를 제공하는 컴포넌트입니다.

사용 가능 버전: @seed-design/react@0.0.1, @seed-design/css@0.0.1

## Preview

```tsx
import { IconILowercaseSerifCircleFill } from "@karrotmarket/react-monochrome-icon";
import { HelpBubbleTrigger } from "seed-design/ui/help-bubble";
import { ActionButton } from "seed-design/ui/action-button";
import { Icon } from "@seed-design/react";

export default function HelpBubblePreview() {
  return (
    <HelpBubbleTrigger defaultOpen title="아래 버튼이나 바깥 영역을 클릭해서 닫아보세요.">
      <ActionButton variant="ghost" size="small" layout="iconOnly" aria-label="도움말">
        <Icon svg={<IconILowercaseSerifCircleFill />} />
      </ActionButton>
    </HelpBubbleTrigger>
  );
}
```

## Installation \[#installation]

- npm: npx @seed-design/cli@latest add ui:help-bubble
- pnpm: pnpm dlx @seed-design/cli@latest add ui:help-bubble
- yarn: yarn dlx @seed-design/cli@latest add ui:help-bubble
- bun: bun x @seed-design/cli@latest add ui:help-bubble

<ManualInstallation name="help-bubble" />

## Props \[#props]

### `HelpBubbleTrigger` \[#helpbubbletrigger]

- `title`
  - type: `React.ReactNode`
  - required: `true`
- `description`
  - type: `React.ReactNode`
- `showCloseButton`
  - type: `boolean | undefined`
- `children`
  - type: `React.ReactNode`
- `contentProps`
  - type: `SeedHelpBubble.ContentProps | undefined`
- `zIndexOffset`
  - type: `number | undefined`
- `placement`
  - type: `Placement | undefined`
  - default: `"top"`
  - description: The initial placement of the floating element
- `gutter`
  - type: `number | undefined`
  - default: `4`
  - description: The gutter between the floating element and the reference element
- `overflowPadding`
  - type: `number | undefined`
  - default: `16`
  - description: The virtual padding around the viewport edges to check for overflow
- `arrowPadding`
  - type: `number | undefined`
  - default: `14`
  - description: The minimum padding between the arrow and the floating element's corner.
- `closeOnInteractOutside`
  - type: `boolean | undefined`
  - default: `true`
  - description: Whether to close the popover when clicking outside of it.
- `defaultOpen`
  - type: `boolean | undefined`
  - description: Whether the floating element is initially open
- `open`
  - type: `boolean | undefined`
  - description: Whether the floating element is open
- `onOpenChange`
  - type: `((open: boolean) => void) | undefined`
  - description: Callback when the floating element is opened or closed
- `strategy`
  - type: `"absolute" | "fixed" | undefined`
  - default: `"absolute"`
  - description: The strategy to use for positioning
- `flip`
  - type: `boolean | Placement[] | undefined`
  - default: `true`
  - description: Whether to flip the placement
- `slide`
  - type: `boolean | undefined`
  - default: `true`
  - description: Whether the popover should slide when it overflows.

### `HelpBubbleAnchor` \[#helpbubbleanchor]

- `title`
  - type: `React.ReactNode`
  - required: `true`
- `description`
  - type: `React.ReactNode`
- `showCloseButton`
  - type: `boolean | undefined`
- `children`
  - type: `React.ReactNode`
- `contentProps`
  - type: `SeedHelpBubble.ContentProps | undefined`
- `zIndexOffset`
  - type: `number | undefined`
- `placement`
  - type: `Placement | undefined`
  - default: `"top"`
  - description: The initial placement of the floating element
- `gutter`
  - type: `number | undefined`
  - default: `4`
  - description: The gutter between the floating element and the reference element
- `overflowPadding`
  - type: `number | undefined`
  - default: `16`
  - description: The virtual padding around the viewport edges to check for overflow
- `arrowPadding`
  - type: `number | undefined`
  - default: `14`
  - description: The minimum padding between the arrow and the floating element's corner.
- `closeOnInteractOutside`
  - type: `boolean | undefined`
  - default: `true`
  - description: Whether to close the popover when clicking outside of it.
- `defaultOpen`
  - type: `boolean | undefined`
  - description: Whether the floating element is initially open
- `open`
  - type: `boolean | undefined`
  - description: Whether the floating element is open
- `onOpenChange`
  - type: `((open: boolean) => void) | undefined`
  - description: Callback when the floating element is opened or closed
- `strategy`
  - type: `"absolute" | "fixed" | undefined`
  - default: `"absolute"`
  - description: The strategy to use for positioning
- `flip`
  - type: `boolean | Placement[] | undefined`
  - default: `true`
  - description: Whether to flip the placement
- `slide`
  - type: `boolean | undefined`
  - default: `true`
  - description: Whether the popover should slide when it overflows.

## Examples \[#examples]

<Callout title="Help Bubble은 기본적으로 Help Bubble 밖 영역에서 pointerdown이 발생할 때 닫힙니다.">
  아래 예시들은 대부분 `closeOnInteractOutside={false}`가 설정되어 `pointerdown`이 발생해도 닫히지 않도록 되어 있습니다.
</Callout>

### Trigger \[#trigger]

`HelpBubbleTrigger`의 `children`을 클릭하면 Help Bubble이 열리고 닫힙니다.

`children`으로는 `button` 등 포커스 가능한 요소를 넣어야 합니다.

`<HelpBubbleTrigger>`는 `aria-haspopup="dialog"` 속성을 설정하고, Help Bubble의 `open` 상태에 따라 `aria-expanded` 속성을 자동으로 설정합니다. 이 속성은 스크린 리더와 같은 보조 기술에 유용합니다.

```tsx
import { VStack } from "@seed-design/react";
import { useState } from "react";
import { HelpBubbleTrigger } from "seed-design/ui/help-bubble";
import { Switch } from "seed-design/ui/switch";
import { ActionButton } from "seed-design/ui/action-button";

export default function () {
  const [isControlledHelpBubbleOpen, setIsControlledHelpBubbleOpen] = useState(true);

  return (
    <VStack gap="x16" align="center">
      <HelpBubbleTrigger
        defaultOpen
        title="Trigger, uncontrolled"
        description="클릭으로 열고 닫는 동작이 있는 트리거입니다."
        placement="right"
        showCloseButton
        closeOnInteractOutside={false}
      >
        <ActionButton variant="neutralSolid">토글</ActionButton>
      </HelpBubbleTrigger>
      <VStack gap="spacingY.componentDefault" align="center">
        <HelpBubbleTrigger
          open={isControlledHelpBubbleOpen}
          onOpenChange={setIsControlledHelpBubbleOpen}
          title="Trigger, controlled"
          description="클릭으로 열고 닫는 동작이 있는 트리거입니다."
          placement="right"
          showCloseButton
          closeOnInteractOutside={false}
        >
          <ActionButton variant="neutralSolid">토글</ActionButton>
        </HelpBubbleTrigger>
        <Switch
          size="24"
          tone="neutral"
          label="열림"
          checked={isControlledHelpBubbleOpen}
          onCheckedChange={setIsControlledHelpBubbleOpen}
        />
      </VStack>
    </VStack>
  );
}
```

### Anchor \[#anchor]

`HelpBubbleAnchor`의 `children`은 Help Bubble이 위치를 잡는 데에만 사용되며 클릭으로 열고 닫는 동작은 없습니다.

`defaultOpen`과 `showCloseButton`을 사용하여 적절하게 열리고 닫히도록 하거나, `open` prop을 controlled하게 사용하여 열리고 닫힌 상태를 직접 관리할 수 있습니다.

```tsx
import { VStack } from "@seed-design/react";
import { useState } from "react";
import { Avatar } from "seed-design/ui/avatar";
import { HelpBubbleAnchor } from "seed-design/ui/help-bubble";
import { Switch } from "seed-design/ui/switch";

export default function () {
  const [isControlledHelpBubbleOpen, setIsControlledHelpBubbleOpen] = useState(true);

  return (
    <VStack gap="x16" align="center">
      <HelpBubbleAnchor
        defaultOpen
        title="Anchor, uncontrolled"
        description="클릭으로 열고 닫는 동작 없이 위치만 지정합니다."
        placement="right"
        showCloseButton
        closeOnInteractOutside={false}
      >
        <Avatar size="64" src="https://avatars.githubusercontent.com/u/54893898?v=4" fallback="L" />
      </HelpBubbleAnchor>
      <VStack gap="spacingY.componentDefault" align="center">
        <HelpBubbleAnchor
          open={isControlledHelpBubbleOpen}
          onOpenChange={setIsControlledHelpBubbleOpen}
          title="Anchor, controlled"
          description="클릭으로 열고 닫는 동작 없이 위치만 지정합니다."
          placement="right"
          showCloseButton
          closeOnInteractOutside={false}
        >
          <Avatar
            size="64"
            src="https://avatars.githubusercontent.com/u/54893898?v=4"
            fallback="L"
          />
        </HelpBubbleAnchor>
        <Switch
          size="24"
          tone="neutral"
          label="열림"
          checked={isControlledHelpBubbleOpen}
          onCheckedChange={setIsControlledHelpBubbleOpen}
        />
      </VStack>
    </VStack>
  );
}
```

### Close On Interact Outside \[#close-on-interact-outside]

`closeOnInteractOutside` prop을 `false`로 설정하면 Help Bubble 및 `HelpBubbleTrigger`, `HelpBubbleAnchor` 외부를 클릭해도 Help Bubble이 닫히지 않습니다. 기본값은 `true`입니다.

```tsx
import { VStack } from "@seed-design/react";
import { HelpBubbleTrigger } from "seed-design/ui/help-bubble";
import { ActionButton } from "seed-design/ui/action-button";

export default function () {
  return (
    <VStack gap="x16" align="center">
      <HelpBubbleTrigger
        defaultOpen
        title="This closes on interactions outside"
        placement="right"
        closeOnInteractOutside
      >
        <ActionButton variant="neutralSolid">토글</ActionButton>
      </HelpBubbleTrigger>
      <HelpBubbleTrigger
        defaultOpen
        title="This does not close on interactions outside"
        placement="right"
        closeOnInteractOutside={false}
      >
        <ActionButton variant="neutralSolid">토글</ActionButton>
      </HelpBubbleTrigger>
    </VStack>
  );
}
```

### Placement \[#placement]

```tsx
import { IconSparkle2 } from "@karrotmarket/react-multicolor-icon";
import { Box, Icon } from "@seed-design/react";
import { HelpBubbleAnchor } from "seed-design/ui/help-bubble";

export default function HelpBubblePreview() {
  return (
    <div
      style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "80px", padding: "80px" }}
    >
      <HelpBubbleAnchor
        open
        flip={false}
        placement="top-end"
        title="top-end"
        description="est tempor aute"
      >
        <Icon svg={<IconSparkle2 />} />
      </HelpBubbleAnchor>
      <HelpBubbleAnchor open flip={false} placement="top" title="top" description="est tempor aute">
        <Icon svg={<IconSparkle2 />} />
      </HelpBubbleAnchor>
      <HelpBubbleAnchor
        open
        flip={false}
        placement="top-start"
        title="top-start"
        description="est tempor aute"
      >
        <Icon svg={<IconSparkle2 />} />
      </HelpBubbleAnchor>
      <HelpBubbleAnchor
        open
        flip={false}
        placement="left-end"
        title="left-end"
        description="est tempor aute"
      >
        <Icon svg={<IconSparkle2 />} />
      </HelpBubbleAnchor>
      <Box />
      <HelpBubbleAnchor
        open
        flip={false}
        placement="right-end"
        title="right-end"
        description="est tempor aute"
      >
        <Icon svg={<IconSparkle2 />} />
      </HelpBubbleAnchor>
      <HelpBubbleAnchor
        open
        flip={false}
        placement="left"
        title="left"
        description="est tempor aute"
      >
        <Icon svg={<IconSparkle2 />} />
      </HelpBubbleAnchor>
      <Box />
      <HelpBubbleAnchor
        open
        flip={false}
        placement="right"
        title="right"
        description="est tempor aute"
      >
        <Icon svg={<IconSparkle2 />} />
      </HelpBubbleAnchor>
      <HelpBubbleAnchor
        open
        flip={false}
        placement="left-start"
        title="left-start"
        description="est tempor aute"
      >
        <Icon svg={<IconSparkle2 />} />
      </HelpBubbleAnchor>
      <Box />
      <HelpBubbleAnchor
        open
        flip={false}
        placement="right-start"
        title="right-start"
        description="est tempor aute"
      >
        <Icon svg={<IconSparkle2 />} />
      </HelpBubbleAnchor>
      <HelpBubbleAnchor
        open
        flip={false}
        placement="bottom-end"
        title="bottom-end"
        description="est tempor aute"
      >
        <Icon svg={<IconSparkle2 />} />
      </HelpBubbleAnchor>
      <HelpBubbleAnchor
        open
        flip={false}
        placement="bottom"
        title="bottom"
        description="est tempor aute"
      >
        <Icon svg={<IconSparkle2 />} />
      </HelpBubbleAnchor>
      <HelpBubbleAnchor
        open
        flip={false}
        placement="bottom-start"
        title="bottom-start"
        description="est tempor aute"
      >
        <Icon svg={<IconSparkle2 />} />
      </HelpBubbleAnchor>
    </div>
  );
}
```

### Flip \[#flip]

```tsx
import { IconSparkle2 } from "@karrotmarket/react-multicolor-icon";
import { Icon } from "@seed-design/react";
import { HelpBubbleAnchor } from "seed-design/ui/help-bubble";

export default function HelpBubbleFlip() {
  return (
    <HelpBubbleAnchor
      open
      flip={false}
      title="Flip"
      description="Flip을 끄면 화면 경계에서 방향이 바뀌지 않아요."
    >
      <Icon svg={<IconSparkle2 />} />
    </HelpBubbleAnchor>
  );
}
```

### Close Button \[#close-button]

```tsx
import { ActionButton } from "seed-design/ui/action-button";
import { HelpBubbleTrigger } from "seed-design/ui/help-bubble";

export default function HelpBubbleCloseButton() {
  return (
    <HelpBubbleTrigger
      defaultOpen
      showCloseButton
      title="Close Button"
      description="showCloseButton으로 닫기 버튼을 추가할 수 있어요."
    >
      <ActionButton variant="neutralSolid">토글</ActionButton>
    </HelpBubbleTrigger>
  );
}
```

### Description \[#description]

`description`을 사용하여 `title` 아래에 설명을 추가할 수 있습니다.

```tsx
import { IconSparkle2 } from "@karrotmarket/react-multicolor-icon";
import { Icon } from "@seed-design/react";
import { HelpBubbleAnchor } from "seed-design/ui/help-bubble";

export default function HelpBubbleDescription() {
  return (
    <HelpBubbleAnchor open title="제목" description="제목 아래에 부연 설명을 덧붙일 수 있어요.">
      <Icon svg={<IconSparkle2 />} />
    </HelpBubbleAnchor>
  );
}
```

### Title Only \[#title-only]

```tsx
import { IconSparkle2 } from "@karrotmarket/react-multicolor-icon";
import { Icon } from "@seed-design/react";
import { HelpBubbleAnchor } from "seed-design/ui/help-bubble";

export default function HelpBubbleTitleOnly() {
  return (
    <HelpBubbleAnchor open title="Title Only">
      <Icon svg={<IconSparkle2 />} />
    </HelpBubbleAnchor>
  );
}
```

### Setting Width Manually \[#setting-width-manually]

`contentProps`에 인라인 스타일로 `maxWidth`나 `width`를 설정하여 너비를 조절할 수 있습니다.

```tsx
import { HelpBubbleAnchor } from "seed-design/ui/help-bubble";
import { SegmentedControl, SegmentedControlItem } from "seed-design/ui/segmented-control";
import { VStack } from "@seed-design/react";
import { useState } from "react";

const WIDTH_OPTIONS = ["200px", "300px", "unset"] as const;

export default function HelpBubbleWidth() {
  const [width, setWidth] = useState<(typeof WIDTH_OPTIONS)[number]>("300px");

  return (
    <VStack gap="spacingY.componentDefault" align="center" p="x10">
      <HelpBubbleAnchor
        open
        title="Pariatur aliqua commodo eu Lorem minim anim. Lorem ipsum voluptate eu duis eiusmod consequat."
        contentProps={{ style: { width } }}
      >
        <SegmentedControl
          aria-label="너비"
          value={width}
          onValueChange={(value) => setWidth(value as (typeof WIDTH_OPTIONS)[number])}
        >
          {WIDTH_OPTIONS.map((option) => (
            <SegmentedControlItem key={option} value={option}>
              {option}
            </SegmentedControlItem>
          ))}
        </SegmentedControl>
      </HelpBubbleAnchor>
    </VStack>
  );
}
```

### Line Breaks \[#line-breaks]

```tsx
import { IconSparkle2 } from "@karrotmarket/react-multicolor-icon";
import { Icon } from "@seed-design/react";
import { HelpBubbleAnchor } from "seed-design/ui/help-bubble";
import { HStack } from "@seed-design/react";

export default function HelpBubbleLineBreaks() {
  return (
    <HStack gap="x16">
      <HelpBubbleAnchor
        open
        title={
          <>
            Breaking
            <br />
            lines
            <br />
            using
            <br />
            `&lt;br /&gt;`s
          </>
        }
      >
        <Icon svg={<IconSparkle2 />} />
      </HelpBubbleAnchor>
      <HelpBubbleAnchor open title={"Breaking\nlines\nusing\nnewlines"}>
        <Icon svg={<IconSparkle2 />} />
      </HelpBubbleAnchor>
    </HStack>
  );
}
```

### `z-index` Offset \[#z-index-offset]

```tsx
import { Flex, HStack, VStack } from "@seed-design/react";
import { useState } from "react";
import { HelpBubbleAnchor } from "seed-design/ui/help-bubble";
import { Slider } from "seed-design/ui/slider";
import { Avatar } from "seed-design/ui/avatar";

export default function HelpBubbleZIndexOffset() {
  const [zIndexOffset, setZIndexOffset] = useState(5);

  return (
    <VStack align="center" gap="x8">
      <HStack gap="x2">
        {Array.from({ length: 5 }, (_, i) => (
          <Flex
            key={i}
            width="x16"
            height="x16"
            borderRadius="r2"
            align="center"
            justify="center"
            bg="bg.neutralWeak"
            borderColor="stroke.neutralWeak"
            borderWidth={1}
            style={{ zIndex: i + 100 }}
          >
            {i + 100}
          </Flex>
        ))}
      </HStack>
      <HelpBubbleAnchor
        defaultOpen
        title={`default: 99, current: ${99 + zIndexOffset}`}
        description="Et ullamco laborum voluptate ipsum labore ea nostrud sunt ipsum."
        zIndexOffset={zIndexOffset}
        closeOnInteractOutside={false}
      >
        <Avatar size="64" src="https://avatars.githubusercontent.com/u/54893898?v=4" fallback="L" />
      </HelpBubbleAnchor>
      <Slider
        min={0}
        max={5}
        values={[zIndexOffset]}
        onValuesChange={([value]) => setZIndexOffset(value)}
        markers={[0, 5]}
        getAriaLabel={() => "zIndexOffset"}
        hideValueIndicator
      />
    </VStack>
  );
}
```