file: components/help-bubble-tooltip.mdx

# Help Bubble Tooltip

포인터를 올리거나 포커스했을 때 보조 정보를 보여주는 툴팁 형태의 Help Bubble입니다.

사용 가능 버전: @seed-design/react@2.0.0, @seed-design/css@2.0.0

## Preview

```tsx
import { IconQuestionmarkCircleFill } from "@karrotmarket/react-monochrome-icon";
import { Icon } from "@seed-design/react";
import { HelpBubbleTooltipTrigger } from "seed-design/ui/help-bubble-tooltip";
import { ActionButton } from "seed-design/ui/action-button";

export default function HelpBubbleTooltipPreview() {
  return (
    <HelpBubbleTooltipTrigger title="포인터를 올리거나 키보드로 포커스하면 열립니다.">
      <ActionButton variant="ghost" size="small" layout="iconOnly" aria-label="도움말">
        <Icon svg={<IconQuestionmarkCircleFill />} />
      </ActionButton>
    </HelpBubbleTooltipTrigger>
  );
}
```

## Installation \[#installation]

- npm: npx @seed-design/cli@latest add ui:help-bubble-tooltip
- pnpm: pnpm dlx @seed-design/cli@latest add ui:help-bubble-tooltip
- yarn: yarn dlx @seed-design/cli@latest add ui:help-bubble-tooltip
- bun: bun x @seed-design/cli@latest add ui:help-bubble-tooltip

<ManualInstallation name="help-bubble-tooltip" />

## Props \[#props]

### `HelpBubbleTooltipTrigger` \[#helpbubbletooltiptrigger]

- `title`
  - type: `React.ReactNode`
  - required: `true`
- `description`
  - type: `React.ReactNode`
- `children`
  - type: `React.ReactNode`
- `contentProps`
  - type: `SeedHelpBubbleTooltip.ContentProps | undefined`
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
- `openDelay`
  - type: `number | undefined`
  - default: `200`
  - description: Delay in milliseconds before the tooltip opens on hover.
- `closeDelay`
  - type: `number | undefined`
  - default: `100`
  - description: Delay in milliseconds before the tooltip closes after the pointer leaves.
- `keepOpenOnContentHover`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the tooltip stays open while the pointer is over its content.
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

### `HelpBubbleTooltipDelayGroup` \[#helpbubbletooltipdelaygroup]

- `children`
  - type: `React.ReactNode`
- `openDelay`
  - type: `number | undefined`
  - default: `200`
  - description: Shared open delay (ms) for the grouped tooltips.
- `closeDelay`
  - type: `number | undefined`
  - default: `100`
  - description: Shared close delay (ms) for the grouped tooltips.

## Examples \[#examples]

### Hover & Focus \[#hover--focus]

`HelpBubbleTooltipTrigger`의 `children`에 포인터를 올리거나(hover) 키보드로 포커스(focus)하면 Help Bubble Tooltip을 엽니다.

`children`으로는 `button` 등 포커스 가능한 요소를 넣어야 합니다.

Help Bubble Tooltip은 Close Button이나 내부 인터랙션 요소를 포함하지 않습니다. 클릭으로 열고 닫거나([Toggletip](https://inclusive-components.design/tooltips-toggletips/)), Close Button이 필요하다면 [Help Bubble](/react/components/help-bubble)을 사용하세요.

```tsx
import { IconExclamationmarkCircleFill } from "@karrotmarket/react-monochrome-icon";
import { HelpBubbleTooltipTrigger } from "seed-design/ui/help-bubble-tooltip";
import { ActionButton } from "seed-design/ui/action-button";
import { Icon } from "@seed-design/react";

export default function HelpBubbleHover() {
  return (
    <HelpBubbleTooltipTrigger
      title="포인터를 올리거나 키보드로 포커스하면 열립니다."
      placement="right"
    >
      <ActionButton variant="ghost" size="small" layout="iconOnly" aria-label="도움말">
        <Icon svg={<IconExclamationmarkCircleFill />} />
      </ActionButton>
    </HelpBubbleTooltipTrigger>
  );
}
```

### Delay \[#delay]

`openDelay`로 포인터가 올라온 뒤 열리기까지, `closeDelay`로 포인터가 벗어난 뒤 닫히기까지의 시간을 조절합니다. 기본값은 각각 `200ms`, `100ms`이며, focus로 열 때는 두 delay 모두 적용되지 않습니다.

```tsx
import { IconClockFill } from "@karrotmarket/react-monochrome-icon";
import { HStack, Icon } from "@seed-design/react";
import { HelpBubbleTooltipTrigger } from "seed-design/ui/help-bubble-tooltip";
import { ActionButton } from "seed-design/ui/action-button";

export default function HelpBubbleTooltipDelay() {
  return (
    <HStack gap="x16">
      <HelpBubbleTooltipTrigger
        title="기본값: openDelay 200ms, closeDelay 100ms"
        placement="bottom"
      >
        <ActionButton variant="ghost" size="small" layout="iconOnly" aria-label="기본 지연">
          <Icon svg={<IconClockFill />} />
        </ActionButton>
      </HelpBubbleTooltipTrigger>
      <HelpBubbleTooltipTrigger
        openDelay={0}
        closeDelay={0}
        title="openDelay={0}, closeDelay={0} — 지연 없이 즉시 열고 닫습니다."
        placement="bottom"
      >
        <ActionButton variant="ghost" size="small" layout="iconOnly" aria-label="지연 없음">
          <Icon svg={<IconClockFill />} />
        </ActionButton>
      </HelpBubbleTooltipTrigger>
    </HStack>
  );
}
```

### Delay Group \[#delay-group]

같은 `HelpBubbleTooltipDelayGroup`에 속한 Help Bubble Trigger 하나가 열린 뒤에는, 같은 그룹의 다른 트리거로 포인터를 옮길 때 `openDelay` 없이 즉시 열리며, `HelpBubbleTooltipDelayGroup`에 `openDelay` 또는 `closeDelay`를 지정하여 그룹 내 트리거들의 지연을 일괄적으로 조절할 수 있습니다.

그룹 내 `HelpBubbleTooltipTrigger`에 `openDelay` 또는 `closeDelay`를 직접 설정하는 경우 해당 값이 그룹 delay보다 우선합니다.

```tsx
import {
  IconBellFill,
  IconMagnifyingglassFill,
  IconPencilFill,
  IconPersonCircleFill,
} from "@karrotmarket/react-monochrome-icon";
import { HStack, PrefixIcon } from "@seed-design/react";
import {
  HelpBubbleTooltipDelayGroup,
  HelpBubbleTooltipTrigger,
} from "seed-design/ui/help-bubble-tooltip";
import { ActionButton } from "seed-design/ui/action-button";

export default function HelpBubbleTooltipDelayGroupExample() {
  return (
    <HStack gap="x1">
      <HelpBubbleTooltipDelayGroup>
        <HelpBubbleTooltipTrigger title="동네 가게와 상품을 검색해요" placement="bottom">
          <ActionButton variant="ghost">
            <PrefixIcon svg={<IconMagnifyingglassFill />} />
            검색
          </ActionButton>
        </HelpBubbleTooltipTrigger>
        <HelpBubbleTooltipTrigger title="새 게시글을 작성해요" placement="bottom">
          <ActionButton variant="ghost">
            <PrefixIcon svg={<IconPencilFill />} />
            글쓰기
          </ActionButton>
        </HelpBubbleTooltipTrigger>
        <HelpBubbleTooltipTrigger title="받은 알림을 확인해요" placement="bottom">
          <ActionButton variant="ghost">
            <PrefixIcon svg={<IconBellFill />} />
            알림
          </ActionButton>
        </HelpBubbleTooltipTrigger>
        <HelpBubbleTooltipTrigger title="내 프로필로 이동해요" placement="bottom">
          <ActionButton variant="ghost">
            <PrefixIcon svg={<IconPersonCircleFill />} />
            프로필
          </ActionButton>
        </HelpBubbleTooltipTrigger>
      </HelpBubbleTooltipDelayGroup>
    </HStack>
  );
}
```

### Keep Open on Content Hover \[#keep-open-on-content-hover]

기본적으로 포인터를 Help Bubble Tooltip 위로 옮기면 트리거에서 벗어난 것으로 간주되어 닫힙니다. `keepOpenOnContentHover`를 주면 Help Bubble Tooltip 위로 포인터를 옮겨도 닫히지 않고, Help Bubble Tooltip 안의 텍스트를 드래그해 선택하는 등 내용과 상호작용할 수 있습니다.

```tsx
import { IconEyeFill } from "@karrotmarket/react-monochrome-icon";
import { HStack, Icon } from "@seed-design/react";
import { HelpBubbleTooltipTrigger } from "seed-design/ui/help-bubble-tooltip";
import { ActionButton } from "seed-design/ui/action-button";

export default function HelpBubbleTooltipKeepOpenOnContentHover() {
  return (
    <HStack gap="x16">
      <HelpBubbleTooltipTrigger
        title="기본 동작"
        description="포인터를 Help Bubble Tooltip 위로 옮기면 닫혀서, 안의 텍스트를 선택할 수 없어요."
        placement="bottom"
      >
        <ActionButton variant="ghost" size="small" layout="iconOnly" aria-label="도움말">
          <Icon svg={<IconEyeFill />} />
        </ActionButton>
      </HelpBubbleTooltipTrigger>
      <HelpBubbleTooltipTrigger
        keepOpenOnContentHover
        title="keepOpenOnContentHover"
        description="포인터를 Help Bubble Tooltip 위로 옮겨도 닫히지 않아, 안의 텍스트를 드래그해 선택할 수 있어요."
        placement="bottom"
      >
        <ActionButton variant="ghost" size="small" layout="iconOnly" aria-label="도움말">
          <Icon svg={<IconEyeFill />} />
        </ActionButton>
      </HelpBubbleTooltipTrigger>
    </HStack>
  );
}
```

### Placement \[#placement]

```tsx
import { IconStarFill } from "@karrotmarket/react-monochrome-icon";
import { Box, Icon } from "@seed-design/react";
import { HelpBubbleTooltipTrigger } from "seed-design/ui/help-bubble-tooltip";
import { ActionButton } from "seed-design/ui/action-button";

export default function HelpBubbleTooltipPlacement() {
  return (
    <div
      style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "80px", padding: "80px" }}
    >
      <HelpBubbleTooltipTrigger
        flip={false}
        placement="top-end"
        title="top-end"
        description="est tempor aute"
      >
        <ActionButton variant="ghost" size="small" layout="iconOnly" aria-label="top-end">
          <Icon svg={<IconStarFill />} />
        </ActionButton>
      </HelpBubbleTooltipTrigger>
      <HelpBubbleTooltipTrigger
        flip={false}
        placement="top"
        title="top"
        description="est tempor aute"
      >
        <ActionButton variant="ghost" size="small" layout="iconOnly" aria-label="top">
          <Icon svg={<IconStarFill />} />
        </ActionButton>
      </HelpBubbleTooltipTrigger>
      <HelpBubbleTooltipTrigger
        flip={false}
        placement="top-start"
        title="top-start"
        description="est tempor aute"
      >
        <ActionButton variant="ghost" size="small" layout="iconOnly" aria-label="top-start">
          <Icon svg={<IconStarFill />} />
        </ActionButton>
      </HelpBubbleTooltipTrigger>
      <HelpBubbleTooltipTrigger
        flip={false}
        placement="left-end"
        title="left-end"
        description="est tempor aute"
      >
        <ActionButton variant="ghost" size="small" layout="iconOnly" aria-label="left-end">
          <Icon svg={<IconStarFill />} />
        </ActionButton>
      </HelpBubbleTooltipTrigger>
      <Box />
      <HelpBubbleTooltipTrigger
        flip={false}
        placement="right-end"
        title="right-end"
        description="est tempor aute"
      >
        <ActionButton variant="ghost" size="small" layout="iconOnly" aria-label="right-end">
          <Icon svg={<IconStarFill />} />
        </ActionButton>
      </HelpBubbleTooltipTrigger>
      <HelpBubbleTooltipTrigger
        flip={false}
        placement="left"
        title="left"
        description="est tempor aute"
      >
        <ActionButton variant="ghost" size="small" layout="iconOnly" aria-label="left">
          <Icon svg={<IconStarFill />} />
        </ActionButton>
      </HelpBubbleTooltipTrigger>
      <Box />
      <HelpBubbleTooltipTrigger
        flip={false}
        placement="right"
        title="right"
        description="est tempor aute"
      >
        <ActionButton variant="ghost" size="small" layout="iconOnly" aria-label="right">
          <Icon svg={<IconStarFill />} />
        </ActionButton>
      </HelpBubbleTooltipTrigger>
      <HelpBubbleTooltipTrigger
        flip={false}
        placement="left-start"
        title="left-start"
        description="est tempor aute"
      >
        <ActionButton variant="ghost" size="small" layout="iconOnly" aria-label="left-start">
          <Icon svg={<IconStarFill />} />
        </ActionButton>
      </HelpBubbleTooltipTrigger>
      <Box />
      <HelpBubbleTooltipTrigger
        flip={false}
        placement="right-start"
        title="right-start"
        description="est tempor aute"
      >
        <ActionButton variant="ghost" size="small" layout="iconOnly" aria-label="right-start">
          <Icon svg={<IconStarFill />} />
        </ActionButton>
      </HelpBubbleTooltipTrigger>
      <HelpBubbleTooltipTrigger
        flip={false}
        placement="bottom-end"
        title="bottom-end"
        description="est tempor aute"
      >
        <ActionButton variant="ghost" size="small" layout="iconOnly" aria-label="bottom-end">
          <Icon svg={<IconStarFill />} />
        </ActionButton>
      </HelpBubbleTooltipTrigger>
      <HelpBubbleTooltipTrigger
        flip={false}
        placement="bottom"
        title="bottom"
        description="est tempor aute"
      >
        <ActionButton variant="ghost" size="small" layout="iconOnly" aria-label="bottom">
          <Icon svg={<IconStarFill />} />
        </ActionButton>
      </HelpBubbleTooltipTrigger>
      <HelpBubbleTooltipTrigger
        flip={false}
        placement="bottom-start"
        title="bottom-start"
        description="est tempor aute"
      >
        <ActionButton variant="ghost" size="small" layout="iconOnly" aria-label="bottom-start">
          <Icon svg={<IconStarFill />} />
        </ActionButton>
      </HelpBubbleTooltipTrigger>
    </div>
  );
}
```

### Flip \[#flip]

```tsx
import { IconHeartFill } from "@karrotmarket/react-monochrome-icon";
import { Icon } from "@seed-design/react";
import { HelpBubbleTooltipTrigger } from "seed-design/ui/help-bubble-tooltip";
import { ActionButton } from "seed-design/ui/action-button";

export default function HelpBubbleTooltipFlip() {
  return (
    <HelpBubbleTooltipTrigger
      flip={false}
      title="Flip"
      description="Flip을 끄면 화면 경계에서 방향이 바뀌지 않아요."
    >
      <ActionButton variant="ghost" size="small" layout="iconOnly" aria-label="도움말">
        <Icon svg={<IconHeartFill />} />
      </ActionButton>
    </HelpBubbleTooltipTrigger>
  );
}
```

### Description \[#description]

`description`을 사용하여 `title` 아래에 설명을 추가할 수 있습니다.

```tsx
import { IconBookmarkFill } from "@karrotmarket/react-monochrome-icon";
import { Icon } from "@seed-design/react";
import { HelpBubbleTooltipTrigger } from "seed-design/ui/help-bubble-tooltip";
import { ActionButton } from "seed-design/ui/action-button";

export default function HelpBubbleTooltipDescription() {
  return (
    <HelpBubbleTooltipTrigger title="제목" description="제목 아래에 부연 설명을 덧붙일 수 있어요.">
      <ActionButton variant="ghost" size="small" layout="iconOnly" aria-label="도움말">
        <Icon svg={<IconBookmarkFill />} />
      </ActionButton>
    </HelpBubbleTooltipTrigger>
  );
}
```

### Title Only \[#title-only]

```tsx
import { IconGiftFill } from "@karrotmarket/react-monochrome-icon";
import { Icon } from "@seed-design/react";
import { HelpBubbleTooltipTrigger } from "seed-design/ui/help-bubble-tooltip";
import { ActionButton } from "seed-design/ui/action-button";

export default function HelpBubbleTooltipTitleOnly() {
  return (
    <HelpBubbleTooltipTrigger title="Title Only">
      <ActionButton variant="ghost" size="small" layout="iconOnly" aria-label="도움말">
        <Icon svg={<IconGiftFill />} />
      </ActionButton>
    </HelpBubbleTooltipTrigger>
  );
}
```

### Setting Width Manually \[#setting-width-manually]

`contentProps`에 인라인 스타일로 `maxWidth`나 `width`를 설정하여 너비를 조절할 수 있습니다.

```tsx
import { HStack } from "@seed-design/react";
import { HelpBubbleTooltipTrigger } from "seed-design/ui/help-bubble-tooltip";
import { ActionButton } from "seed-design/ui/action-button";

const TITLE =
  "Pariatur aliqua commodo eu Lorem minim anim. Lorem ipsum voluptate eu duis eiusmod consequat.";

const WIDTHS = ["200px", "300px", "unset"] as const;

export default function HelpBubbleTooltipWidth() {
  return (
    <HStack gap="x16" p="x10">
      {WIDTHS.map((width) => (
        <HelpBubbleTooltipTrigger
          key={width}
          title={TITLE}
          placement="bottom"
          contentProps={{ style: { width } }}
        >
          <ActionButton variant="ghost" size="small">
            {width}
          </ActionButton>
        </HelpBubbleTooltipTrigger>
      ))}
    </HStack>
  );
}
```

### Line Breaks \[#line-breaks]

```tsx
import { IconFlagFill } from "@karrotmarket/react-monochrome-icon";
import { HStack, Icon } from "@seed-design/react";
import { HelpBubbleTooltipTrigger } from "seed-design/ui/help-bubble-tooltip";
import { ActionButton } from "seed-design/ui/action-button";

export default function HelpBubbleTooltipLineBreaks() {
  return (
    <HStack gap="x16">
      <HelpBubbleTooltipTrigger
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
        <ActionButton variant="ghost" size="small" layout="iconOnly" aria-label="br 줄바꿈">
          <Icon svg={<IconFlagFill />} />
        </ActionButton>
      </HelpBubbleTooltipTrigger>
      <HelpBubbleTooltipTrigger title={"Breaking\nlines\nusing\nnewlines"}>
        <ActionButton variant="ghost" size="small" layout="iconOnly" aria-label="개행 줄바꿈">
          <Icon svg={<IconFlagFill />} />
        </ActionButton>
      </HelpBubbleTooltipTrigger>
    </HStack>
  );
}
```

### `z-index` Offset \[#z-index-offset]

```tsx
import { IconGearFill } from "@karrotmarket/react-monochrome-icon";
import { Flex, HStack, Icon, VStack } from "@seed-design/react";
import { useState } from "react";
import { HelpBubbleTooltipTrigger } from "seed-design/ui/help-bubble-tooltip";
import { ActionButton } from "seed-design/ui/action-button";
import { Slider } from "seed-design/ui/slider";

export default function HelpBubbleTooltipZIndexOffset() {
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
      <HelpBubbleTooltipTrigger
        title={`default: 99, current: ${99 + zIndexOffset}`}
        description="Et ullamco laborum voluptate ipsum labore ea nostrud sunt ipsum."
        zIndexOffset={zIndexOffset}
      >
        <ActionButton variant="ghost" size="small" layout="iconOnly" aria-label="도움말">
          <Icon svg={<IconGearFill />} />
        </ActionButton>
      </HelpBubbleTooltipTrigger>
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

### Accessibility \[#accessibility]

#### Icon-only Button \[#icon-only-button]

Help Bubble Tooltip의 내용은 트리거의 설명으로서 작동하며, 트리거의 이름을 대신하는 것이 아닙니다. Help Bubble Tooltip 사용 여부와 무관하게, 텍스트 없이 아이콘만 있는 버튼에는 항상 `aria-label`을 지정하세요.

```tsx
<HelpBubbleTooltipTrigger title="비밀번호는 영문, 숫자, 특수문자를 포함해 8자 이상이어야 해요.">
  {/* iconOnly ActionButton에 aria-label을 지정합니다. */}
  {/* [!code highlight] */}
  <ActionButton layout="iconOnly" aria-label="비밀번호 규칙">
    <Icon svg={<IconILowercaseSerifCircleFill />} />
  </ActionButton>
</HelpBubbleTooltipTrigger>
```

#### Disabled Triggers \[#disabled-triggers]

기본적으로 `<button disabled>` 요소는 키보드로 포커스할 수 없어, 해당 요소를 트리거로 사용하는 경우 키보드를 통해 Help Bubble Tooltip이 열리지 않습니다.

버튼이 비활성화된 이유를 안내해야 한다면, 비활성화된 버튼에 Help Bubble Tooltip을 붙이는 것보다는 그 이유를 가까운 텍스트로 함께 표시하는 구조를 권장합니다. `disabled` 버튼에 Help Bubble Tooltip을 붙여야 한다면, 버튼을 포커스 가능한 `span`(`tabIndex={0}`)으로 감싸 `children`으로 사용하세요.

```tsx
import { IconPencilFill } from "@karrotmarket/react-monochrome-icon";
import { HStack, PrefixIcon, Text, VStack } from "@seed-design/react";
import { useState } from "react";
import { HelpBubbleTooltipTrigger } from "seed-design/ui/help-bubble-tooltip";
import { ActionButton } from "seed-design/ui/action-button";
import { Switch } from "seed-design/ui/switch";

export default function HelpBubbleTooltipDisabled() {
  const [disabled, setDisabled] = useState(true);

  return (
    <VStack gap="x10" align="center">
      <HStack gap="x10" align="center">
        <VStack gap="x2" align="center">
          <HelpBubbleTooltipTrigger title="권한이 없어 사용할 수 없어요." placement="bottom">
            <ActionButton
              variant="neutralWeak"
              size="small"
              disabled={disabled}
            >
              <PrefixIcon svg={<IconPencilFill />} />
              글쓰기
            </ActionButton>
          </HelpBubbleTooltipTrigger>
          <Text textStyle="t3Regular" color="fg.neutralMuted">
            span 없음
          </Text>
        </VStack>
        <VStack gap="x2" align="center">
          <HelpBubbleTooltipTrigger title="권한이 없어 사용할 수 없어요." placement="bottom">
            <span tabIndex={disabled ? 0 : undefined} style={{ display: "inline-flex" }}>
              <ActionButton
                variant="neutralWeak"
                size="small"
                disabled={disabled}
              >
                <PrefixIcon svg={<IconPencilFill />} />
                글쓰기
              </ActionButton>
            </span>
          </HelpBubbleTooltipTrigger>
          <Text textStyle="t3Regular" color="fg.neutralMuted">
            span으로 감쌈 (권장)
          </Text>
        </VStack>
      </HStack>
      <Text textStyle="t4Regular" color="fg.neutralMuted">
        Tab 키로도 포커스해 보세요. span으로 감싼 쪽만 키보드로 열립니다.
      </Text>
      <Switch
        size="24"
        tone="neutral"
        label="버튼 비활성화"
        checked={disabled}
        onCheckedChange={setDisabled}
      />
    </VStack>
  );
}
```