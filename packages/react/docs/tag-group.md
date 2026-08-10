file: components/tag-group.mdx

# Tag Group

아이콘과 텍스트 태그를 수평으로 나열해 여러 속성·상태·메타데이터를 한눈에 보여주는 정보 요약 컴포넌트입니다.

사용 가능 버전: @seed-design/react@1.0.6, @seed-design/css@1.0.6

## Preview

```tsx
import { IconLocationpinFill } from "@karrotmarket/react-monochrome-icon";
import { TagGroupRoot, TagGroupItem } from "seed-design/ui/tag-group";

export default function TagGroupPreview() {
  return (
    <TagGroupRoot>
      <TagGroupItem prefixIcon={<IconLocationpinFill />} label="500m" />
      <TagGroupItem label="서초4동" />
      <TagGroupItem label="3분 전" />
    </TagGroupRoot>
  );
}
```

## Installation \[#installation]

- npm: npx @seed-design/cli@latest add ui:tag-group
- pnpm: pnpm dlx @seed-design/cli@latest add ui:tag-group
- yarn: yarn dlx @seed-design/cli@latest add ui:tag-group
- bun: bun x @seed-design/cli@latest add ui:tag-group

<ManualInstallation name="tag-group" />

## Props \[#props]

### `TagGroupRoot` \[#taggrouproot]

- `separator`
  - type: `ReactNode`
- `size`
  - type: `"t2" | "t3" | "t4" | undefined`
  - default: `"t2"`
- `truncate`
  - type: `boolean | undefined`
  - default: `false`
- `weight`
  - type: `"regular" | "bold" | undefined`
  - default: `"regular"`
- `tone`
  - type: `"neutralSubtle" | "neutral" | "brand" | undefined`
  - default: `"neutralSubtle"`
- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.

### `TagGroupItem` \[#taggroupitem]

- `size`
  - type: `"t2" | "t3" | "t4" | undefined`
  - default: `"t2"`
- `weight`
  - type: `"regular" | "bold" | undefined`
  - default: `"regular"`
- `tone`
  - type: `"neutralSubtle" | "neutral" | "brand" | undefined`
  - default: `"neutralSubtle"`
- `flexShrink`
  - type: `true | 0 | (number & {}) | undefined`
  - description: If true, flex-shrink will be set to \`1\`.
- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.

## Examples \[#examples]

### Sizes \[#sizes]

```tsx
import { VStack } from "@seed-design/react";
import { TagGroupRoot, TagGroupItem } from "seed-design/ui/tag-group";

export default function TagGroupSizes() {
  return (
    <VStack gap="spacingY.componentDefault" align="center">
      <TagGroupRoot size="t2">
        <TagGroupItem label="t2" />
        <TagGroupItem label="t2" />
        <TagGroupItem label="t2" />
      </TagGroupRoot>
      <TagGroupRoot size="t3">
        <TagGroupItem label="t3" />
        <TagGroupItem label="t3" />
        <TagGroupItem label="t3" />
      </TagGroupRoot>
      <TagGroupRoot size="t4">
        <TagGroupItem label="t4" />
        <TagGroupItem label="t4" />
        <TagGroupItem label="t4" />
      </TagGroupRoot>
    </VStack>
  );
}
```

### Weights \[#weights]

```tsx
import { VStack } from "@seed-design/react";
import { TagGroupRoot, TagGroupItem } from "seed-design/ui/tag-group";

export default function TagGroupWeights() {
  return (
    <VStack gap="spacingY.componentDefault" align="center">
      <TagGroupRoot weight="regular">
        <TagGroupItem label="regular" />
        <TagGroupItem label="regular" />
        <TagGroupItem label="regular" />
      </TagGroupRoot>
      <TagGroupRoot weight="bold">
        <TagGroupItem label="bold" />
        <TagGroupItem label="bold" />
        <TagGroupItem label="bold" />
      </TagGroupRoot>
    </VStack>
  );
}
```

### Tones \[#tones]

```tsx
import { VStack } from "@seed-design/react";
import { TagGroupRoot, TagGroupItem } from "seed-design/ui/tag-group";

export default function TagGroupTones() {
  return (
    <VStack gap="spacingY.componentDefault" align="center">
      <TagGroupRoot tone="neutralSubtle">
        <TagGroupItem label="neutralSubtle" />
        <TagGroupItem label="neutralSubtle" />
        <TagGroupItem label="neutralSubtle" />
      </TagGroupRoot>
      <TagGroupRoot tone="neutral">
        <TagGroupItem label="neutral" />
        <TagGroupItem label="neutral" />
        <TagGroupItem label="neutral" />
      </TagGroupRoot>
      <TagGroupRoot tone="brand">
        <TagGroupItem label="brand" />
        <TagGroupItem label="brand" />
        <TagGroupItem label="brand" />
      </TagGroupRoot>
    </VStack>
  );
}
```

### With Icons \[#with-icons]

```tsx
import { IconLocationpinFill, IconMegaphoneFill } from "@karrotmarket/react-monochrome-icon";
import { VStack } from "@seed-design/react";
import { TagGroupRoot, TagGroupItem } from "seed-design/ui/tag-group";

export default function TagGroupWithIcons() {
  return (
    <VStack gap="spacingY.componentDefault" align="center">
      <TagGroupRoot>
        <TagGroupItem label="광고" suffixIcon={<IconMegaphoneFill />} />
        <TagGroupItem label="끌올 3시간 전" />
        <TagGroupItem label="서초4동" />
      </TagGroupRoot>
      <TagGroupRoot>
        <TagGroupItem prefixIcon={<IconLocationpinFill />} label="서초4동" />
        <TagGroupItem label="인증 5회" />
        <TagGroupItem label="3분 전" />
      </TagGroupRoot>
    </VStack>
  );
}
```

### Customizing `TagGroupItem` \[#customizing-taggroupitem]

`TagGroupRoot`에 지정한 `size`, `tone`, `weight`은 `TagGroupItem`에서 덮어씌울 수 있습니다.

필요한 경우 [컴파운드 컴포넌트](/react/components/concepts/snippet#compound-components)를 직접 사용하여 `TagGroupItem` 내부 요소를 커스터마이징할 수 있습니다.

```tsx
import {
  IconCheckmarkCircleFill,
  IconHeartFill,
  IconHorizline2VerticalChatbubbleRectangularRightFill,
  IconStarFill,
} from "@karrotmarket/react-monochrome-icon";
import { Icon, VStack } from "@seed-design/react";
import { TagGroupRoot, TagGroupItem } from "seed-design/ui/tag-group";
import { TagGroup as SeedTagGroup } from "@seed-design/react";

export default function TagGroupCustomizingItem() {
  return (
    <VStack gap="spacingY.componentDefault" align="center">
      <TagGroupRoot>
        {/* You can use the compound components to customize the items */}
        <SeedTagGroup.Item weight="bold" tone="neutral" aria-label="평점 4.5">
          <Icon svg={<IconStarFill />} color="fg.brand" />
          <SeedTagGroup.ItemLabel>4.5</SeedTagGroup.ItemLabel>
        </SeedTagGroup.Item>
        <TagGroupItem label="후기 37" />
        <TagGroupItem label="단골 12" />
      </TagGroupRoot>
      <TagGroupRoot tone="neutral">
        <TagGroupItem tone="brand" suffixIcon={<IconCheckmarkCircleFill />} label="인증됨" />
        <TagGroupItem aria-label="관심 10개" prefixIcon={<IconHeartFill />} label="10" />
        <TagGroupItem
          aria-label="댓글 3개"
          prefixIcon={<IconHorizline2VerticalChatbubbleRectangularRightFill />}
          label="3"
        />
      </TagGroupRoot>
    </VStack>
  );
}
```

### Customizing Separators \[#customizing-separators]

`TagGroupRoot`에 `separator`를 지정하여 구분 기호를 변경할 수 있습니다.

스크린 리더는 각 태그 항목 사이에 지정된 구분 기호를 읽지 않습니다. 의미가 있는(semantic) 정보를 Separator로 사용하는 것을 피하세요.

```tsx
import { VStack } from "@seed-design/react";
import { TagGroupRoot, TagGroupItem } from "seed-design/ui/tag-group";

export default function TagGroupCustomizingSeparators() {
  return (
    <VStack gap="spacingY.componentDefault" align="center">
      <TagGroupRoot separator=" | " size="t4">
        <TagGroupItem label="가" />
        <TagGroupItem label="나" />
        <TagGroupItem label="다" />
        <TagGroupItem label="라" />
      </TagGroupRoot>
      <TagGroupRoot separator=" " size="t4">
        <TagGroupItem label="가" />
        <TagGroupItem label="나" />
        <TagGroupItem label="다" />
        <TagGroupItem label="라" />
      </TagGroupRoot>
    </VStack>
  );
}
```

### Wrapping Behavior \[#wrapping-behavior]

기본적으로 `TagGroupRoot`는 컨테이너 너비를 초과하면 줄바꿈이 발생합니다.

`TagGroupRoot`에 `truncate` prop을 지정하면 `TagGroupRoot`가 한 줄로 유지되고, 컨테이너 너비를 초과하는 경우 기본적으로 모든 `TagGroupItem`의 레이블에서 말줄임이 발생할 수 있습니다.

`truncate` prop을 사용하면서 특정 아이템이 축소되지 않도록 하려면 해당 `TagGroupItem`에 `flexShrink={0}`을 지정하세요. `TagGroupItem`에 `flexShrink={number}`를 지정하여 컨테이너 너비를 초과할 때 축소되는 우선순위를 조정할 수 있습니다.

```tsx
import { IconBellFill, IconLocationpinFill } from "@karrotmarket/react-monochrome-icon";
import { Flex, Text, VStack } from "@seed-design/react";
import { TagGroupRoot, TagGroupItem } from "seed-design/ui/tag-group";
import type { PropsWithChildren, ReactNode } from "react";

export default function TagGroupWrappingBehavior() {
  return (
    <Flex
      align="center"
      justify="center"
      grow
      width="full"
      bg="bg.layerBasement"
      borderRadius="r2"
      p="x4"
    >
      <VStack
        gap="x2"
        width="350px"
        maxWidth="max-content"
        overflowX="auto"
        style={{ resize: "horizontal" }}
      >
        <Wrapper title="default (wrap)">
          <TagGroupRoot>
            <TagGroupItem prefixIcon={<IconLocationpinFill />} label="부산광역시 해운대구" />
            <TagGroupItem prefixIcon={<IconBellFill />} label="123 456 789 012 345" />
            <TagGroupItem label="Ut minim laboris enim" />
          </TagGroupRoot>
        </Wrapper>
        <Wrapper title="truncate">
          <TagGroupRoot truncate>
            <TagGroupItem prefixIcon={<IconLocationpinFill />} label="부산광역시 해운대구" />
            <TagGroupItem prefixIcon={<IconBellFill />} label="123 456 789 012 345" />
            <TagGroupItem label="Ut minim laboris enim" />
          </TagGroupRoot>
        </Wrapper>
        <Wrapper title="truncate, keep one fixed">
          <TagGroupRoot truncate>
            <TagGroupItem prefixIcon={<IconLocationpinFill />} label="부산광역시 해운대구" />
            <TagGroupItem
              flexShrink={0}
              prefixIcon={<IconBellFill />}
              label="123 456 789 012 345"
            />
            <TagGroupItem label="Ut minim laboris enim" />
          </TagGroupRoot>
        </Wrapper>
        <Wrapper title="truncate, mixed shrink ratios">
          <TagGroupRoot truncate>
            <TagGroupItem
              prefixIcon={<IconLocationpinFill />}
              flexShrink={1}
              label="부산광역시 해운대구"
            />
            <TagGroupItem
              flexShrink={100}
              prefixIcon={<IconBellFill />}
              label="123 456 789 012 345"
            />
            <TagGroupItem flexShrink={100} label="Ut minim laboris enim" />
          </TagGroupRoot>
        </Wrapper>
      </VStack>
    </Flex>
  );
}

function Wrapper({ title, children }: PropsWithChildren<{ title: ReactNode }>) {
  return (
    <VStack
      align="flex-start"
      justify="center"
      padding="x3"
      bg="bg.layerDefault"
      borderRadius="r2"
      borderWidth={1}
      borderColor="stroke.neutralWeak"
      gap="x1"
      overflowX="hidden"
    >
      <Text textStyle="t2Medium">{title}</Text>
      {children}
    </VStack>
  );
}
```