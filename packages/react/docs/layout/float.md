file: components/(foundation)/layout/float.mdx

# Float

Float 컴포넌트는 특정 위치에 고정된 요소를 배치할 때 사용합니다.

## Preview

```tsx
import { Box, Float } from "@seed-design/react";
import { ContextualFloatingButton } from "seed-design/ui/contextual-floating-button";

export default function FloatPreview() {
  return (
    <Box
      position="relative"
      width="480px"
      height="480px"
      borderWidth={1}
      borderColor="stroke.neutralMuted"
    >
      <Float placement="top-start">
        <ContextualFloatingButton>Top Start</ContextualFloatingButton>
      </Float>
      <Float placement="top-center">
        <ContextualFloatingButton>Top Center</ContextualFloatingButton>
      </Float>
      <Float placement="top-end">
        <ContextualFloatingButton>Top End</ContextualFloatingButton>
      </Float>
      <Float placement="middle-start">
        <ContextualFloatingButton>Middle Start</ContextualFloatingButton>
      </Float>
      <Float placement="middle-center">
        <ContextualFloatingButton>Middle Center</ContextualFloatingButton>
      </Float>
      <Float placement="middle-end">
        <ContextualFloatingButton>Middle End</ContextualFloatingButton>
      </Float>
      <Float placement="bottom-start">
        <ContextualFloatingButton>Bottom Start</ContextualFloatingButton>
      </Float>
      <Float placement="bottom-center">
        <ContextualFloatingButton>Bottom Center</ContextualFloatingButton>
      </Float>
      <Float placement="bottom-end">
        <ContextualFloatingButton>Bottom End</ContextualFloatingButton>
      </Float>
    </Box>
  );
}
```

## Props \[#props]

- `as`
  - type: `React.ElementType<any, keyof React.JSX.IntrinsicElements> | undefined`
- `placement`
  - type: `"bottom-end" | "bottom-start" | "top-end" | "top-start" | "bottom-center" | "top-center" | "middle-center" | "middle-end" | "middle-start"`
  - required: `true`
- `offsetX`
  - type: `0 | Dimension | (string & {}) | undefined`
  - default: `0`
- `offsetY`
  - type: `0 | Dimension | (string & {}) | undefined`
  - default: `0`
- `zIndex`
  - type: `number | (string & {}) | undefined`

## Examples \[#examples]

### Offset X \[#offset-x]

`offsetX` 속성을 사용하면 좌우 방향으로 위치를 조정할 수 있습니다.

`start`, `middle`에서는 우측 방향으로 조정되고, `end`에서는 좌측 방향으로 조정됩니다.

```tsx
import { Box, Float } from "@seed-design/react";
import { ContextualFloatingButton } from "seed-design/ui/contextual-floating-button";

export default function FloatOffsetX() {
  return (
    <Box
      position="relative"
      width="480px"
      height="480px"
      borderWidth={1}
      borderColor="stroke.neutralMuted"
    >
      <Float placement="middle-start" offsetX="x4">
        <ContextualFloatingButton>Middle Start</ContextualFloatingButton>
      </Float>
      <Float placement="middle-center" offsetX="x4">
        <ContextualFloatingButton>Middle Center</ContextualFloatingButton>
      </Float>
      <Float placement="middle-end" offsetX="x4">
        <ContextualFloatingButton>Middle End</ContextualFloatingButton>
      </Float>
    </Box>
  );
}
```

### Offset Y \[#offset-y]

`offsetY` 속성을 사용하면 상하 방향으로 위치를 조정할 수 있습니다.

`top`, `middle`에서는 하측 방향으로 조정되고, `bottom`에서는 상측 방향으로 조정됩니다.

```tsx
import { Box, Float } from "@seed-design/react";
import { ContextualFloatingButton } from "seed-design/ui/contextual-floating-button";

export default function FloatOffsetY() {
  return (
    <Box
      position="relative"
      width="480px"
      height="480px"
      borderWidth={1}
      borderColor="stroke.neutralMuted"
    >
      <Float placement="top-center" offsetY="x4">
        <ContextualFloatingButton>Top Center</ContextualFloatingButton>
      </Float>
      <Float placement="middle-center" offsetY="x4">
        <ContextualFloatingButton>Middle Center</ContextualFloatingButton>
      </Float>
      <Float placement="bottom-center" offsetY="x4">
        <ContextualFloatingButton>Bottom Center</ContextualFloatingButton>
      </Float>
    </Box>
  );
}
```