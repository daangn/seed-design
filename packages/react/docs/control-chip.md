file: components/(deprecated)/control-chip.mdx

# Control Chip



<Callout type="warn">
  더 이상 사용되지 않습니다. [Chip](/react/components/chip)의 `Chip.Toggle` 또는 `Chip.Button`을 사용하세요.
</Callout>

## Preview

```tsx
import { ControlChip } from "seed-design/ui/control-chip";

export default function ControlChipPreview() {
  return <ControlChip.Toggle>라벨</ControlChip.Toggle>;
}
```

## Installation \[#installation]

- npm: npx @seed-design/cli@latest add ui:control-chip
- pnpm: pnpm dlx @seed-design/cli@latest add ui:control-chip
- yarn: yarn dlx @seed-design/cli@latest add ui:control-chip
- bun: bun x @seed-design/cli@latest add ui:control-chip

<ManualInstallation name="control-chip" />

## Props \[#props]

### ControlChip.Button \[#controlchipbutton]

- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.
- `size`
  - type: `"medium" | "small" | undefined`
  - default: `"medium"`
- `layout`
  - type: `"withText" | "iconOnly" | undefined`
  - default: `"withText"`

### ControlChip.Toggle \[#controlchiptoggle]

- `inputProps`
  - type: `React.InputHTMLAttributes<HTMLInputElement> | undefined`
- `rootRef`
  - type: `React.Ref<HTMLLabelElement> | undefined`
- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.
- `size`
  - type: `"medium" | "small" | undefined`
  - default: `"medium"`
- `layout`
  - type: `"withText" | "iconOnly" | undefined`
  - default: `"withText"`
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

### ControlChip.RadioRoot \[#controlchipradioroot]

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

### ControlChip.RadioItem \[#controlchipradioitem]

- `inputProps`
  - type: `React.InputHTMLAttributes<HTMLInputElement> | undefined`
- `rootRef`
  - type: `React.Ref<HTMLLabelElement> | undefined`
- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.
- `size`
  - type: `"medium" | "small" | undefined`
  - default: `"medium"`
- `layout`
  - type: `"withText" | "iconOnly" | undefined`
  - default: `"withText"`
- `value`
  - type: `string`
  - required: `true`
- `disabled`
  - type: `boolean | undefined`

## Examples \[#examples]

### Medium \[#medium]

```tsx
import { ControlChip } from "seed-design/ui/control-chip";

export default function ActionChipMedium() {
  return <ControlChip.Toggle size="medium">라벨</ControlChip.Toggle>;
}
```

### Small \[#small]

```tsx
import { ControlChip } from "seed-design/ui/control-chip";

export default function ActionChipSmall() {
  return <ControlChip.Toggle size="small">라벨</ControlChip.Toggle>;
}
```

### Icon Only \[#icon-only]

```tsx
import { IconPlusFill } from "@karrotmarket/react-monochrome-icon";
import { Icon } from "@seed-design/react";
import { ControlChip } from "seed-design/ui/control-chip";

export default function ControlChipIconOnly() {
  return (
    <ControlChip.Toggle layout="iconOnly" inputProps={{ "aria-label": "추가" }}>
      <Icon svg={<IconPlusFill />} />
    </ControlChip.Toggle>
  );
}
```

### Prefix Icon \[#prefix-icon]

```tsx
import { IconPlusFill } from "@karrotmarket/react-monochrome-icon";
import { PrefixIcon } from "@seed-design/react";
import { ControlChip } from "seed-design/ui/control-chip";

export default function ControlChipPrefixIcon() {
  return (
    <ControlChip.Toggle>
      <PrefixIcon svg={<IconPlusFill />} />
      라벨
    </ControlChip.Toggle>
  );
}
```

### Suffix Icon \[#suffix-icon]

```tsx
import { IconChevronDownFill } from "@karrotmarket/react-monochrome-icon";
import { SuffixIcon } from "@seed-design/react";
import { ControlChip } from "seed-design/ui/control-chip";

export default function ControlChipSuffixIcon() {
  return (
    <ControlChip.Toggle>
      라벨
      <SuffixIcon svg={<IconChevronDownFill />} />
    </ControlChip.Toggle>
  );
}
```