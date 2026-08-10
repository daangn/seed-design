file: components/callout.mdx

# Callout

사용자에게 중요한 정보나 팁을 시각적으로 강조하여 전달하는 메시지 컴포넌트입니다.

사용 가능 버전: @seed-design/react@0.0.1, @seed-design/css@0.0.1

## Preview

```tsx
import { VStack } from "@seed-design/react";
import { ActionableCallout, Callout, DismissibleCallout } from "seed-design/ui/callout";

export default function CalloutPreview() {
  return (
    <VStack gap="x4" width="full">
      <Callout description="Aute nulla proident tempor minim eiusmod. In nostrud officia irure laborum." />
      <ActionableCallout description="Aute nulla proident tempor minim eiusmod. In nostrud officia irure laborum." />
      <DismissibleCallout description="Aute nulla proident tempor minim eiusmod. In nostrud officia irure laborum." />
    </VStack>
  );
}
```

## Installation \[#installation]

- npm: npx @seed-design/cli@latest add ui:callout
- pnpm: pnpm dlx @seed-design/cli@latest add ui:callout
- yarn: yarn dlx @seed-design/cli@latest add ui:callout
- bun: bun x @seed-design/cli@latest add ui:callout

<ManualInstallation name="callout" />

## Props \[#props]

### `Callout` \[#callout]

- `prefixIcon`
  - type: `React.ReactNode`
- `title`
  - type: `React.ReactNode`
- `description`
  - type: `React.ReactNode`
  - required: `true`
- `linkProps`
  - type: `SeedCallout.LinkProps | undefined`
- `tone`
  - type: `"neutral" | "informative" | "positive" | "warning" | "critical" | "magic" | undefined`
  - default: `"neutral"`
  - description: - \`neutral\`: 일반적인 정보를 전달합니다. - \`informative\`: 유용한 정보를 제공합니다. - \`positive\`: 긍정적인 상태를 나타냅니다. - \`warning\`: 주의가 필요한 상태를 나타냅니다. - \`critical\`: 중요한 문제를 나타냅니다. - \`magic\`: AI 기능을 나타냅니다.

### `ActionableCallout` \[#actionablecallout]

- `prefixIcon`
  - type: `React.ReactNode`
- `title`
  - type: `React.ReactNode`
- `description`
  - type: `React.ReactNode`
  - required: `true`
- `tone`
  - type: `"neutral" | "informative" | "positive" | "warning" | "critical" | "magic" | undefined`
  - default: `"neutral"`
  - description: - \`neutral\`: 일반적인 정보를 전달합니다. - \`informative\`: 유용한 정보를 제공합니다. - \`positive\`: 긍정적인 상태를 나타냅니다. - \`warning\`: 주의가 필요한 상태를 나타냅니다. - \`critical\`: 중요한 문제를 나타냅니다. - \`magic\`: AI 기능을 나타냅니다.

### `DismissibleCallout` \[#dismissiblecallout]

- `prefixIcon`
  - type: `React.ReactNode`
- `title`
  - type: `React.ReactNode`
- `description`
  - type: `React.ReactNode`
  - required: `true`
- `linkProps`
  - type: `SeedCallout.LinkProps | undefined`
- `open`
  - type: `boolean | undefined`
- `defaultOpen`
  - type: `boolean | undefined`
- `onDismiss`
  - type: `(() => void) | undefined`
- `tone`
  - type: `"neutral" | "informative" | "positive" | "warning" | "critical" | "magic" | undefined`
  - default: `"neutral"`
  - description: - \`neutral\`: 일반적인 정보를 전달합니다. - \`informative\`: 유용한 정보를 제공합니다. - \`positive\`: 긍정적인 상태를 나타냅니다. - \`warning\`: 주의가 필요한 상태를 나타냅니다. - \`critical\`: 중요한 문제를 나타냅니다. - \`magic\`: AI 기능을 나타냅니다.

## Examples \[#examples]

### Content Layout \[#content-layout]

#### Text Only \[#text-only]

```tsx
import { VStack } from "@seed-design/react";
import { ActionableCallout, Callout, DismissibleCallout } from "seed-design/ui/callout";

export default function CalloutTextOnly() {
  return (
    <VStack gap="x4" width="full">
      <Callout description="기능에 대한 안내 또는 유익한 내용을 전달해요. 콜아웃은 꼭 필요한 경우에만 절제하여 사용해요." />
      <ActionableCallout description="기능에 대한 안내 또는 유익한 내용을 전달해요. 콜아웃은 꼭 필요한 경우에만 절제하여 사용해요." />
      <DismissibleCallout description="기능에 대한 안내 또는 유익한 내용을 전달해요. 콜아웃은 꼭 필요한 경우에만 절제하여 사용해요." />
    </VStack>
  );
}
```

#### With Icon \[#with-icon]

```tsx
import { IconCalendarFill } from "@karrotmarket/react-monochrome-icon";
import { VStack } from "@seed-design/react";
import { ActionableCallout, Callout, DismissibleCallout } from "seed-design/ui/callout";

export default function CalloutWithIcon() {
  return (
    <VStack gap="x4" width="full">
      <Callout
        prefixIcon={<IconCalendarFill />}
        description="기능에 대한 안내 또는 유익한 내용을 전달해요. 콜아웃은 꼭 필요한 경우에만 절제하여 사용해요."
      />
      <ActionableCallout
        prefixIcon={<IconCalendarFill />}
        description="기능에 대한 안내 또는 유익한 내용을 전달해요. 콜아웃은 꼭 필요한 경우에만 절제하여 사용해요."
      />
      <DismissibleCallout
        prefixIcon={<IconCalendarFill />}
        description="기능에 대한 안내 또는 유익한 내용을 전달해요. 콜아웃은 꼭 필요한 경우에만 절제하여 사용해요."
      />
    </VStack>
  );
}
```

#### With Title Text \[#with-title-text]

```tsx
import { VStack } from "@seed-design/react";
import { ActionableCallout, Callout, DismissibleCallout } from "seed-design/ui/callout";

export default function CalloutWithTitleText() {
  return (
    <VStack gap="x4" width="full">
      <Callout
        title="타이틀"
        description="기능에 대한 안내 또는 유익한 내용을 전달해요. 콜아웃은 꼭 필요한 경우에만 절제하여 사용해요."
      />
      <ActionableCallout
        title="타이틀"
        description="기능에 대한 안내 또는 유익한 내용을 전달해요. 콜아웃은 꼭 필요한 경우에만 절제하여 사용해요."
      />
      <DismissibleCallout
        title="타이틀"
        description="기능에 대한 안내 또는 유익한 내용을 전달해요. 콜아웃은 꼭 필요한 경우에만 절제하여 사용해요."
      />
    </VStack>
  );
}
```

#### With Link Label \[#with-link-label]

<Callout type="warn">
  `ActionableCallout`에서는 `linkProps`를 제공하지 않아요.
</Callout>

```tsx
import { VStack } from "@seed-design/react";
import { Callout, DismissibleCallout } from "seed-design/ui/callout";

export default function CalloutWithLinkLabel() {
  return (
    <VStack gap="x4" width="full">
      <Callout
        description="기능에 대한 안내 또는 유익한 내용을 전달해요. 콜아웃은 꼭 필요한 경우에만 절제하여 사용해요."
        linkProps={{ children: "시도해 보기" }}
      />
      <DismissibleCallout
        description="기능에 대한 안내 또는 유익한 내용을 전달해요. 콜아웃은 꼭 필요한 경우에만 절제하여 사용해요."
        linkProps={{ children: "시도해 보기" }}
      />
    </VStack>
  );
}
```

#### With All \[#with-all]

```tsx
import { IconCalendarFill } from "@karrotmarket/react-monochrome-icon";
import { VStack } from "@seed-design/react";
import { Callout, DismissibleCallout } from "seed-design/ui/callout";

export default function CalloutWithAll() {
  return (
    <VStack gap="x4" width="full">
      <Callout
        title="타이틀"
        prefixIcon={<IconCalendarFill />}
        description="기능에 대한 안내 또는 유익한 내용을 전달해요. 콜아웃은 꼭 필요한 경우에만 절제하여 사용해요."
        linkProps={{ children: "시도해 보기" }}
      />
      <DismissibleCallout
        title="타이틀"
        prefixIcon={<IconCalendarFill />}
        description="기능에 대한 안내 또는 유익한 내용을 전달해요. 콜아웃은 꼭 필요한 경우에만 절제하여 사용해요."
        linkProps={{ children: "시도해 보기" }}
      />
    </VStack>
  );
}
```

### Customizable Parts \[#customizable-parts]

#### Rendering Link Label as Child \[#rendering-link-label-as-child]

```tsx
import { VStack } from "@seed-design/react";
import { Callout, DismissibleCallout } from "seed-design/ui/callout";

export default function CalloutLinkLabelAsChild() {
  return (
    <VStack gap="x4" width="full">
      <Callout
        description="기능에 대한 안내 또는 유익한 내용을 전달해요. 콜아웃은 꼭 필요한 경우에만 절제하여 사용해요."
        linkProps={{
          asChild: true,
          children: (
            <a href="https://www.daangn.com" target="_blank" rel="noreferrer">
              시도해 보기
            </a>
          ),
        }}
      />
      <DismissibleCallout
        description="기능에 대한 안내 또는 유익한 내용을 전달해요. 콜아웃은 꼭 필요한 경우에만 절제하여 사용해요."
        linkProps={{
          asChild: true,
          children: (
            <a href="https://www.daangn.com" target="_blank" rel="noreferrer">
              시도해 보기
            </a>
          ),
        }}
      />
    </VStack>
  );
}
```

### Tones \[#tones]

#### Neutral (Default) \[#neutral-default]

```tsx
import { IconCalendarFill } from "@karrotmarket/react-monochrome-icon";
import { VStack } from "@seed-design/react";
import { ActionableCallout, Callout, DismissibleCallout } from "seed-design/ui/callout";

export default function CalloutNeutral() {
  return (
    <VStack gap="x4" width="full">
      <Callout
        tone="neutral"
        prefixIcon={<IconCalendarFill />}
        description="기능에 대한 안내 또는 유익한 내용을 전달해요. 콜아웃은 꼭 필요한 경우에만 절제하여 사용해요."
      />
      <ActionableCallout
        tone="neutral"
        prefixIcon={<IconCalendarFill />}
        description="기능에 대한 안내 또는 유익한 내용을 전달해요. 콜아웃은 꼭 필요한 경우에만 절제하여 사용해요."
      />
      <DismissibleCallout
        tone="neutral"
        prefixIcon={<IconCalendarFill />}
        description="기능에 대한 안내 또는 유익한 내용을 전달해요. 콜아웃은 꼭 필요한 경우에만 절제하여 사용해요."
      />
    </VStack>
  );
}
```

#### Informative \[#informative]

```tsx
import { IconCalendarFill } from "@karrotmarket/react-monochrome-icon";
import { VStack } from "@seed-design/react";
import { ActionableCallout, Callout, DismissibleCallout } from "seed-design/ui/callout";

export default function CalloutInformative() {
  return (
    <VStack gap="x4" width="full">
      <Callout
        tone="informative"
        prefixIcon={<IconCalendarFill />}
        description="기능에 대한 안내 또는 유익한 내용을 전달해요. 콜아웃은 꼭 필요한 경우에만 절제하여 사용해요."
      />
      <ActionableCallout
        tone="informative"
        prefixIcon={<IconCalendarFill />}
        description="기능에 대한 안내 또는 유익한 내용을 전달해요. 콜아웃은 꼭 필요한 경우에만 절제하여 사용해요."
      />
      <DismissibleCallout
        tone="informative"
        prefixIcon={<IconCalendarFill />}
        description="기능에 대한 안내 또는 유익한 내용을 전달해요. 콜아웃은 꼭 필요한 경우에만 절제하여 사용해요."
      />
    </VStack>
  );
}
```

#### Positive \[#positive]

```tsx
import { IconCalendarFill } from "@karrotmarket/react-monochrome-icon";
import { VStack } from "@seed-design/react";
import { ActionableCallout, Callout, DismissibleCallout } from "seed-design/ui/callout";

export default function CalloutPositive() {
  return (
    <VStack gap="x4" width="full">
      <Callout
        tone="positive"
        prefixIcon={<IconCalendarFill />}
        description="기능에 대한 안내 또는 유익한 내용을 전달해요. 콜아웃은 꼭 필요한 경우에만 절제하여 사용해요."
      />
      <ActionableCallout
        tone="positive"
        prefixIcon={<IconCalendarFill />}
        description="기능에 대한 안내 또는 유익한 내용을 전달해요. 콜아웃은 꼭 필요한 경우에만 절제하여 사용해요."
      />
      <DismissibleCallout
        tone="positive"
        prefixIcon={<IconCalendarFill />}
        description="기능에 대한 안내 또는 유익한 내용을 전달해요. 콜아웃은 꼭 필요한 경우에만 절제하여 사용해요."
      />
    </VStack>
  );
}
```

#### Warning \[#warning]

```tsx
import { IconCalendarFill } from "@karrotmarket/react-monochrome-icon";
import { VStack } from "@seed-design/react";
import { ActionableCallout, Callout, DismissibleCallout } from "seed-design/ui/callout";

export default function CalloutWarning() {
  return (
    <VStack gap="x4" width="full">
      <Callout
        tone="warning"
        prefixIcon={<IconCalendarFill />}
        description="기능에 대한 안내 또는 유익한 내용을 전달해요. 콜아웃은 꼭 필요한 경우에만 절제하여 사용해요."
      />
      <ActionableCallout
        tone="warning"
        prefixIcon={<IconCalendarFill />}
        description="기능에 대한 안내 또는 유익한 내용을 전달해요. 콜아웃은 꼭 필요한 경우에만 절제하여 사용해요."
      />
      <DismissibleCallout
        tone="warning"
        prefixIcon={<IconCalendarFill />}
        description="기능에 대한 안내 또는 유익한 내용을 전달해요. 콜아웃은 꼭 필요한 경우에만 절제하여 사용해요."
      />
    </VStack>
  );
}
```

#### Critical \[#critical]

```tsx
import { IconCalendarFill } from "@karrotmarket/react-monochrome-icon";
import { VStack } from "@seed-design/react";
import { ActionableCallout, Callout, DismissibleCallout } from "seed-design/ui/callout";

export default function CalloutCritical() {
  return (
    <VStack gap="x4" width="full">
      <Callout
        tone="critical"
        prefixIcon={<IconCalendarFill />}
        description="기능에 대한 안내 또는 유익한 내용을 전달해요. 콜아웃은 꼭 필요한 경우에만 절제하여 사용해요."
      />
      <ActionableCallout
        tone="critical"
        prefixIcon={<IconCalendarFill />}
        description="기능에 대한 안내 또는 유익한 내용을 전달해요. 콜아웃은 꼭 필요한 경우에만 절제하여 사용해요."
      />
      <DismissibleCallout
        tone="critical"
        prefixIcon={<IconCalendarFill />}
        description="기능에 대한 안내 또는 유익한 내용을 전달해요. 콜아웃은 꼭 필요한 경우에만 절제하여 사용해요."
      />
    </VStack>
  );
}
```

#### Magic \[#magic]

```tsx
import { IconSparkle2 } from "@karrotmarket/react-multicolor-icon";
import { VStack } from "@seed-design/react";
import { ActionableCallout, Callout, DismissibleCallout } from "seed-design/ui/callout";

export default function CalloutMagic() {
  return (
    <VStack gap="x4" width="full">
      <Callout
        tone="magic"
        description="기능에 대한 안내 또는 유익한 내용을 전달해요. 콜아웃은 꼭 필요한 경우에만 절제하여 사용해요."
        prefixIcon={<IconSparkle2 />}
      />
      <ActionableCallout
        tone="magic"
        description="기능에 대한 안내 또는 유익한 내용을 전달해요. 콜아웃은 꼭 필요한 경우에만 절제하여 사용해요."
        prefixIcon={<IconSparkle2 />}
      />
      <DismissibleCallout
        tone="magic"
        description="기능에 대한 안내 또는 유익한 내용을 전달해요. 콜아웃은 꼭 필요한 경우에만 절제하여 사용해요."
        prefixIcon={<IconSparkle2 />}
      />
    </VStack>
  );
}
```