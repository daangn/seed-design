file: components/content-placeholder.mdx

# Content Placeholder

이미지나 콘텐츠가 로드되지 않았을 때, 해당 영역의 성격을 전달하는 대체 시각 요소입니다.

사용 가능 버전: @seed-design/react@1.2.8, @seed-design/css@1.2.6

## Preview

```tsx
import { ContentPlaceholder } from "seed-design/ui/content-placeholder";

export default function ContentPlaceholderPreview() {
  return <ContentPlaceholder style={{ width: 200, height: 200 }} />;
}
```

## Usage \[#usage]

## Installation \[#installation]

- npm: npx @seed-design/cli@latest add ui:content-placeholder
- pnpm: pnpm dlx @seed-design/cli@latest add ui:content-placeholder
- yarn: yarn dlx @seed-design/cli@latest add ui:content-placeholder
- bun: bun x @seed-design/cli@latest add ui:content-placeholder

<ManualInstallation name="content-placeholder" />

## Props \[#props]

- `type`
  - type: `"default" | "buySell" | "car" | "commerce" | "coupon" | "food" | "group" | "image" | "jobs" | "business" | "post" | "realty" | undefined`
  - default: `"default"`
- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.

## Examples \[#examples]

### Type Preset \[#type-preset]

`type`을 지정하여 미리 정의된 프리셋 아이콘과 배경을 사용할 수 있습니다. `type`을 지정하지 않는 경우 `"default"` 타입이 렌더링됩니다.

```tsx
import { HStack } from "@seed-design/react";
import { ContentPlaceholder } from "seed-design/ui/content-placeholder";

import { contentPlaceholderVariantMap } from "@seed-design/css/recipes/content-placeholder";

export default function ContentPlaceholderTypeExample() {
  return (
    <HStack gap="x3" wrap>
      {contentPlaceholderVariantMap.type.map((type) => (
        <ContentPlaceholder key={type} type={type} style={{ width: 120, height: 120 }} />
      ))}
    </HStack>
  );
}
```

### Sizes \[#sizes]

컴포넌트에 `width`와 `height`를 직접 지정하여 다양한 크기로 사용할 수 있습니다.

```tsx
import { HStack, VStack } from "@seed-design/react";
import { ContentPlaceholder } from "seed-design/ui/content-placeholder";

const sizes = [
  { label: "48x48", width: 48, height: 48 },
  { label: "200x80", width: 200, height: 80 },
  { label: "200x120", width: 200, height: 120 },
  { label: "200x50", width: 200, height: 50 },
  { label: "300x300", width: 300, height: 300 },
  { label: "320x200", width: 320, height: 200 },
  { label: "40x120", width: 40, height: 120 },
  { label: "40x40", width: 40, height: 40 },
];

export default function ContentPlaceholderSizes() {
  return (
    <HStack gap="x4" wrap align="flex-end">
      {sizes.map(({ label, width, height }) => (
        <VStack key={label} gap="x1" align="center">
          <ContentPlaceholder style={{ width, height }} />
          <span style={{ fontSize: 11, color: "#999" }}>{label}</span>
        </VStack>
      ))}
    </HStack>
  );
}
```

### Customizing Asset \[#customizing-asset]

- `children`을 전달하여 `type` 프리셋에 없는 아이콘을 사용할 수 있습니다.

```tsx
import {
  IconAppleFill,
  IconDiamondFill,
  IconSparkle2Fill,
} from "@karrotmarket/react-monochrome-icon";
import { HStack } from "@seed-design/react";
import { ContentPlaceholder } from "seed-design/ui/content-placeholder";

export default function ContentPlaceholderSvgExample() {
  return (
    <HStack gap="x3">
      <ContentPlaceholder style={{ width: 150, height: 150 }}>
        <IconAppleFill />
      </ContentPlaceholder>
      <ContentPlaceholder style={{ width: 100, height: 150 }}>
        <IconSparkle2Fill />
      </ContentPlaceholder>
      <ContentPlaceholder style={{ width: 200, height: 150 }}>
        <IconDiamondFill />
      </ContentPlaceholder>
    </HStack>
  );
}
```