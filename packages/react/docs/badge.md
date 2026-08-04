file: components/badge.mdx

# Badge

객체의 속성이나 상태를 시각적으로 표현하는 작은 텍스트 라벨입니다. 사용자의 주의를 끌고 콘텐츠의 빠른 인지와 탐색을 돕기 위해 사용됩니다.

사용 가능 버전: @seed-design/react@0.0.1, @seed-design/css@0.0.1

## Preview

```tsx
import { Badge } from "@seed-design/react";

export default function BadgePreview() {
  return <Badge>라벨</Badge>;
}
```

## Usage \[#usage]

```tsx
import { Badge } from "@seed-design/react";
```

```tsx
<Badge>Badge</Badge>
```

## Props \[#props]

- `size`
  - type: `"medium" | "large" | undefined`
  - default: `"medium"`
- `variant`
  - type: `"weak" | "solid" | "outline" | undefined`
  - default: `"solid"`
  - description: - \`weak\`: 반복적인 구조를 가진 환경에서 사용합니다. 배경색이 있는 경우에는 권장하지 않습니다. - \`solid\`: 배경이 복잡하거나 이미지 위에 Badge가 겹치는 경우 사용합니다. - \`outline\`: 중간 정도의 주목도가 필요한 본문 또는 상세 화면에서 사용합니다.
- `tone`
  - type: `"neutral" | "brand" | "informative" | "positive" | "warning" | "critical" | undefined`
  - default: `"neutral"`
  - description: - \`neutral\`: 상태가 특별히 없거나, 상태값이 명확하지 않은 초기 상태 - \`informative\`: 베타 기능 안내, 사용자 권한 제한, 정보 기반 메시지 - \`positive\`: 완료, 적용됨, 승인됨, 발행됨, 저장 성공, 검토 통과 - \`warning\`: 만료 임박, 제출 누락, 필수 정보 부족 등 잠재적 문제 상태 - \`critical\`: 검수 거절, 제재 상태, 편집 불가, 유효성 검증 실패
- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.

## Examples \[#examples]

### Truncating Behavior \[#truncating-behavior]

Badge는 긴 텍스트를 잘라내고 생략 부호를 표시합니다.

```tsx
import { Badge, VStack } from "@seed-design/react";

export default function BadgeTruncating() {
  return (
    <VStack gap="x4">
      <Badge size="medium">
        In velit velit deserunt amet veniam incididunt consectetur incididunt Lorem.
      </Badge>
      <Badge size="large">
        In velit velit deserunt amet veniam incididunt consectetur incididunt Lorem.
      </Badge>
    </VStack>
  );
}
```

### Tones and Variants \[#tones-and-variants]

#### Neutral \[#neutral]

```tsx
import { Badge, HStack, VStack } from "@seed-design/react";

export default function BadgeNeutral() {
  return (
    <HStack gap="x4">
      <VStack gap="x4">
        <Badge tone="neutral" variant="solid" size="medium">
          라벨
        </Badge>
        <Badge tone="neutral" variant="weak" size="medium">
          라벨
        </Badge>
        <Badge tone="neutral" variant="outline" size="medium">
          라벨
        </Badge>
      </VStack>
      <VStack gap="x4">
        <Badge tone="neutral" variant="solid" size="large">
          라벨
        </Badge>
        <Badge tone="neutral" variant="weak" size="large">
          라벨
        </Badge>
        <Badge tone="neutral" variant="outline" size="large">
          라벨
        </Badge>
      </VStack>
    </HStack>
  );
}
```

#### Brand \[#brand]

```tsx
import { Badge, HStack, VStack } from "@seed-design/react";

export default function BadgeBrand() {
  return (
    <HStack gap="x4">
      <VStack gap="x4">
        <Badge tone="brand" variant="solid" size="medium">
          라벨
        </Badge>
        <Badge tone="brand" variant="weak" size="medium">
          라벨
        </Badge>
        <Badge tone="brand" variant="outline" size="medium">
          라벨
        </Badge>
      </VStack>
      <VStack gap="x4">
        <Badge tone="brand" variant="solid" size="large">
          라벨
        </Badge>
        <Badge tone="brand" variant="weak" size="large">
          라벨
        </Badge>
        <Badge tone="brand" variant="outline" size="large">
          라벨
        </Badge>
      </VStack>
    </HStack>
  );
}
```

#### Informative \[#informative]

```tsx
import { Badge, HStack, VStack } from "@seed-design/react";

export default function BadgeInformative() {
  return (
    <HStack gap="x4">
      <VStack gap="x4">
        <Badge tone="informative" variant="solid" size="medium">
          라벨
        </Badge>
        <Badge tone="informative" variant="weak" size="medium">
          라벨
        </Badge>
        <Badge tone="informative" variant="outline" size="medium">
          라벨
        </Badge>
      </VStack>
      <VStack gap="x4">
        <Badge tone="informative" variant="solid" size="large">
          라벨
        </Badge>
        <Badge tone="informative" variant="weak" size="large">
          라벨
        </Badge>
        <Badge tone="informative" variant="outline" size="large">
          라벨
        </Badge>
      </VStack>
    </HStack>
  );
}
```

#### Positive \[#positive]

```tsx
import { Badge, HStack, VStack } from "@seed-design/react";

export default function BadgePositive() {
  return (
    <HStack gap="x4">
      <VStack gap="x4">
        <Badge tone="positive" variant="solid" size="medium">
          라벨
        </Badge>
        <Badge tone="positive" variant="weak" size="medium">
          라벨
        </Badge>
        <Badge tone="positive" variant="outline" size="medium">
          라벨
        </Badge>
      </VStack>
      <VStack gap="x4">
        <Badge tone="positive" variant="solid" size="large">
          라벨
        </Badge>
        <Badge tone="positive" variant="weak" size="large">
          라벨
        </Badge>
        <Badge tone="positive" variant="outline" size="large">
          라벨
        </Badge>
      </VStack>
    </HStack>
  );
}
```

#### Warning \[#warning]

```tsx
import { Badge, HStack, VStack } from "@seed-design/react";

export default function BadgeWarning() {
  return (
    <HStack gap="x4">
      <VStack gap="x4">
        <Badge tone="warning" variant="solid" size="medium">
          라벨
        </Badge>
        <Badge tone="warning" variant="weak" size="medium">
          라벨
        </Badge>
        <Badge tone="warning" variant="outline" size="medium">
          라벨
        </Badge>
      </VStack>
      <VStack gap="x4">
        <Badge tone="warning" variant="solid" size="large">
          라벨
        </Badge>
        <Badge tone="warning" variant="weak" size="large">
          라벨
        </Badge>
        <Badge tone="warning" variant="outline" size="large">
          라벨
        </Badge>
      </VStack>
    </HStack>
  );
}
```

#### Critical \[#critical]

```tsx
import { Badge, HStack, VStack } from "@seed-design/react";

export default function BadgeCritical() {
  return (
    <HStack gap="x4">
      <VStack gap="x4">
        <Badge tone="critical" variant="solid" size="medium">
          라벨
        </Badge>
        <Badge tone="critical" variant="weak" size="medium">
          라벨
        </Badge>
        <Badge tone="critical" variant="outline" size="medium">
          라벨
        </Badge>
      </VStack>
      <VStack gap="x4">
        <Badge tone="critical" variant="solid" size="large">
          라벨
        </Badge>
        <Badge tone="critical" variant="weak" size="large">
          라벨
        </Badge>
        <Badge tone="critical" variant="outline" size="large">
          라벨
        </Badge>
      </VStack>
    </HStack>
  );
}
```