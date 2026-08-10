file: components/chip.mdx

# Chip

사용자가 선택하거나 입력하는 값을 표시하는 컴포넌트입니다.

사용 가능 버전: @seed-design/react@0.1.4, @seed-design/css@0.1.4

## Preview

```tsx
import { HStack, VStack } from "@seed-design/react";
import { Chip } from "seed-design/ui/chip";

export default function ChipPreview() {
  return (
    <VStack gap="x3" align="center">
      <HStack gap="x2">
        <Chip.Button>
          <Chip.Label>Button Chip</Chip.Label>
        </Chip.Button>
        <Chip.Toggle>
          <Chip.Label>Toggle Chip</Chip.Label>
        </Chip.Toggle>
      </HStack>
      <Chip.RadioRoot defaultValue="option1" aria-label="Options">
        <HStack gap="x2">
          <Chip.RadioItem value="option1">
            <Chip.Label>Radio Chip 1</Chip.Label>
          </Chip.RadioItem>
          <Chip.RadioItem value="option2">
            <Chip.Label>Radio Chip 2</Chip.Label>
          </Chip.RadioItem>
        </HStack>
      </Chip.RadioRoot>
    </VStack>
  );
}
```

## Installation \[#installation]

- npm: npx @seed-design/cli@latest add ui:chip
- pnpm: pnpm dlx @seed-design/cli@latest add ui:chip
- yarn: yarn dlx @seed-design/cli@latest add ui:chip
- bun: bun x @seed-design/cli@latest add ui:chip

<ManualInstallation name="chip" />

## Props \[#props]

### `Chip.Button` \[#chipbutton]

- `variant`
  - type: `"solid" | "outlineStrong" | "outlineWeak" | undefined`
  - default: `"solid"`
  - description: - \`solid\`: 기본 스타일입니다. - \`outlineStrong\`: 명확한 구분이 필요한 경우 사용합니다. - \`outlineWeak\`: Selection 사용 시 주목도가 낮은 스타일로 권장됩니다.
- `size`
  - type: `"large" | "medium" | "small" | undefined`
  - default: `"medium"`
- `layout`
  - type: `"iconOnly" | "withText" | undefined`
  - default: `"withText"`
- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.

### `Chip.Toggle` \[#chiptoggle]

- `inputProps`
  - type: `React.InputHTMLAttributes<HTMLInputElement> | undefined`
- `rootRef`
  - type: `React.Ref<HTMLLabelElement> | undefined`
- `variant`
  - type: `"solid" | "outlineStrong" | "outlineWeak" | undefined`
  - default: `"solid"`
  - description: - \`solid\`: 기본 스타일입니다. - \`outlineStrong\`: 명확한 구분이 필요한 경우 사용합니다. - \`outlineWeak\`: Selection 사용 시 주목도가 낮은 스타일로 권장됩니다.
- `size`
  - type: `"large" | "medium" | "small" | undefined`
  - default: `"medium"`
- `layout`
  - type: `"iconOnly" | "withText" | undefined`
  - default: `"withText"`
- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.
- `disabled`
  - type: `boolean | undefined`
- `invalid`
  - type: `boolean | undefined`
- `required`
  - type: `boolean | undefined`
- `checked`
  - type: `boolean | undefined`
- `defaultChecked`
  - type: `boolean | undefined`
- `onCheckedChange`
  - type: `((checked: boolean) => void) | undefined`
- `indeterminate`
  - type: `boolean | undefined`

### `Chip.RadioRoot` \[#chipradioroot]

- `disabled`
  - type: `boolean | undefined`
  - default: `false`
- `invalid`
  - type: `boolean | undefined`
  - default: `false`
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

### `Chip.RadioItem` \[#chipradioitem]

- `inputProps`
  - type: `React.InputHTMLAttributes<HTMLInputElement> | undefined`
- `rootRef`
  - type: `React.Ref<HTMLLabelElement> | undefined`
- `variant`
  - type: `"solid" | "outlineStrong" | "outlineWeak" | undefined`
  - default: `"solid"`
  - description: - \`solid\`: 기본 스타일입니다. - \`outlineStrong\`: 명확한 구분이 필요한 경우 사용합니다. - \`outlineWeak\`: Selection 사용 시 주목도가 낮은 스타일로 권장됩니다.
- `size`
  - type: `"large" | "medium" | "small" | undefined`
  - default: `"medium"`
- `layout`
  - type: `"iconOnly" | "withText" | undefined`
  - default: `"withText"`
- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.
- `value`
  - type: `string`
  - required: `true`
- `disabled`
  - type: `boolean | undefined`

## Examples \[#examples]

### Sizes \[#sizes]

#### Small \[#small]

```tsx
import { HStack, VStack } from "@seed-design/react";
import { Chip } from "seed-design/ui/chip";

export default function ChipSmall() {
  return (
    <VStack gap="x3" align="center">
      <HStack gap="x2">
        <Chip.Button size="small">
          <Chip.Label>Small Button</Chip.Label>
        </Chip.Button>
        <Chip.Toggle size="small">
          <Chip.Label>Small Toggle</Chip.Label>
        </Chip.Toggle>
      </HStack>
      <Chip.RadioRoot defaultValue="option1" aria-label="Options">
        <HStack gap="x2">
          <Chip.RadioItem value="option1" size="small">
            <Chip.Label>Small Radio 1</Chip.Label>
          </Chip.RadioItem>
          <Chip.RadioItem value="option2" size="small">
            <Chip.Label>Small Radio 2</Chip.Label>
          </Chip.RadioItem>
        </HStack>
      </Chip.RadioRoot>
    </VStack>
  );
}
```

#### Medium \[#medium]

```tsx
import { HStack, VStack } from "@seed-design/react";
import { Chip } from "seed-design/ui/chip";

export default function ChipMedium() {
  return (
    <VStack gap="x3" align="center">
      <HStack gap="x2">
        <Chip.Button size="medium">
          <Chip.Label>Medium Button</Chip.Label>
        </Chip.Button>
        <Chip.Toggle size="medium">
          <Chip.Label>Medium Toggle</Chip.Label>
        </Chip.Toggle>
      </HStack>
      <Chip.RadioRoot defaultValue="option1" aria-label="Options">
        <HStack gap="x2">
          <Chip.RadioItem value="option1" size="medium">
            <Chip.Label>Medium Radio 1</Chip.Label>
          </Chip.RadioItem>
          <Chip.RadioItem value="option2" size="medium">
            <Chip.Label>Medium Radio 2</Chip.Label>
          </Chip.RadioItem>
        </HStack>
      </Chip.RadioRoot>
    </VStack>
  );
}
```

#### Large \[#large]

```tsx
import { HStack, VStack } from "@seed-design/react";
import { Chip } from "seed-design/ui/chip";

export default function ChipLarge() {
  return (
    <VStack gap="x3" align="center">
      <HStack gap="x2">
        <Chip.Button size="large">
          <Chip.Label>Large Button</Chip.Label>
        </Chip.Button>
        <Chip.Toggle size="large">
          <Chip.Label>Large Toggle</Chip.Label>
        </Chip.Toggle>
      </HStack>
      <Chip.RadioRoot defaultValue="option1" aria-label="Options">
        <HStack gap="x2">
          <Chip.RadioItem value="option1" size="large">
            <Chip.Label>Large Radio 1</Chip.Label>
          </Chip.RadioItem>
          <Chip.RadioItem value="option2" size="large">
            <Chip.Label>Large Radio 2</Chip.Label>
          </Chip.RadioItem>
        </HStack>
      </Chip.RadioRoot>
    </VStack>
  );
}
```

### Variants \[#variants]

#### Solid \[#solid]

```tsx
import { HStack, VStack } from "@seed-design/react";
import { Chip } from "seed-design/ui/chip";

export default function ChipSolid() {
  return (
    <VStack gap="x3" align="center">
      <HStack gap="x2">
        <Chip.Button variant="solid">
          <Chip.Label>Solid Button</Chip.Label>
        </Chip.Button>
        <Chip.Toggle variant="solid">
          <Chip.Label>Solid Toggle</Chip.Label>
        </Chip.Toggle>
      </HStack>
      <Chip.RadioRoot defaultValue="option1" aria-label="Options">
        <HStack gap="x2">
          <Chip.RadioItem value="option1" variant="solid">
            <Chip.Label>Solid Radio 1</Chip.Label>
          </Chip.RadioItem>
          <Chip.RadioItem value="option2" variant="solid">
            <Chip.Label>Solid Radio 2</Chip.Label>
          </Chip.RadioItem>
        </HStack>
      </Chip.RadioRoot>
    </VStack>
  );
}
```

#### Outline Strong \[#outline-strong]

```tsx
import { HStack, VStack } from "@seed-design/react";
import { Chip } from "seed-design/ui/chip";

export default function ChipOutlineStrong() {
  return (
    <VStack gap="x3" align="center">
      <HStack gap="x2">
        <Chip.Button variant="outlineStrong">
          <Chip.Label>Outline Strong Button</Chip.Label>
        </Chip.Button>
        <Chip.Toggle variant="outlineStrong">
          <Chip.Label>Outline Strong Toggle</Chip.Label>
        </Chip.Toggle>
      </HStack>
      <Chip.RadioRoot defaultValue="option1" aria-label="Options">
        <HStack gap="x2">
          <Chip.RadioItem value="option1" variant="outlineStrong">
            <Chip.Label>Outline Strong Radio 1</Chip.Label>
          </Chip.RadioItem>
          <Chip.RadioItem value="option2" variant="outlineStrong">
            <Chip.Label>Outline Strong Radio 2</Chip.Label>
          </Chip.RadioItem>
        </HStack>
      </Chip.RadioRoot>
    </VStack>
  );
}
```

#### Outline Weak \[#outline-weak]

```tsx
import { HStack, VStack } from "@seed-design/react";
import { Chip } from "seed-design/ui/chip";

export default function ChipOutlineWeak() {
  return (
    <VStack gap="x3" align="center">
      <HStack gap="x2">
        <Chip.Button variant="outlineWeak">
          <Chip.Label>Outline Weak Button</Chip.Label>
        </Chip.Button>
        <Chip.Toggle variant="outlineWeak">
          <Chip.Label>Outline Weak Toggle</Chip.Label>
        </Chip.Toggle>
      </HStack>
      <Chip.RadioRoot defaultValue="option1" aria-label="Options">
        <HStack gap="x2">
          <Chip.RadioItem value="option1" variant="outlineWeak">
            <Chip.Label>Outline Weak Radio 1</Chip.Label>
          </Chip.RadioItem>
          <Chip.RadioItem value="option2" variant="outlineWeak">
            <Chip.Label>Outline Weak Radio 2</Chip.Label>
          </Chip.RadioItem>
        </HStack>
      </Chip.RadioRoot>
    </VStack>
  );
}
```

### Prefix Icon \[#prefix-icon]

```tsx
import { HStack, VStack, Icon } from "@seed-design/react";
import { Chip } from "seed-design/ui/chip";
import { IconHeartFill } from "@karrotmarket/react-monochrome-icon";

export default function ChipPrefixIcon() {
  return (
    <VStack gap="x3" align="center">
      <HStack gap="x2">
        <Chip.Button>
          <Chip.PrefixIcon>
            <Icon svg={<IconHeartFill />} />
          </Chip.PrefixIcon>
          <Chip.Label>With Icon Button</Chip.Label>
        </Chip.Button>
        <Chip.Toggle>
          <Chip.PrefixIcon>
            <Icon svg={<IconHeartFill />} />
          </Chip.PrefixIcon>
          <Chip.Label>With Icon Toggle</Chip.Label>
        </Chip.Toggle>
      </HStack>
      <Chip.RadioRoot defaultValue="option1" aria-label="Options">
        <HStack gap="x2">
          <Chip.RadioItem value="option1">
            <Chip.PrefixIcon>
              <Icon svg={<IconHeartFill />} />
            </Chip.PrefixIcon>
            <Chip.Label>With Icon Radio 1</Chip.Label>
          </Chip.RadioItem>
          <Chip.RadioItem value="option2">
            <Chip.PrefixIcon>
              <Icon svg={<IconHeartFill />} />
            </Chip.PrefixIcon>
            <Chip.Label>With Icon Radio 2</Chip.Label>
          </Chip.RadioItem>
        </HStack>
      </Chip.RadioRoot>
    </VStack>
  );
}
```

### Suffix Icon \[#suffix-icon]

```tsx
import { HStack, VStack, Icon } from "@seed-design/react";
import { Chip } from "seed-design/ui/chip";
import { IconChevronDownLine } from "@karrotmarket/react-monochrome-icon";

export default function ChipSuffixIcon() {
  return (
    <VStack gap="x3" align="center">
      <HStack gap="x2">
        <Chip.Button>
          <Chip.Label>Button with Suffix</Chip.Label>
          <Chip.SuffixIcon>
            <Icon svg={<IconChevronDownLine />} />
          </Chip.SuffixIcon>
        </Chip.Button>
        <Chip.Toggle>
          <Chip.Label>Toggle with Suffix</Chip.Label>
          <Chip.SuffixIcon>
            <Icon svg={<IconChevronDownLine />} />
          </Chip.SuffixIcon>
        </Chip.Toggle>
      </HStack>
      <Chip.RadioRoot defaultValue="option1" aria-label="Options">
        <HStack gap="x2">
          <Chip.RadioItem value="option1">
            <Chip.Label>Radio with Suffix 1</Chip.Label>
            <Chip.SuffixIcon>
              <Icon svg={<IconChevronDownLine />} />
            </Chip.SuffixIcon>
          </Chip.RadioItem>
          <Chip.RadioItem value="option2">
            <Chip.Label>Radio with Suffix 2</Chip.Label>
            <Chip.SuffixIcon>
              <Icon svg={<IconChevronDownLine />} />
            </Chip.SuffixIcon>
          </Chip.RadioItem>
        </HStack>
      </Chip.RadioRoot>
    </VStack>
  );
}
```

### Icon Only \[#icon-only]

```tsx
import { HStack, VStack, Icon } from "@seed-design/react";
import { Chip } from "seed-design/ui/chip";
import {
  IconArrowClockwiseCircularLine,
  IconBellLine,
  IconBellSlashLine,
  IconTimer_10Line,
  IconTimer_3Line,
} from "@karrotmarket/react-monochrome-icon";
import { useState } from "react";

export default function ChipIconOnly() {
  const [checked, setChecked] = useState(false);

  return (
    <VStack gap="x3" align="center">
      <HStack gap="x2">
        <Chip.Button layout="iconOnly" aria-label="Refresh">
          <Icon svg={<IconArrowClockwiseCircularLine />} />
        </Chip.Button>
        <Chip.Toggle
          layout="iconOnly"
          checked={checked}
          onCheckedChange={setChecked}
          inputProps={{ "aria-label": "Receive notifications" }}
        >
          <Icon svg={checked ? <IconBellLine /> : <IconBellSlashLine />} />
        </Chip.Toggle>
      </HStack>
      <Chip.RadioRoot defaultValue="3" aria-label="Timer">
        <HStack gap="x2">
          <Chip.RadioItem value="3" layout="iconOnly" inputProps={{ "aria-label": "3 seconds" }}>
            <Icon svg={<IconTimer_3Line />} />
          </Chip.RadioItem>
          <Chip.RadioItem value="10" layout="iconOnly" inputProps={{ "aria-label": "10 seconds" }}>
            <Icon svg={<IconTimer_10Line />} />
          </Chip.RadioItem>
        </HStack>
      </Chip.RadioRoot>
    </VStack>
  );
}
```

### Prefix Avatar \[#prefix-avatar]

[Avatar](/react/components/avatar)와 함께 사용할 수 있습니다.

```tsx
import { HStack, VStack } from "@seed-design/react";
import { Chip } from "seed-design/ui/chip";
import { Avatar } from "seed-design/ui/avatar";
import { IdentityPlaceholder } from "seed-design/ui/identity-placeholder";

export default function ChipPrefixAvatar() {
  return (
    <VStack gap="x3" align="center">
      <HStack gap="x2">
        <Chip.Button>
          <Chip.PrefixAvatar>
            <Avatar
              size="24"
              src="https://avatars.githubusercontent.com/u/54893898?v=4"
              fallback={<IdentityPlaceholder />}
            />
          </Chip.PrefixAvatar>
          <Chip.Label>With Avatar Button</Chip.Label>
        </Chip.Button>
        <Chip.Toggle>
          <Chip.PrefixAvatar>
            <Avatar
              size="24"
              src="https://avatars.githubusercontent.com/u/54893898?v=4"
              fallback={<IdentityPlaceholder />}
            />
          </Chip.PrefixAvatar>
          <Chip.Label>With Avatar Toggle</Chip.Label>
        </Chip.Toggle>
      </HStack>
      <Chip.RadioRoot defaultValue="option1" aria-label="Options">
        <HStack gap="x2">
          <Chip.RadioItem value="option1">
            <Chip.PrefixAvatar>
              <Avatar
                size="24"
                src="https://avatars.githubusercontent.com/u/54893898?v=4"
                fallback={<IdentityPlaceholder />}
              />
            </Chip.PrefixAvatar>
            <Chip.Label>With Avatar Radio 1</Chip.Label>
          </Chip.RadioItem>
          <Chip.RadioItem value="option2">
            <Chip.PrefixAvatar>
              <Avatar
                size="24"
                src="https://avatars.githubusercontent.com/u/54893898?v=4"
                fallback={<IdentityPlaceholder />}
              />
            </Chip.PrefixAvatar>
            <Chip.Label>With Avatar Radio 2</Chip.Label>
          </Chip.RadioItem>
        </HStack>
      </Chip.RadioRoot>
    </VStack>
  );
}
```

### Listening to Value Changes \[#listening-to-value-changes]

- `Chip.Toggle`
  - `onCheckedChange`를 사용하여 토글 상태 변경을 감지할 수 있습니다.
  - 이벤트를 활용해야 하는 경우 `inputProps`를 통해 내부 `<input>` 요소에 직접 이벤트 핸들러를 추가할 수 있습니다.
- `Chip.RadioRoot` / `Chip.RadioItem`
  - `Chip.RadioRoot`의 `onValueChange`를 사용하여 라디오 버튼의 선택 값 변경을 감지할 수 있습니다.
  - 이벤트를 활용해야 하는 경우 `Chip.RadioItem`의 `inputProps`를 통해 내부 `<input>` 요소에 직접 이벤트 핸들러를 추가할 수 있습니다.

```tsx
import { HStack, VStack, Text } from "@seed-design/react";
import { Chip } from "seed-design/ui/chip";
import { useState } from "react";

export default function ChipValueChanges() {
  const [toggleCount, setToggleCount] = useState(0);
  const [toggleLastValue, setToggleLastValue] = useState<boolean | null>(null);
  const [radioCount, setRadioCount] = useState(0);
  const [radioLastValue, setRadioLastValue] = useState<string | null>(null);

  return (
    <VStack gap="x4" align="center">
      <VStack gap="x2" align="center">
        <Chip.Toggle
          onCheckedChange={(checked) => {
            setToggleCount((prev) => prev + 1);
            setToggleLastValue(checked);
          }}
        >
          <Chip.Label>Toggle Chip</Chip.Label>
        </Chip.Toggle>
        <Text>
          onCheckedChange called: {toggleCount} times, last value: {`${toggleLastValue ?? "-"}`}
        </Text>
      </VStack>
      <VStack gap="x2" align="center">
        <Chip.RadioRoot
          defaultValue="option1"
          aria-label="Options"
          onValueChange={(value) => {
            setRadioCount((prev) => prev + 1);
            setRadioLastValue(value);
          }}
        >
          <HStack gap="x2">
            <Chip.RadioItem value="option1">
              <Chip.Label>Radio 1</Chip.Label>
            </Chip.RadioItem>
            <Chip.RadioItem value="option2">
              <Chip.Label>Radio 2</Chip.Label>
            </Chip.RadioItem>
          </HStack>
        </Chip.RadioRoot>
        <Text>
          onValueChange called: {radioCount} times, last value: {radioLastValue ?? "-"}
        </Text>
      </VStack>
    </VStack>
  );
}
```

## Migrating from ActionChip/ControlChip \[#migrating-from-actionchipcontrolchip]

[Action Chip](/react/components/action-chip)과 [Control Chip](/react/components/control-chip)을 대체합니다.

### ActionChip → Chip.Button \[#actionchip--chipbutton]

```tsx
// Before
import { ActionChip } from "@seed-design/react";

<ActionChip size="medium">Label</ActionChip>

// After
import { Chip } from "@seed-design/react";

<Chip.Button size="medium" variant="solid">
  <Chip.Label>Label</Chip.Label>
</Chip.Button>
```

### ControlChip → Chip.Toggle \[#controlchip--chiptoggle]

```tsx
// Before
import { ControlChip } from "@seed-design/react";

<ControlChip size="medium">Label</ControlChip>

// After
import { Chip } from "@seed-design/react";

<Chip.Toggle size="medium" variant="outlineStrong">
  <Chip.Label>Label</Chip.Label>
</Chip.Toggle>
```