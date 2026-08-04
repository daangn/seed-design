file: components/identity-placeholder.mdx

# Identity Placeholder

인물을 표현하는 이미지가 로드되지 않았을 때 보여지는 대체 시각 요소입니다.

사용 가능 버전: @seed-design/react@0.0.1, @seed-design/css@0.0.1

## Preview

```tsx
import { IdentityPlaceholder } from "seed-design/ui/identity-placeholder";

export default function IdentityPlaceholderPreview() {
  return <IdentityPlaceholder />;
}
```

## Installation \[#installation]

- npm: npx @seed-design/cli@latest add ui:identity-placeholder
- pnpm: pnpm dlx @seed-design/cli@latest add ui:identity-placeholder
- yarn: yarn dlx @seed-design/cli@latest add ui:identity-placeholder
- bun: bun x @seed-design/cli@latest add ui:identity-placeholder

<ManualInstallation name="identity-placeholder" />

## Props \[#props]

- `identity`
  - type: `"person" | "business" | undefined`
  - default: `"person"`
- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.

## Examples \[#examples]

### Identity \[#identity]

```tsx
import { Grid } from "@seed-design/react";
import { IdentityPlaceholder } from "seed-design/ui/identity-placeholder";

export default function IdentityPlaceholderPreview() {
  return (
    <Grid columns={2} gap="x4">
      <IdentityPlaceholder identity="person" />
      <IdentityPlaceholder identity="business" />
    </Grid>
  );
}
```