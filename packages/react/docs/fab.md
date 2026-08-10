file: components/(deprecated)/fab.mdx

# FAB



<Callout type="warn">
  더 이상 사용되지 않습니다. [Contextual Floating Button](/react/components/contextual-floating-button)을 사용하세요.
</Callout>

## Preview

```tsx
import IconPlusLine from "@karrotmarket/react-monochrome-icon/IconPlusLine";
import { Fab, Icon } from "@seed-design/react";

export default function FabPreview() {
  return (
    <Fab aria-label="Example FAB">
      <Icon svg={<IconPlusLine />} />
    </Fab>
  );
}
```

## Usage \[#usage]

```tsx
import { Fab, Icon } from "@seed-design/react";
import { IconPlusLine } from "@karrotmarket/react-monochrome-icon";
```

```tsx
<Fab>
  <Icon svg={<IconPlusLine />} />
</Fab>
```

## Props \[#props]

- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.