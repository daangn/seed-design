file: components/skeleton.mdx

# Skeleton

콘텐츠가 로딩되는 동안 이후 나타날 요소의 윤곽을 미리 보여주어 로딩 시간을 짧게 느끼게 하는 UI 요소입니다.

사용 가능 버전: @seed-design/react@0.0.1, @seed-design/css@0.0.1

## Preview

```tsx
import { Skeleton, VStack } from "@seed-design/react";

export default function SkeletonPreview() {
  return (
    <VStack gap="x4" align="center">
      <Skeleton radius="full" width="x12" height="x12" />
      <VStack direction="column" gap="x2">
        <Skeleton radius="8" height="x4" width="250px" />
        <Skeleton radius="8" height="x4" width="250px" />
      </VStack>
    </VStack>
  );
}
```

## Usage \[#usage]

```tsx
import { Skeleton } from "@seed-design/react";
```

```tsx
<Skeleton />
```

## Props \[#props]

- `radius`
  - type: `"0" | "8" | "16" | "full" | undefined`
  - default: `8`
  - description: - \`0\`: 기본값입니다. - \`8\`: 텍스트 콘텐츠에 사용합니다. - \`16\`: 카드 및 썸네일에 사용합니다. - \`full\`: Avatar(원형) 콘텐츠에 사용합니다.
- `tone`
  - type: `"neutral" | "magic" | undefined`
  - default: `"neutral"`
  - description: - \`neutral\`: 데이터를 불러오는 일반적인 로딩 경험에 사용합니다. - \`magic\`: AI 기능이 활성화되었을 때 사용합니다.
- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.
- `height`
  - type: `ResponsiveValue<"full" | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {})> | undefined`
- `width`
  - type: `ResponsiveValue<"full" | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {})> | undefined`

## Examples \[#examples]

### Radius \[#radius]

```tsx
import { Flex, Skeleton } from "@seed-design/react";

export default function SkeletonRadius() {
  return (
    <Flex gap="x4" align="center">
      <Skeleton radius="0" width="x12" height="x12" />
      <Skeleton radius="8" width="x12" height="x12" />
      <Skeleton radius="16" width="x12" height="x12" />
      <Skeleton radius="full" width="x12" height="x12" />
    </Flex>
  );
}
```

### Tone \[#tone]

```tsx
import { Box, Skeleton, VStack } from "@seed-design/react";

export default function SkeletonTone() {
  return (
    <VStack gap="x4" alignItems="flex-start" width="full">
      <Skeleton tone="neutral" radius="16" width="full" height="x12" />
      <Skeleton tone="magic" radius="16" width="full" height="x12" />
    </VStack>
  );
}
```