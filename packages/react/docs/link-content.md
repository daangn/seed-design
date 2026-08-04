file: components/(deprecated)/link-content.mdx

# Link Content



<Callout type="warn">
  더 이상 사용되지 않습니다. [Action Button](/react/components/action-button)에 `variant="ghost"`를 사용하세요.
</Callout>

## Preview

```tsx
import { IconChevronRightLine } from "@karrotmarket/react-monochrome-icon";
import { LinkContent, SuffixIcon } from "@seed-design/react";

export default function LinkContentPreview() {
  return (
    <LinkContent>
      새 글
      <SuffixIcon svg={<IconChevronRightLine />} />
    </LinkContent>
  );
}
```

## Usage \[#usage]

```tsx
import { LinkContent, SuffixIcon } from "@seed-design/react";
import { IconChevronRightLine } from "@karrotmarket/react-monochrome-icon";
```

```tsx
<LinkContent>
  Label
  <SuffixIcon svg={<IconChevronRightLine />} />
</LinkContent>
```

## Props \[#props]

- `weight`
  - type: `"bold" | "regular" | undefined`
  - default: `"regular"`
- `size`
  - type: `"t6" | "t5" | "t4" | undefined`
  - default: `"t4"`
- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.
- `color`
  - type: `ScopedColorFg | ScopedColorPalette | (string & {}) | undefined`

## Examples \[#examples]

### Size \[#size]

```tsx
import { IconChevronRightLine } from "@karrotmarket/react-monochrome-icon";
import { LinkContent, SuffixIcon, VStack } from "@seed-design/react";

export default function LinkContentSize() {
  return (
    <VStack>
      <LinkContent size="t4">
        추가
        <SuffixIcon svg={<IconChevronRightLine />} />
      </LinkContent>
      <LinkContent size="t5">
        추가
        <SuffixIcon svg={<IconChevronRightLine />} />
      </LinkContent>
      <LinkContent size="t6">
        추가
        <SuffixIcon svg={<IconChevronRightLine />} />
      </LinkContent>
    </VStack>
  );
}
```

### Color \[#color]

```tsx
import { IconChevronRightLine } from "@karrotmarket/react-monochrome-icon";
import { LinkContent, VStack, SuffixIcon } from "@seed-design/react";

export default function LinkContentColor() {
  return (
    <VStack>
      <LinkContent color="fg.neutral">
        더보기
        <SuffixIcon svg={<IconChevronRightLine />} />
      </LinkContent>
      <LinkContent color="fg.neutralSubtle">
        더보기
        <SuffixIcon svg={<IconChevronRightLine />} />
      </LinkContent>
      <LinkContent color="fg.brand">
        더보기
        <SuffixIcon svg={<IconChevronRightLine />} />
      </LinkContent>
      <LinkContent color="fg.informative">
        더보기
        <SuffixIcon svg={<IconChevronRightLine />} />
      </LinkContent>
    </VStack>
  );
}
```