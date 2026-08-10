file: components/chip-tabs.mdx

# Chip Tabs

Chip 형태로 표현된 탭 컴포넌트입니다. 카테고리나 필터를 선택하여 콘텐츠를 전환할 때 사용됩니다.

사용 가능 버전: @seed-design/react@0.0.1, @seed-design/css@0.0.1

## Preview

```tsx
import * as React from "react";
import { ChipTabsList, ChipTabsRoot, ChipTabsTrigger } from "seed-design/ui/chip-tabs";

export default function ChipTabsPreview() {
  const [value, setValue] = React.useState("1");
  return (
    <>
      <ChipTabsRoot
        variant="neutralSolid"
        defaultValue="1"
        value={value}
        onValueChange={(value) => setValue(value)}
      >
        <ChipTabsList>
          <ChipTabsTrigger value="1">라벨1</ChipTabsTrigger>
          <ChipTabsTrigger value="2">라벨2</ChipTabsTrigger>
          <ChipTabsTrigger value="3">라벨3</ChipTabsTrigger>
        </ChipTabsList>
      </ChipTabsRoot>
      {value === "1" && <div>content 1</div>}
      {value === "2" && <div>content 2</div>}
      {value === "3" && <div>content 3</div>}
    </>
  );
}
```

## Installation \[#installation]

- npm: npx @seed-design/cli@latest add ui:chip-tabs
- pnpm: pnpm dlx @seed-design/cli@latest add ui:chip-tabs
- yarn: yarn dlx @seed-design/cli@latest add ui:chip-tabs
- bun: bun x @seed-design/cli@latest add ui:chip-tabs

<ManualInstallation name="chip-tabs" />

## Props \[#props]

### `ChipTabsRoot` \[#chiptabsroot]

- `size`
  - type: `"medium" | "large" | undefined`
  - default: `"medium"`
- `variant`
  - type: `"neutralSolid" | "neutralOutline" | undefined`
  - default: `"neutralSolid"`
- `contentLayout`
  - type: `"fill" | "hug" | undefined`
  - default: `"hug"`
- `stickyList`
  - type: `boolean | undefined`
  - default: `false`
- `orientation`
  - type: `"horizontal" | "vertical" | undefined`
- `value`
  - type: `string | undefined`
- `defaultValue`
  - type: `string | undefined`
- `onValueChange`
  - type: `((value: string) => void) | undefined`
- `lazyMount`
  - type: `boolean | undefined`
  - default: `false`
  - description: If \`true\`, the component will be mounted lazily.
- `unmountOnExit`
  - type: `boolean | undefined`
  - default: `false`
  - description: If \`true\`, the component will be unmounted when it's not selected.
- `present`
  - type: `boolean | undefined`
  - default: `false`
  - description: If \`true\`, the component will be mounted.
- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.

### `ChipTabsList` \[#chiptabslist]

- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.

### `ChipTabsTrigger` \[#chiptabstrigger]

- `notification`
  - type: `boolean | undefined`
- `value`
  - type: `string`
  - required: `true`
- `disabled`
  - type: `boolean | undefined`

### `ChipTabsCarousel` \[#chiptabscarousel]

- `swipeable`
  - type: `boolean | undefined`
- `autoHeight`
  - type: `boolean | undefined`
- `loop`
  - type: `boolean | undefined`
- `dragThreshold`
  - type: `number | undefined`
- `onSettle`
  - type: `(() => void) | undefined`
- `onSwipeStart`
  - type: `(() => void) | undefined`
  - description: 스와이프 시작 시 호출됩니다.
- `onSwipeEnd`
  - type: `(() => void) | undefined`
  - description: 스와이프 종료 시 호출됩니다.

### `ChipTabsContent` \[#chiptabscontent]

- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.
- `value`
  - type: `string`
  - required: `true`

## Examples \[#examples]

### Size=Medium \[#sizemedium]

```tsx
import * as React from "react";
import { ChipTabsList, ChipTabsRoot, ChipTabsTrigger } from "seed-design/ui/chip-tabs";

export default function ChipTabsSizeMedium() {
  const [value, setValue] = React.useState("1");
  return (
    <>
      <ChipTabsRoot
        variant="neutralSolid"
        size="medium"
        defaultValue="1"
        value={value}
        onValueChange={(value) => setValue(value)}
      >
        <ChipTabsList>
          <ChipTabsTrigger value="1">라벨1</ChipTabsTrigger>
          <ChipTabsTrigger value="2">라벨2</ChipTabsTrigger>
          <ChipTabsTrigger value="3">라벨3</ChipTabsTrigger>
        </ChipTabsList>
      </ChipTabsRoot>
      {value === "1" && <div>content 1</div>}
      {value === "2" && <div>content 2</div>}
      {value === "3" && <div>content 3</div>}
    </>
  );
}
```

### Size=Large \[#sizelarge]

```tsx
import * as React from "react";
import { ChipTabsList, ChipTabsRoot, ChipTabsTrigger } from "seed-design/ui/chip-tabs";

export default function ChipTabsSizeLarge() {
  const [value, setValue] = React.useState("1");
  return (
    <>
      <ChipTabsRoot
        variant="neutralSolid"
        size="large"
        defaultValue="1"
        value={value}
        onValueChange={(value) => setValue(value)}
      >
        <ChipTabsList>
          <ChipTabsTrigger value="1">라벨1</ChipTabsTrigger>
          <ChipTabsTrigger value="2">라벨2</ChipTabsTrigger>
          <ChipTabsTrigger value="3">라벨3</ChipTabsTrigger>
        </ChipTabsList>
      </ChipTabsRoot>
      {value === "1" && <div>content 1</div>}
      {value === "2" && <div>content 2</div>}
      {value === "3" && <div>content 3</div>}
    </>
  );
}
```

### Variant=Neutral Solid \[#variantneutral-solid]

```tsx
import * as React from "react";
import { ChipTabsList, ChipTabsRoot, ChipTabsTrigger } from "seed-design/ui/chip-tabs";

export default function ChipTabsVariantNeutralSolid() {
  const [value, setValue] = React.useState("1");
  return (
    <>
      <ChipTabsRoot
        variant="neutralSolid"
        defaultValue="1"
        value={value}
        onValueChange={(value) => setValue(value)}
      >
        <ChipTabsList>
          <ChipTabsTrigger value="1">라벨1</ChipTabsTrigger>
          <ChipTabsTrigger value="2">라벨2</ChipTabsTrigger>
          <ChipTabsTrigger value="3">라벨3</ChipTabsTrigger>
        </ChipTabsList>
      </ChipTabsRoot>
      {value === "1" && <div>content 1</div>}
      {value === "2" && <div>content 2</div>}
      {value === "3" && <div>content 3</div>}
    </>
  );
}
```

### Variant=Neutral Outline \[#variantneutral-outline]

```tsx
import * as React from "react";
import { ChipTabsList, ChipTabsRoot, ChipTabsTrigger } from "seed-design/ui/chip-tabs";

export default function ChipTabsVariantNeutralOutline() {
  const [value, setValue] = React.useState("1");
  return (
    <>
      <ChipTabsRoot
        variant="neutralOutline"
        defaultValue="1"
        value={value}
        onValueChange={(value) => setValue(value)}
      >
        <ChipTabsList>
          <ChipTabsTrigger value="1">라벨1</ChipTabsTrigger>
          <ChipTabsTrigger value="2">라벨2</ChipTabsTrigger>
          <ChipTabsTrigger value="3">라벨3</ChipTabsTrigger>
        </ChipTabsList>
      </ChipTabsRoot>
      {value === "1" && <div>content 1</div>}
      {value === "2" && <div>content 2</div>}
      {value === "3" && <div>content 3</div>}
    </>
  );
}
```

### Notification \[#notification]

```tsx
import * as React from "react";
import { ChipTabsList, ChipTabsRoot, ChipTabsTrigger } from "seed-design/ui/chip-tabs";

export default function ChipTabsNotification() {
  const [value, setValue] = React.useState("1");
  return (
    <>
      <ChipTabsRoot
        variant="neutralOutline"
        size="medium"
        defaultValue="1"
        value={value}
        onValueChange={(value) => setValue(value)}
      >
        <ChipTabsList>
          <ChipTabsTrigger notification value="1">
            라벨1
          </ChipTabsTrigger>
          <ChipTabsTrigger value="2">라벨2</ChipTabsTrigger>
          <ChipTabsTrigger value="3">라벨3</ChipTabsTrigger>
        </ChipTabsList>
      </ChipTabsRoot>
      {value === "1" && <div>content 1</div>}
      {value === "2" && <div>content 2</div>}
      {value === "3" && <div>content 3</div>}
    </>
  );
}
```

### With Scroll Fog \[#with-scroll-fog]

탭이 많아 가로 스크롤이 필요한 경우 [Scroll Fog](/react/components/scroll-fog)를 적용하여 좌우 스크롤 힌트를 제공할 수 있습니다.

권장 padding인 `20px`을 유지해야 합니다.

```tsx
import { ScrollFog } from "@seed-design/react";
import {
  ChipTabsCarousel,
  ChipTabsList,
  ChipTabsRoot,
  ChipTabsTrigger,
} from "seed-design/ui/chip-tabs";

export default function ChipTabsWithScrollFog() {
  return (
    <div style={{ maxWidth: "360px" }}>
      <ChipTabsRoot variant="neutralSolid" defaultValue="1">
        <ChipTabsCarousel>
          <ScrollFog placement={["left", "right"]}>
            <ChipTabsList style={{ paddingLeft: "20px", paddingRight: "20px" }}>
              {Array.from({ length: 15 }, (_, i) => (
                <ChipTabsTrigger key={i + 1} value={String(i + 1)}>
                  라벨{i + 1}
                </ChipTabsTrigger>
              ))}
            </ChipTabsList>
          </ScrollFog>
        </ChipTabsCarousel>
      </ChipTabsRoot>
    </div>
  );
}
```