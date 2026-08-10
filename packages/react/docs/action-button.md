file: components/action-button.mdx

# Action Button

명확한 액션을 쉽게 수행할 수 있도록 돕는 기본 인터랙션 컴포넌트입니다.

사용 가능 버전: @seed-design/react@0.0.1, @seed-design/css@0.0.1

## Preview

```tsx
import { ActionButton } from "seed-design/ui/action-button";

export default function ActionButtonPreview() {
  return <ActionButton>라벨</ActionButton>;
}
```

## Installation \[#installation]

- npm: npx @seed-design/cli@latest add ui:action-button
- pnpm: pnpm dlx @seed-design/cli@latest add ui:action-button
- yarn: yarn dlx @seed-design/cli@latest add ui:action-button
- bun: bun x @seed-design/cli@latest add ui:action-button

<ManualInstallation name="action-button" />

## Props \[#props]

- `color`
  - type: `ScopedColorFg | ScopedColorPalette | undefined`
  - default: `"fg.neutral"`
  - description: Color of the label and icons inside the button. Works only when \`variant\` is \`ghost\`.
- `fontWeight`
  - type: `"bold" | "regular" | "medium" | undefined`
  - default: `"bold"`
  - description: Weight of the label. Works only when \`variant\` is \`ghost\`.
- `variant`
  - type: `"brandSolid" | "neutralSolid" | "neutralWeak" | "criticalSolid" | "brandOutline" | "neutralOutline" | "ghost" | undefined`
  - default: `"brandSolid"`
  - description: - \`brandSolid\`: 브랜드의 핵심 가치를 전달하며, 사용자 간 연결이 일어나는 서비스의 주요 기능에 사용합니다. 한 화면에 하나만 사용하는 것을 권장합니다. - \`neutralSolid\`: 대부분의 화면에서 CTA로 사용합니다. 한 화면에 하나만 사용하는 것을 권장합니다. - \`neutralWeak\`: CTA를 제외한 대부분의 액션에 사용됩니다. - \`criticalSolid\`: 삭제나 초기화처럼 되돌릴 수 없는 중요한 작업에 사용합니다. - \`brandOutline\`: variant=brandSolid, neutralSolid, criticalSolid와 함께 사용할 수 없으며, variant=neutralOutline과 조합하여 사용하는 것을 권장합니다. - \`neutralOutline\`: variant=brandSolid, neutralSolid, criticalSolid와 함께 사용할 수 없으며, variant=brandOutline과 조합하여 사용하는 것을 권장합니다. - \`ghost\`: 배경 없이 텍스트와 아이콘만 표시됩니다. 모두 동일한 색상을 사용하는 조건에서 icon, prefix icon, suffix icon, label에 정의된 color를 변경할 수 있으며, label의 fontWeight를 \`$font-weight.regular\` 또는 \`$font-weight.medium\`으로 변경하여 주목도를 조절할 수 있습니다.
- `size`
  - type: `"small" | "medium" | "xsmall" | "large" | undefined`
  - default: `"medium"`
  - description: - \`xsmall\`: 작은 공간에서 효율적으로 사용할 수 있는 Pill 형태로 제공됩니다. - \`small\`: 화면 중앙에서 범용적으로 사용됩니다. - \`medium\`: 화면 중앙에서 범용적으로 사용됩니다. - \`large\`: 주로 CTA 역할로 사용됩니다.
- `layout`
  - type: `"withText" | "iconOnly" | undefined`
  - default: `"withText"`
  - description: - \`withText\`: 텍스트와 함께 아이콘을 표시할 수 있습니다. - \`iconOnly\`: 아이콘만으로 의미를 전달하기 때문에 접근성이 떨어집니다. 꼭 필요한 경우에만 접근성 레이블과 함께 사용하는 것을 권장합니다.
- `loading`
  - type: `boolean | undefined`
  - default: `false`
  - description: 버튼에 등록된 비동기 작업이 진행 중임을 사용자에게 알립니다.
- `disabled`
  - type: `boolean | undefined`
  - default: `false`
  - description: 버튼의 비활성화 여부를 나타냅니다.
- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.
- `bleed`
  - type: `ResponsiveValue<0 | "asPadding" | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {})> | undefined`
  - description: Negative margin on all four sides to extend the element outside its parent. If set to "asPadding", it will use the padding value in the same direction. Cannot be combined with any \`margin\*\` prop.
- `bleedX`
  - type: `ResponsiveValue<0 | "asPadding" | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {})> | undefined`
  - description: Negative x-axis margin to extend the element outside its parent. If set to "asPadding", it will use the padding value in the same direction. Cannot be combined with any \`margin\*\` prop.
- `bleedY`
  - type: `ResponsiveValue<0 | "asPadding" | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {})> | undefined`
  - description: Negative y-axis margin to extend the element outside its parent. If set to "asPadding", it will use the padding value in the same direction. Cannot be combined with any \`margin\*\` prop.
- `flexGrow`
  - type: `true | 0 | 1 | (number & {}) | undefined`
  - description: If true, flex-grow will be set to \`1\`.

## Examples \[#examples]

### Brand Solid \[#brand-solid]

```tsx
import { ActionButton } from "seed-design/ui/action-button";

export default function ActionButtonBrandSolid() {
  return <ActionButton variant="brandSolid">라벨</ActionButton>;
}
```

### Neutral Solid \[#neutral-solid]

```tsx
import { ActionButton } from "seed-design/ui/action-button";

export default function ActionButtonNeutralSolid() {
  return <ActionButton variant="neutralSolid">라벨</ActionButton>;
}
```

### Neutral Weak \[#neutral-weak]

```tsx
import { ActionButton } from "seed-design/ui/action-button";

export default function ActionButtonNeutralWeak() {
  return <ActionButton variant="neutralWeak">라벨</ActionButton>;
}
```

### Critical Solid \[#critical-solid]

```tsx
import { ActionButton } from "seed-design/ui/action-button";

export default function ActionButtonCriticalSolid() {
  return <ActionButton variant="criticalSolid">라벨</ActionButton>;
}
```

### Brand Outline \[#brand-outline]

```tsx
import { ActionButton } from "seed-design/ui/action-button";

export default function ActionButtonBrandOutline() {
  return <ActionButton variant="brandOutline">라벨</ActionButton>;
}
```

### Neutral Outline \[#neutral-outline]

```tsx
import { ActionButton } from "seed-design/ui/action-button";

export default function ActionButtonNeutralOutline() {
  return <ActionButton variant="neutralOutline">라벨</ActionButton>;
}
```

### Ghost \[#ghost]

Ghost variant는 `color` 속성을 사용해 레이블과 아이콘의 색상을, `fontWeight` 속성을 사용해 글꼴의 굵기를 변경할 수 있습니다.

```tsx
import { HStack, PrefixIcon, VStack } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";
import { IconTagFill } from "@karrotmarket/react-monochrome-icon";

export default function ActionButtonGhost() {
  return (
    <VStack gap="spacingY.componentDefault" align="center">
      <HStack gap="x2">
        <ActionButton variant="ghost">
          <PrefixIcon svg={<IconTagFill />} />
          Default (fg.neutral)
        </ActionButton>
        <ActionButton variant="ghost" color="fg.neutralSubtle">
          <PrefixIcon svg={<IconTagFill />} />
          Neutral Subtle
        </ActionButton>
        <ActionButton variant="ghost" color="fg.brand">
          <PrefixIcon svg={<IconTagFill />} />
          Brand
        </ActionButton>
      </HStack>
      <HStack gap="x2">
        <ActionButton variant="ghost">Default (Bold)</ActionButton>
        <ActionButton variant="ghost" fontWeight="medium">
          Medium
        </ActionButton>
        <ActionButton variant="ghost" fontWeight="regular">
          Regular
        </ActionButton>
      </HStack>
    </VStack>
  );
}
```

### Icon Only \[#icon-only]

```tsx
import { IconPlusFill } from "@karrotmarket/react-monochrome-icon";
import { Icon } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";

export default function ActionButtonIconOnly() {
  return (
    <ActionButton layout="iconOnly" aria-label="추가">
      <Icon svg={<IconPlusFill />} />
    </ActionButton>
  );
}
```

### Prefix Icon \[#prefix-icon]

```tsx
import { IconPlusFill } from "@karrotmarket/react-monochrome-icon";
import { PrefixIcon } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";

export default function ActionButtonPrefixIcon() {
  return (
    <ActionButton>
      <PrefixIcon svg={<IconPlusFill />} />
      라벨
    </ActionButton>
  );
}
```

### Suffix Icon \[#suffix-icon]

```tsx
import { IconChevronRightFill } from "@karrotmarket/react-monochrome-icon";
import { SuffixIcon } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";

export default function ActionButtonSuffixIcon() {
  return (
    <ActionButton>
      라벨
      <SuffixIcon svg={<IconChevronRightFill />} />
    </ActionButton>
  );
}
```

### Disabled \[#disabled]

```tsx
import { ActionButton } from "seed-design/ui/action-button";

export default function ActionButtonDisabled() {
  return <ActionButton disabled>라벨</ActionButton>;
}
```

### Loading \[#loading]

```tsx
import { useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";

export default function ActionButtonLoading() {
  const [loading, setLoading] = useState(false);

  function handleClick() {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  }

  // 이벤트 핸들링이 필요할 수 있으므로 loading은 disabled를 포함하지 않습니다. 이벤트 발생을 원하지 않는 경우, disabled 속성을 추가해주세요.
  return (
    <ActionButton loading={loading} onClick={handleClick}>
      시간이 걸리는 액션
    </ActionButton>
  );
}
```

### Bleed \[#bleed]

`bleedX`, `bleedY` 속성을 사용해 버튼이 레이아웃에서 "빠져나오게" 할 수 있습니다.

Ghost variant를 시각적으로 정렬해야 할 때 유용합니다.

```tsx
import { HStack, Text, VStack } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";

export default function ActionButtonBleed() {
  return (
    <VStack width="100%" gap="x4">
      <HStack align="center" justify="space-between" borderWidth={1} borderColor="palette.red600">
        <Text fontSize="t6">Bleed Example</Text>
        <ActionButton bleedY="asPadding" variant="brandSolid">
          Bleed Y
        </ActionButton>
      </HStack>
      <HStack align="center" justify="space-between" borderWidth={1} borderColor="palette.red600">
        <Text fontSize="t6">Bleed Example</Text>
        <ActionButton bleed="asPadding" variant="ghost">
          Bleed all sides
        </ActionButton>
      </HStack>
    </VStack>
  );
}
```