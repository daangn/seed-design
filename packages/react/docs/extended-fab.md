file: components/(deprecated)/extended-fab.mdx

# Extended FAB



<Callout type="warn">
  더 이상 사용되지 않습니다. [Contextual Floating Button](/react/components/contextual-floating-button)을 사용하세요.
</Callout>

## Preview

```tsx
import { IconBellFill } from "@karrotmarket/react-monochrome-icon";
import { ExtendedFab, PrefixIcon } from "@seed-design/react";

export default function ExtendedFabPreview() {
  return (
    <ExtendedFab>
      <PrefixIcon svg={<IconBellFill />} />
      알림 설정
    </ExtendedFab>
  );
}
```

## Usage \[#usage]

```tsx
import { ExtendedFab, PrefixIcon } from "@seed-design/react";
import { IconPlusLine } from "@karrotmarket/react-monochrome-icon";
```

```tsx
<ExtendedFab>
  <PrefixIcon svg={<IconPlusLine />} />
  라벨
</ExtendedFab>
```

## Props \[#props]

- `variant`
  - type: `"neutralSolid" | "layerFloating" | undefined`
  - default: `"neutralSolid"`
- `size`
  - type: `"small" | "medium" | undefined`
  - default: `"medium"`
- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.

## Examples \[#examples]

### Medium \[#medium]

```tsx
import { IconBellFill } from "@karrotmarket/react-monochrome-icon";
import { ExtendedFab, PrefixIcon } from "@seed-design/react";

export default function ExtendedFabMedium() {
  return (
    <ExtendedFab size="medium">
      <PrefixIcon svg={<IconBellFill />} />
      알림 설정
    </ExtendedFab>
  );
}
```

### Small \[#small]

```tsx
import { IconBellFill } from "@karrotmarket/react-monochrome-icon";
import { ExtendedFab, PrefixIcon } from "@seed-design/react";

export default function ExtendedFabSmall() {
  return (
    <ExtendedFab size="small">
      <PrefixIcon svg={<IconBellFill />} />
      알림 설정
    </ExtendedFab>
  );
}
```

### Neutral Solid \[#neutral-solid]

```tsx
import { IconBellFill } from "@karrotmarket/react-monochrome-icon";
import { ExtendedFab, PrefixIcon } from "@seed-design/react";

export default function ExtendedFabNeutralSolid() {
  return (
    <ExtendedFab variant="neutralSolid">
      <PrefixIcon svg={<IconBellFill />} />
      알림 설정
    </ExtendedFab>
  );
}
```

### Layer Floating \[#layer-floating]

```tsx
import { IconBellFill } from "@karrotmarket/react-monochrome-icon";
import { ExtendedFab, PrefixIcon } from "@seed-design/react";

export default function ExtendedFabLayerFloating() {
  return (
    <ExtendedFab variant="layerFloating">
      <PrefixIcon svg={<IconBellFill />} />
      알림 설정
    </ExtendedFab>
  );
}
```