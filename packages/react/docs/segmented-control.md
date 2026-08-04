file: components/segmented-control.mdx

# Segmented Control

여러 옵션 중 하나를 선택하여 관련 콘텐츠를 즉시 필터링하거나 전환할 때 사용하는 컴포넌트입니다.

사용 가능 버전: @seed-design/react@0.0.1, @seed-design/css@0.0.1

## Preview

```tsx
import { SegmentedControl, SegmentedControlItem } from "seed-design/ui/segmented-control";

export default function SegmentedControlPreview() {
  return (
    <SegmentedControl defaultValue="Hot" aria-label="Sort by">
      <SegmentedControlItem value="Hot">Hot</SegmentedControlItem>
      <SegmentedControlItem value="New">New</SegmentedControlItem>
    </SegmentedControl>
  );
}
```

## Installation \[#installation]

- npm: npx @seed-design/cli@latest add ui:segmented-control
- pnpm: pnpm dlx @seed-design/cli@latest add ui:segmented-control
- yarn: yarn dlx @seed-design/cli@latest add ui:segmented-control
- bun: bun x @seed-design/cli@latest add ui:segmented-control

<ManualInstallation name="segmented-control" />

## Props \[#props]

### `SegmentedControl` \[#segmentedcontrol]

<Callout type="info">
  `value`와 `defaultValue` 중 적어도 하나를 제공해야 합니다.
</Callout>

- `disabled`
  - type: `boolean | undefined`
- `name`
  - type: `string | undefined`
- `form`
  - type: `string | undefined`
- `value`
  - type: `string | undefined`
- `defaultValue`
  - type: `string | undefined`
- `onValueChange`
  - type: `((value: string) => void) | undefined`
- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.

### `SegmentedControlItem` \[#segmentedcontrolitem]

- `inputProps`
  - type: `React.InputHTMLAttributes<HTMLInputElement> | undefined`
- `rootRef`
  - type: `React.Ref<HTMLLabelElement> | undefined`
- `notification`
  - type: `boolean | undefined`
- `value`
  - type: `string`
  - required: `true`
- `disabled`
  - type: `boolean | undefined`
- `invalid`
  - type: `boolean | undefined`
- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.

## Examples \[#examples]

### Disabled \[#disabled]

```tsx
import { VStack } from "@seed-design/react";
import { SegmentedControl, SegmentedControlItem } from "seed-design/ui/segmented-control";

export default function SegmentedControlPreview() {
  return (
    <VStack align="center" gap="spacingY.componentDefault">
      <SegmentedControl defaultValue="Hot" disabled aria-label="Sort by">
        <SegmentedControlItem value="Hot">Hot</SegmentedControlItem>
        <SegmentedControlItem value="New">New</SegmentedControlItem>
      </SegmentedControl>
      <SegmentedControl defaultValue="Marinara" aria-label="Pasta">
        <SegmentedControlItem value="Marinara">Marinara</SegmentedControlItem>
        <SegmentedControlItem value="Alfredo" disabled>
          Alfredo
        </SegmentedControlItem>
        <SegmentedControlItem value="Pesto" disabled>
          Pesto
        </SegmentedControlItem>
        <SegmentedControlItem value="Carbonara">Carbonara</SegmentedControlItem>
        <SegmentedControlItem value="Bolognese">Bolognese</SegmentedControlItem>
      </SegmentedControl>
    </VStack>
  );
}
```

### Notification \[#notification]

```tsx
import { ActionButton, VStack } from "@seed-design/react";
import { useState } from "react";
import { SegmentedControl, SegmentedControlItem } from "seed-design/ui/segmented-control";

export default function SegmentedControlNotification() {
  const [sortBy, setSortBy] = useState("monthly");
  const [hasSeenAnnual, setHasSeenAnnual] = useState(false);

  return (
    <VStack align="center" gap="spacingY.componentDefault">
      <SegmentedControl
        aria-label="Billing Method"
        value={sortBy}
        onValueChange={(value) => {
          setSortBy(value);

          if (value === "annual") setHasSeenAnnual(true);
        }}
      >
        <SegmentedControlItem value="monthly">Monthly</SegmentedControlItem>
        <SegmentedControlItem value="annual" notification={!hasSeenAnnual}>
          Annual
        </SegmentedControlItem>
        <SegmentedControlItem value="enterprise">Enterprise Custom</SegmentedControlItem>
      </SegmentedControl>
      <ActionButton
        size="xsmall"
        variant="neutralSolid"
        disabled={!hasSeenAnnual}
        onClick={() => setHasSeenAnnual(false)}
      >
        Reset Notification
      </ActionButton>
    </VStack>
  );
}
```

### Long Label \[#long-label]

```tsx
import { SegmentedControl, SegmentedControlItem } from "seed-design/ui/segmented-control";

export default function SegmentedControlLongLabel() {
  return (
    <SegmentedControl defaultValue="price" aria-label="정렬 기준">
      <SegmentedControlItem value="price">가격 높은 순</SegmentedControlItem>
      <SegmentedControlItem value="discount">할인율 높은 순</SegmentedControlItem>
      <SegmentedControlItem value="popularity">인기 많은 순</SegmentedControlItem>
    </SegmentedControl>
  );
}
```

### Fixed Width \[#fixed-width]

`SegmentedControl`의 `style` prop에 `width`를 제공해서 직접 너비를 설정할 수 있습니다.

```tsx
import { VStack } from "@seed-design/react";
import { SegmentedControl, SegmentedControlItem } from "seed-design/ui/segmented-control";

export default function SegmentedControlFixedWidth() {
  return (
    <VStack align="center" gap="spacingY.componentDefault">
      <SegmentedControl defaultValue="new" style={{ width: "500px" }} aria-label="Sort by">
        <SegmentedControlItem value="new">New</SegmentedControlItem>
        <SegmentedControlItem value="hot">Hot</SegmentedControlItem>
      </SegmentedControl>
      <SegmentedControl defaultValue="oneway" style={{ width: "400px" }} aria-label="Trip Type">
        <SegmentedControlItem value="oneway">One Way Trip</SegmentedControlItem>
        <SegmentedControlItem notification value="round">
          Round Trip
        </SegmentedControlItem>
        <SegmentedControlItem notification value="multi">
          Multi-City Journey
        </SegmentedControlItem>
      </SegmentedControl>
    </VStack>
  );
}
```

### Listening to Value Changes \[#listening-to-value-changes]

`SegmentedControl`의 `onValueChange` prop을 사용하여 선택 값 변경을 감지할 수 있습니다.

이벤트를 활용해야 하는 경우 `SegmentedControlItem`의 `inputProps`를 통해 내부 `<input>` 요소에 직접 이벤트 핸들러를 추가할 수 있습니다.

```tsx
import { VStack, Text } from "@seed-design/react";
import { SegmentedControl, SegmentedControlItem } from "seed-design/ui/segmented-control";
import { useState } from "react";

export default function SegmentedControlValueChanges() {
  const [count, setCount] = useState(0);
  const [lastValue, setLastValue] = useState<string | null>(null);

  return (
    <VStack gap="x4" align="center">
      <SegmentedControl
        defaultValue="hot"
        aria-label="Sort by"
        onValueChange={(value) => {
          setCount((prev) => prev + 1);
          setLastValue(value);
        }}
      >
        <SegmentedControlItem value="hot">Hot</SegmentedControlItem>
        <SegmentedControlItem value="new">New</SegmentedControlItem>
      </SegmentedControl>
      <Text>
        onValueChange called: {count} times, last value: {lastValue ?? "-"}
      </Text>
    </VStack>
  );
}
```