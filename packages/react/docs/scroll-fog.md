file: components/scroll-fog.mdx

# Scroll Fog

스크롤 가능한 영역에서 사용자에게 추가 콘텐츠가 있음을 시각적으로 알려주는 힌트 역할을 합니다.

사용 가능 버전: @seed-design/react@1.1.3, @seed-design/css@1.1.3

## Preview

```tsx
import { Box, ScrollFog, VStack } from "@seed-design/react";

export default function ScrollFogPreview() {
  return (
    <div
      style={{
        height: "200px",
        width: "300px",
        border: "1px solid var(--seed-color-stroke-neutral-weak)",
        borderRadius: "8px",
      }}
    >
      <ScrollFog placement={["top", "bottom"]}>
        <VStack gap="x4" px="x4" py="20px" width="full">
          {Array.from({ length: 20 }, (_, i) => (
            <Box key={i} bg="gray" px="x4" py="x3" borderRadius="r2">
              {i + 1}
            </Box>
          ))}
        </VStack>
      </ScrollFog>
    </div>
  );
}
```

해당 Scroll Fog 컴포넌트는 [Chakra ScrollArea](https://chakra-ui.com/components/scroll-area),
[Radix ScrollArea](https://www.radix-ui.com/primitives/components/scroll-area),
[Base UI ScrollArea](https://base-ui.com/react/components/scroll-area) 보다는 더 간단한 스크롤 힌트만을 위한 컴포넌트입니다.
이후 스크롤바에 대한 기능이 추가적으로 필요하다면 확장될 수 있습니다.

## Usage \[#usage]

```tsx
import { ScrollFog } from "@seed-design/react";
```

```tsx
<div style={{ height: "300px" }}>
  <ScrollFog>
    {/* 스크롤 가능한 콘텐츠 */}
    <div style={{ padding: "20px 0" }}>Content</div>
  </ScrollFog>
</div>
```

## Props \[#props]

### Scroll Fog \[#scroll-fog]

- `placement`
  - type: `ScrollPlacement[] | undefined`
  - default: `["top", "bottom"]`
  - description: Placement of fog effect
- `size`
  - type: `number | undefined`
  - default: `20`
  - description: Size of the fog effect in pixels
- `sizes`
  - type: `SizesConfig | undefined`
  - description: Size of the fog effect for each direction in pixels
- `hideScrollBar`
  - type: `boolean | undefined`
  - default: `false`

## Examples \[#examples]

### Padding \[#padding]

ScrollFog는 항상 fog 효과를 표시하므로, 지정된 방향에 충분한 padding이 필요합니다.

- **최소 padding**: 20px을 유지해야 합니다.
- **화면 전체 차지하는 세로 스크롤**: 하단 80px, 상단 20px padding 권장
- **가로 스크롤**: 20px 좌우 padding 권장

```tsx
// 상하 스크롤 - 상하 padding 필요
<ScrollFog placement={["top", "bottom"]}>
  <div style={{ padding: "20px 0 80px 0" }}>Content</div>
</ScrollFog>

// 좌우 스크롤 - 좌우 padding 필요
<ScrollFog placement={["left", "right"]}>
  <div style={{ padding: "0 20px" }}>Content</div>
</ScrollFog>
```

- [Bottom Sheet - 하단 80px, 상단 20px padding](/react/components/bottom-sheet#with-scroll-fog)
- [Chip Tabs - 20px 좌우 padding](/react/components/chip-tabs#with-scroll-fog)

### Horizontal Scroll \[#horizontal-scroll]

가로 스크롤이 필요한 경우 `placement={["left", "right"]}`를 사용하여 좌우 fog 효과를 적용할 수 있습니다.
좌우 20px의 padding을 제공하여 컨텐츠가 잘리지 않도록 해야 합니다.

```tsx
import { HStack, ScrollFog } from "@seed-design/react";

export default function ScrollFogHorizontal() {
  return (
    <div
      style={{
        border: "1px solid var(--seed-color-stroke-neutral-weak)",
        borderRadius: "8px",
        width: "300px",
      }}
    >
      <ScrollFog placement={["left", "right"]}>
        <HStack gap="x3" px="20px" py="x4" style={{ width: "max-content" }}>
          {Array.from({ length: 15 }, (_, i) => (
            <div
              key={i}
              style={{
                minWidth: "120px",
                padding: "20px",
                backgroundColor: "gray",
                borderRadius: "4px",
                textAlign: "center",
              }}
            >
              {i + 1}
            </div>
          ))}
        </HStack>
      </ScrollFog>
    </div>
  );
}
```

### Size \[#size]

`size` 속성을 이용해 스크롤 효과의 크기를 조절할 수 있습니다. `sizes` 속성을 이용해 각 방향별 크기를 조절할 수 있습니다.

```tsx
import { ScrollFog } from "@seed-design/react";

export default function ScrollFogSize() {
  return (
    <div
      style={{
        maxWidth: "400px",
        height: "300px",
        border: "1px solid var(--seed-color-stroke-neutral-weak)",
        borderRadius: "8px",
      }}
    >
      <ScrollFog size={40} placement={["top", "bottom", "left", "right"]}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(10, 100px)",
            gap: "12px",
            padding: "16px",
          }}
        >
          {Array.from({ length: 100 }, (_, i) => (
            <div
              key={i}
              style={{
                width: "100px",
                height: "100px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "gray",
                borderRadius: "4px",
                fontSize: "14px",
              }}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </ScrollFog>
    </div>
  );
}
```

```tsx
import { ScrollFog } from "@seed-design/react";

export default function ScrollFogSize() {
  return (
    <div
      style={{
        maxWidth: "400px",
        height: "300px",
        border: "1px solid var(--seed-color-stroke-neutral-weak)",
        borderRadius: "8px",
      }}
    >
      <ScrollFog
        sizes={{
          top: 100,
          bottom: 10,
          left: 50,
          right: 50,
        }}
        placement={["top", "bottom", "left", "right"]}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(10, 100px)",
            gap: "12px",
            padding: "16px",
          }}
        >
          {Array.from({ length: 100 }, (_, i) => (
            <div
              key={i}
              style={{
                width: "100px",
                height: "100px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "gray",
                borderRadius: "4px",
                fontSize: "14px",
              }}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </ScrollFog>
    </div>
  );
}
```

### All Directions \[#all-directions]

2D 스크롤이 필요한 경우 `placement={["top", "bottom", "left", "right"]}`를 사용하여 모든 방향에 fog 효과를 적용할 수 있습니다.

```tsx
import { ScrollFog } from "@seed-design/react";

export default function ScrollFogAllDirections() {
  return (
    <div
      style={{
        maxWidth: "400px",
        height: "300px",
        border: "1px solid var(--seed-color-stroke-neutral-weak)",
        borderRadius: "8px",
      }}
    >
      <ScrollFog placement={["top", "bottom", "left", "right"]}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(10, 100px)",
            gap: "12px",
            padding: "20px",
          }}
        >
          {Array.from({ length: 100 }, (_, i) => (
            <div
              key={i}
              style={{
                width: "100px",
                height: "100px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "gray",
                borderRadius: "4px",
                fontSize: "14px",
              }}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </ScrollFog>
    </div>
  );
}
```

### Hide Scrollbar \[#hide-scrollbar]

`hideScrollBar` 속성을 이용해 스크롤바를 숨길 수 있습니다.

```tsx
import { ScrollFog } from "@seed-design/react";

export default function ScrollFogHideScrollbar() {
  return (
    <div
      style={{
        maxWidth: "400px",
        height: "300px",
        border: "1px solid var(--seed-color-stroke-neutral-weak)",
        borderRadius: "8px",
      }}
    >
      <ScrollFog hideScrollBar placement={["top", "bottom", "left", "right"]}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(10, 100px)",
            gap: "12px",
            padding: "20px",
          }}
        >
          {Array.from({ length: 100 }, (_, i) => (
            <div
              key={i}
              style={{
                width: "100px",
                height: "100px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "gray",
                borderRadius: "4px",
                fontSize: "14px",
              }}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </ScrollFog>
    </div>
  );
}
```