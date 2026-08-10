file: components/(deprecated)/action-chip.mdx

# Action Chip



<Callout type="warn">
  더 이상 사용되지 않습니다. [Chip](/react/components/chip)의 `Chip.Button`에 `variant="solid"`를 사용하세요.
</Callout>

## Preview

```tsx
import { ActionChip } from "@seed-design/react";

export default function ActionChipPreview() {
  return <ActionChip>라벨</ActionChip>;
}
```

## Usage \[#usage]

```tsx
import { ActionChip } from "@seed-design/react";
```

```tsx
<ActionChip />
```

## Props \[#props]

- `size`
  - type: `"medium" | "small" | undefined`
  - default: `"medium"`
- `layout`
  - type: `"withText" | "iconOnly" | undefined`
  - default: `"withText"`
- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.

## Examples \[#examples]

### Medium \[#medium]

```tsx
import { ActionChip } from "@seed-design/react";

export default function ActionChipMedium() {
  return <ActionChip size="medium">라벨</ActionChip>;
}
```

### Small \[#small]

```tsx
import { ActionChip } from "@seed-design/react";

export default function ActionChipSmall() {
  return <ActionChip size="small">라벨</ActionChip>;
}
```

### Icon Only \[#icon-only]

```tsx
import { IconPlusFill } from "@karrotmarket/react-monochrome-icon";
import { ActionChip, Icon } from "@seed-design/react";

export default function ActionChipIconOnly() {
  return (
    <ActionChip layout="iconOnly" aria-label="추가">
      <Icon svg={<IconPlusFill />} />
    </ActionChip>
  );
}
```

### Prefix Icon \[#prefix-icon]

```tsx
import { IconPlusFill } from "@karrotmarket/react-monochrome-icon";
import { ActionChip, PrefixIcon } from "@seed-design/react";

export default function ActionChipPrefixIcon() {
  return (
    <ActionChip>
      <PrefixIcon svg={<IconPlusFill />} />
      라벨
    </ActionChip>
  );
}
```

### Suffix Icon \[#suffix-icon]

```tsx
import { IconChevronDownFill } from "@karrotmarket/react-monochrome-icon";
import { ActionChip, SuffixIcon } from "@seed-design/react";

export default function ActionChipSuffixIcon() {
  return (
    <ActionChip>
      라벨
      <SuffixIcon svg={<IconChevronDownFill />} />
    </ActionChip>
  );
}
```