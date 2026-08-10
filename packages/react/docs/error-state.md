file: components/(deprecated)/error-state.mdx

# Error State

사용자에게 오류 혹은 조회 결과가 없음을 알리는 컴포넌트입니다.

<Callout type="warn">
  더 이상 사용되지 않습니다. [`ResultSection`](/react/components/result-section)을 사용하세요.
</Callout>

## Preview

```tsx
import { VStack } from "@seed-design/react";
import { ErrorState } from "seed-design/ui/error-state";

export default function ErrorStatePreview() {
  return (
    <VStack minHeight="480px" width="320px" borderWidth={1} borderColor="stroke.neutralMuted">
      <ErrorState
        title="에러 타이틀"
        description="Lorem ipsum dolor sit amet consectetur adipisicing elit."
        primaryActionProps={{
          children: "메인 액션",
        }}
        secondaryActionProps={{
          children: "보조 액션",
        }}
      />
    </VStack>
  );
}
```

## Installation \[#installation]

- npm: npx @seed-design/cli@latest add ui:error-state
- pnpm: pnpm dlx @seed-design/cli@latest add ui:error-state
- yarn: yarn dlx @seed-design/cli@latest add ui:error-state
- bun: bun x @seed-design/cli@latest add ui:error-state

<ManualInstallation name="error-state" />

## Props \[#props]

- `title`
  - type: `React.ReactNode`
- `description`
  - type: `React.ReactNode`
  - required: `true`
- `primaryActionProps`
  - type: `ActionButtonProps | undefined`
- `secondaryActionProps`
  - type: `ActionButtonProps | undefined`
- `variant`
  - type: `"default" | "basement" | undefined`
  - default: `"default"`

## Examples \[#examples]

### Basement \[#basement]

layer-basement 배경 위에서는 basement variant를 사용합니다.

```tsx
import { VStack } from "@seed-design/react";
import { ErrorState } from "seed-design/ui/error-state";

export default function ErrorStateBasement() {
  return (
    <VStack minHeight="480px" width="320px" borderWidth={1} borderColor="stroke.neutralMuted">
      <ErrorState
        variant="basement"
        title="에러 타이틀"
        description="Lorem ipsum dolor sit amet consectetur adipisicing elit."
        primaryActionProps={{
          children: "메인 액션",
        }}
        secondaryActionProps={{
          children: "보조 액션",
        }}
      />
    </VStack>
  );
}
```