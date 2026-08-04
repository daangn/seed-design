file: components/floating-action-button.mdx

# Floating Action Button

화면 상에 떠 있으며 주요 액션을 실행하는 버튼입니다.

사용 가능 버전: @seed-design/react@0.0.30, @seed-design/css@0.0.30

## Preview

```tsx
import { FloatingActionButton } from "seed-design/ui/floating-action-button";
import IconPlusLine from "@karrotmarket/react-monochrome-icon/IconPlusLine";

export default function FloatingActionButtonPreview() {
  return <FloatingActionButton icon={<IconPlusLine />} label="Example FAB" />;
}
```

## Installation \[#installation]

- npm: npx @seed-design/cli@latest add ui:floating-action-button
- pnpm: pnpm dlx @seed-design/cli@latest add ui:floating-action-button
- yarn: yarn dlx @seed-design/cli@latest add ui:floating-action-button
- bun: bun x @seed-design/cli@latest add ui:floating-action-button

<ManualInstallation name="floating-action-button" />

## Props \[#props]

- `icon`
  - type: `React.ReactNode`
  - required: `true`
- `label`
  - type: `React.ReactNode`
  - required: `true`
- `extended`
  - type: `boolean | undefined`
  - default: `true`
- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.

## Examples \[#examples]

### Extended \[#extended]

`extended` prop을 사용하여 label 표시 여부 및 레이아웃을 제어할 수 있습니다.

`extended` 사용 유무에 관계없이 `label`은 접근성을 위해 필수 prop으로 지정되어 있습니다.

```tsx
import { FloatingActionButton } from "seed-design/ui/floating-action-button";
import { Switch } from "seed-design/ui/switch";
import IconPlusLine from "@karrotmarket/react-monochrome-icon/IconPlusLine";
import { Flex, VStack } from "@seed-design/react";
import { useState } from "react";

export default function FloatingActionButtonExtended() {
  const [extended, setExtended] = useState(true);

  return (
    <VStack align="center" justify="space-between">
      <Flex height="100px" align="center" justify="center">
        <FloatingActionButton icon={<IconPlusLine />} label="Extended" extended={extended} />
      </Flex>
      <Switch
        size="16"
        tone="neutral"
        label="Extended"
        checked={extended}
        onCheckedChange={setExtended}
      />
    </VStack>
  );
}
```

### Float Composition \[#float-composition]

Floating Action Button은 `<Float>` 컴포넌트와 함께 사용하면 편리합니다.

```tsx
import { FloatingActionButton } from "seed-design/ui/floating-action-button";
import { IconBellFill } from "@karrotmarket/react-monochrome-icon";
import { Box, Float } from "@seed-design/react";

export default function FloatingActionButtonFloatComposition() {
  return (
    <Box
      position="relative"
      width="300px"
      height="500px"
      borderWidth={1}
      borderColor="stroke.neutralMuted"
    >
      <Float placement="bottom-end" offsetX="x4" offsetY="x4">
        <FloatingActionButton icon={<IconBellFill />} label="알림 설정" />
      </Float>
    </Box>
  );
}
```