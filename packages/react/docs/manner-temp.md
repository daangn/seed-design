file: components/manner-temp.mdx

# Manner Temp

사용자의 매너온도를 시각적으로 표현하는 컴포넌트입니다. 신뢰도/매너 정도를 직관적으로 보여주는 데에 사용합니다.

사용 가능 버전: @seed-design/react@0.0.9, @seed-design/css@0.0.9

## Preview

```tsx
import { VStack } from "@seed-design/react";
import { MannerTemp } from "seed-design/ui/manner-temp";

export default function MannerTempPreview() {
  return (
    <VStack gap="x1" align="flex-end">
      <MannerTemp temperature={12.5} />
      <MannerTemp temperature={30} />
      <MannerTemp temperature={36} />
      <MannerTemp temperature={36.5} />
      <MannerTemp temperature={37} />
      <MannerTemp temperature={40} />
      <MannerTemp temperature={45} />
      <MannerTemp temperature={55} />
      <MannerTemp temperature={65} />
      <MannerTemp temperature={80} />
    </VStack>
  );
}
```

## Installation \[#installation]

- npm: npx @seed-design/cli@latest add ui:manner-temp
- pnpm: pnpm dlx @seed-design/cli@latest add ui:manner-temp
- yarn: yarn dlx @seed-design/cli@latest add ui:manner-temp
- bun: bun x @seed-design/cli@latest add ui:manner-temp

<ManualInstallation name="manner-temp" />

## Props \[#props]

- `temperature`
  - type: `number`
  - required: `true`
  - description: The manner temperature of the MannerTemp component. Level will be calculated based on this value. If level is provided, this will be ignored.
- `level`
  - type: `"l1" | "l2" | "l3" | "l4" | "l5" | "l6" | "l7" | "l8" | "l9" | "l10" | undefined`
  - default: `"l1"`