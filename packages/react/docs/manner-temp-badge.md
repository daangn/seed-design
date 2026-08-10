file: components/manner-temp-badge.mdx

# Manner Temp Badge

매너 온도를 배지 형태로 표현하는 컴포넌트입니다. 콤팩트한 공간에서 사용자의 매너 온도 레벨을 간단히 표시할 때 사용됩니다.

사용 가능 버전: @seed-design/react@0.0.1, @seed-design/css@0.0.1

## Preview

```tsx
import { VStack } from "@seed-design/react";
import { MannerTempBadge } from "seed-design/ui/manner-temp-badge";

export default function BadgePreview() {
  return (
    <VStack gap="x1" align="flex-start">
      <MannerTempBadge temperature={12.5} />
      <MannerTempBadge temperature={30} />
      <MannerTempBadge temperature={36} />
      <MannerTempBadge temperature={36.5} />
      <MannerTempBadge temperature={37} />
      <MannerTempBadge temperature={40} />
      <MannerTempBadge temperature={45} />
      <MannerTempBadge temperature={55} />
      <MannerTempBadge temperature={65} />
      <MannerTempBadge temperature={80} />
    </VStack>
  );
}
```

## Installation \[#installation]

- npm: npx @seed-design/cli@latest add ui:manner-temp-badge
- pnpm: pnpm dlx @seed-design/cli@latest add ui:manner-temp-badge
- yarn: yarn dlx @seed-design/cli@latest add ui:manner-temp-badge
- bun: bun x @seed-design/cli@latest add ui:manner-temp-badge

<ManualInstallation name="manner-temp-badge" />

## Props \[#props]

- `temperature`
  - type: `number`
  - required: `true`
  - description: The manner temperature of the badge. Level will be calculated based on this value. If level is provided, this will be ignored.
- `level`
  - type: `"l1" | "l2" | "l3" | "l4" | "l5" | "l6" | "l7" | "l8" | "l9" | "l10" | undefined`
  - default: `"l1"`