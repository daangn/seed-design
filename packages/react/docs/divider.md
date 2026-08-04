file: components/divider.mdx

# Divider

시각적 구분자로써 역할을 하며, 콘텐츠 간의 구획을 명확히 나누는 데 사용하는 컴포넌트입니다.

사용 가능 버전: @seed-design/react@0.0.14, @seed-design/css@0.0.14

## Preview

```tsx
import { Box, Divider, VStack } from "@seed-design/react";

export default function DividerPreview() {
  return (
    <VStack width="full" bg="bg.layerDefault" p="x4">
      <Box p="x4">
        Nisi elit pariatur incididunt quis fugiat mollit ipsum fugiat duis culpa esse incididunt
        cupidatat.
      </Box>
      <Divider />
      <Box p="x4">Consectetur voluptate quis do culpa et culpa.</Box>
    </VStack>
  );
}
```

## Props \[#props]

- `as`
  - type: `"hr" | "div" | "li" | undefined`
  - default: `"hr"`
  - description: The HTML element to use for the divider. Keep in mind that "hr" elements are read by screen readers as a semantic break with an implicit role="separator" If the element should be read by screen readers but be rendered as an element other than "hr", give an explicit role="separator"
- `color`
  - type: `ScopedColorStroke | ScopedColorPalette | (string & {}) | undefined`
  - default: `"stroke.neutralMuted"`
- `thickness`
  - type: `0 | (string & {}) | 1 | undefined`
  - default: `1`
- `orientation`
  - type: `"horizontal" | "vertical" | undefined`
  - default: `"horizontal"`
- `inset`
  - type: `boolean | undefined`
  - default: `false`

## Usage \[#usage]

```tsx
import { Divider } from "@seed-design/react";
```

```
<Divider />
```

## Screen Reader Behavior \[#screen-reader-behavior]

Divider는 기본적으로 `<hr />`을 렌더링합니다. `<hr />`은 의미를 가진(semantic) 구분선이며, 스크린 리더 역시 해당 요소를 "수평(수직) 분할선"으로 읽습니다.

Divider가 의미를 가지지 않은 장식적 요소라면, `as` prop을 활용해 `<div>` 등으로 렌더링하여 스크린 리더가 해당 요소를 읽지 않도록 해야 합니다.

반대로, Divider를 `<li>` 등 `<hr />`이 아닌 요소로 렌더링해야 하는 상황에서, 스크린 리더가 해당 요소를 읽어야 한다면, `role="separator"`를 명시적으로 지정해야 합니다.

## Examples \[#examples]

### Orientation \[#orientation]

```tsx
import { Box, Divider, HStack, VStack } from "@seed-design/react";

export default function DividerOrientation() {
  return (
    <VStack width="full" gap="x4">
      <VStack flexGrow bg="bg.layerDefault" gap="x4">
        <Box bg="palette.blue400" height="x8" />
        <Divider />
        <Box bg="palette.blue400" height="x8" />
      </VStack>
      <HStack flexGrow bg="bg.layerDefault" gap="x4" height="x16">
        <Box bg="palette.blue400" flexGrow />
        <Divider orientation="vertical" />
        <Box bg="palette.blue400" flexGrow />
      </HStack>
    </VStack>
  );
}
```

### Inset \[#inset]

```tsx
import { Box, Divider, HStack, VStack } from "@seed-design/react";

export default function DividerInset() {
  return (
    <VStack width="full" gap="x4">
      <VStack flexGrow bg="bg.layerDefault" gap="x4">
        <Box bg="palette.blue400" height="x8" />
        <Divider inset />
        <Box bg="palette.blue400" height="x8" />
      </VStack>
      <HStack flexGrow bg="bg.layerDefault" gap="x4" height="x16">
        <Box bg="palette.blue400" flexGrow />
        <Divider orientation="vertical" inset />
        <Box bg="palette.blue400" flexGrow />
      </HStack>
    </VStack>
  );
}
```