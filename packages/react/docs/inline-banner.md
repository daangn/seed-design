file: components/(deprecated)/inline-banner.mdx

# Inline Banner



<Callout type="warn">
  더 이상 사용되지 않습니다. [Page Banner](/react/components/page-banner)를 사용하세요.
</Callout>

## Preview

```tsx
import { VStack } from "@seed-design/react";
import {
  ActionableInlineBanner,
  DismissibleInlineBanner,
  InlineBanner,
} from "seed-design/ui/inline-banner";

export default function InlineBannerPreview() {
  return (
    <VStack gap="x4" width="full">
      <InlineBanner description="Ut veniam in ea ea anim laborum magna dolore ea laborum duis ut aute mollit amet." />
      <ActionableInlineBanner description="Ut veniam in ea ea anim laborum magna dolore ea laborum duis ut aute mollit amet." />
      <DismissibleInlineBanner description="Ut veniam in ea ea anim laborum magna dolore ea laborum duis ut aute mollit amet." />
    </VStack>
  );
}
```

## Installation \[#installation]

- npm: npx @seed-design/cli@latest add ui:inline-banner
- pnpm: pnpm dlx @seed-design/cli@latest add ui:inline-banner
- yarn: yarn dlx @seed-design/cli@latest add ui:inline-banner
- bun: bun x @seed-design/cli@latest add ui:inline-banner

<ManualInstallation name="inline-banner" />

## Props \[#props]

### `InlineBanner` \[#inlinebanner]

- `prefixIcon`
  - type: `React.ReactNode`
- `title`
  - type: `React.ReactNode`
- `description`
  - type: `React.ReactNode`
  - required: `true`
- `linkProps`
  - type: `SeedInlineBanner.LinkProps | undefined`
- `variant`
  - type: `"neutralWeak" | "positiveWeak" | "informativeWeak" | "warningWeak" | "warningSolid" | "criticalWeak" | "criticalSolid" | undefined`
  - default: `"neutralWeak"`

### `ActionableInlineBanner` \[#actionableinlinebanner]

- `prefixIcon`
  - type: `React.ReactNode`
- `title`
  - type: `React.ReactNode`
- `description`
  - type: `React.ReactNode`
  - required: `true`
- `variant`
  - type: `"neutralWeak" | "positiveWeak" | "informativeWeak" | "warningWeak" | "warningSolid" | "criticalWeak" | "criticalSolid" | undefined`
  - default: `"neutralWeak"`

### `DismissibleInlineBanner` \[#dismissibleinlinebanner]

- `prefixIcon`
  - type: `React.ReactNode`
- `title`
  - type: `React.ReactNode`
- `description`
  - type: `React.ReactNode`
  - required: `true`
- `variant`
  - type: `"neutralWeak" | "positiveWeak" | "informativeWeak" | "warningWeak" | "warningSolid" | undefined`
- `open`
  - type: `boolean | undefined`
- `defaultOpen`
  - type: `boolean | undefined`
- `onDismiss`
  - type: `(() => void) | undefined`

## Examples \[#examples]

### Content Layout \[#content-layout]

#### With Link Label \[#with-link-label]

<Callout type="warn">
  `linkProps` prop은 `InlineBanner`에서만 제공돼요.
</Callout>

```tsx
import { InlineBanner } from "seed-design/ui/inline-banner";

export default function InlineBannerWithLinkLabel() {
  return (
    <InlineBanner
      description="사업자 정보를 등록해주세요."
      linkProps={{ children: "자세히 보기" }}
    />
  );
}
```

#### Text Only \[#text-only]

```tsx
import { VStack } from "@seed-design/react";
import {
  ActionableInlineBanner,
  DismissibleInlineBanner,
  InlineBanner,
} from "seed-design/ui/inline-banner";

export default function InlineBannerTextOnly() {
  return (
    <VStack gap="x4" width="full">
      <InlineBanner description="사업자 정보를 등록해주세요." />
      <ActionableInlineBanner description="사업자 정보를 등록해주세요." />
      <DismissibleInlineBanner description="사업자 정보를 등록해주세요." />
    </VStack>
  );
}
```

#### With Icon \[#with-icon]

```tsx
import { IconBellFill } from "@karrotmarket/react-monochrome-icon";
import { VStack } from "@seed-design/react";
import {
  ActionableInlineBanner,
  DismissibleInlineBanner,
  InlineBanner,
} from "seed-design/ui/inline-banner";

export default function InlineBannerWithIcon() {
  return (
    <VStack gap="x4" width="full">
      <InlineBanner prefixIcon={<IconBellFill />} description="사업자 정보를 등록해주세요." />
      <ActionableInlineBanner
        prefixIcon={<IconBellFill />}
        description="사업자 정보를 등록해주세요."
      />
      <DismissibleInlineBanner
        prefixIcon={<IconBellFill />}
        description="사업자 정보를 등록해주세요."
      />
    </VStack>
  );
}
```

#### With Title Text \[#with-title-text]

```tsx
import { VStack } from "@seed-design/react";
import {
  ActionableInlineBanner,
  DismissibleInlineBanner,
  InlineBanner,
} from "seed-design/ui/inline-banner";

export default function InlineBannerWithTitleText() {
  return (
    <VStack gap="x4" width="full">
      <InlineBanner title="타이틀" description="사업자 정보를 등록해주세요." />
      <ActionableInlineBanner title="타이틀" description="사업자 정보를 등록해주세요." />
      <DismissibleInlineBanner title="타이틀" description="사업자 정보를 등록해주세요." />
    </VStack>
  );
}
```

#### With All \[#with-all]

```tsx
import { IconBellFill } from "@karrotmarket/react-monochrome-icon";
import { VStack } from "@seed-design/react";
import {
  ActionableInlineBanner,
  DismissibleInlineBanner,
  InlineBanner,
} from "seed-design/ui/inline-banner";

export default function InlineBannerWithAll() {
  return (
    <VStack gap="x4" width="full">
      <InlineBanner
        prefixIcon={<IconBellFill />}
        title="타이틀"
        description="사업자 정보를 등록해주세요."
      />
      <ActionableInlineBanner
        prefixIcon={<IconBellFill />}
        title="타이틀"
        description="사업자 정보를 등록해주세요."
      />
      <DismissibleInlineBanner
        prefixIcon={<IconBellFill />}
        title="타이틀"
        description="사업자 정보를 등록해주세요."
      />
    </VStack>
  );
}
```

### Customizable Parts \[#customizable-parts]

#### Rendering `LinkInlineBanner`’s Link Label as Child \[#rendering-linkinlinebanners-link-label-as-child]

```tsx
import { InlineBanner } from "seed-design/ui/inline-banner";

export default function InlineBannerLinkLabelAsChild() {
  return (
    <InlineBanner
      description="사업자 정보를 등록해주세요."
      linkProps={{
        asChild: true,
        children: (
          <a href="https://www.daangn.com" target="_blank" rel="noreferrer">
            자세히 보기
          </a>
        ),
      }}
    />
  );
}
```

### Variants \[#variants]

#### Neutral Weak (Default) \[#neutral-weak-default]

```tsx
import { IconBellFill } from "@karrotmarket/react-monochrome-icon";
import { VStack } from "@seed-design/react";
import {
  ActionableInlineBanner,
  DismissibleInlineBanner,
  InlineBanner,
} from "seed-design/ui/inline-banner";

export default function InlineBannerNeutralWeak() {
  return (
    <VStack gap="x4" width="full">
      <InlineBanner
        variant="neutralWeak"
        prefixIcon={<IconBellFill />}
        description="사업자 정보를 등록해주세요."
      />
      <ActionableInlineBanner
        variant="neutralWeak"
        prefixIcon={<IconBellFill />}
        description="사업자 정보를 등록해주세요."
      />
      <DismissibleInlineBanner
        variant="neutralWeak"
        prefixIcon={<IconBellFill />}
        description="사업자 정보를 등록해주세요."
      />
    </VStack>
  );
}
```

#### Positive Weak \[#positive-weak]

```tsx
import { IconCheckmarkCircleFill } from "@karrotmarket/react-monochrome-icon";
import { VStack } from "@seed-design/react";
import {
  ActionableInlineBanner,
  DismissibleInlineBanner,
  InlineBanner,
} from "seed-design/ui/inline-banner";

export default function InlineBannerPositiveWeak() {
  return (
    <VStack gap="x4" width="full">
      <InlineBanner
        variant="positiveWeak"
        prefixIcon={<IconCheckmarkCircleFill />}
        description="사업자 정보를 등록해주세요."
      />
      <ActionableInlineBanner
        variant="positiveWeak"
        prefixIcon={<IconCheckmarkCircleFill />}
        description="사업자 정보를 등록해주세요."
      />
      <DismissibleInlineBanner
        variant="positiveWeak"
        prefixIcon={<IconCheckmarkCircleFill />}
        description="사업자 정보를 등록해주세요."
      />
    </VStack>
  );
}
```

#### Informative Weak \[#informative-weak]

```tsx
import { IconILowercaseSerifCircleFill } from "@karrotmarket/react-monochrome-icon";
import { VStack } from "@seed-design/react";
import {
  ActionableInlineBanner,
  DismissibleInlineBanner,
  InlineBanner,
} from "seed-design/ui/inline-banner";

export default function InlineBannerInformativeWeak() {
  return (
    <VStack gap="x4" width="full">
      <InlineBanner
        variant="informativeWeak"
        prefixIcon={<IconILowercaseSerifCircleFill />}
        description="사업자 정보를 등록해주세요."
      />
      <ActionableInlineBanner
        variant="informativeWeak"
        prefixIcon={<IconILowercaseSerifCircleFill />}
        description="사업자 정보를 등록해주세요."
      />
      <DismissibleInlineBanner
        variant="informativeWeak"
        prefixIcon={<IconILowercaseSerifCircleFill />}
        description="사업자 정보를 등록해주세요."
      />
    </VStack>
  );
}
```

#### Warning Weak \[#warning-weak]

```tsx
import { IconExclamationmarkCircleFill } from "@karrotmarket/react-monochrome-icon";
import { VStack } from "@seed-design/react";
import {
  ActionableInlineBanner,
  DismissibleInlineBanner,
  InlineBanner,
} from "seed-design/ui/inline-banner";

export default function InlineBannerWarningWeak() {
  return (
    <VStack gap="x4" width="full">
      <InlineBanner
        variant="warningWeak"
        prefixIcon={<IconExclamationmarkCircleFill />}
        description="사업자 정보를 등록해주세요."
      />
      <ActionableInlineBanner
        variant="warningWeak"
        prefixIcon={<IconExclamationmarkCircleFill />}
        description="사업자 정보를 등록해주세요."
      />
      <DismissibleInlineBanner
        variant="warningWeak"
        prefixIcon={<IconExclamationmarkCircleFill />}
        description="사업자 정보를 등록해주세요."
      />
    </VStack>
  );
}
```

#### Warning Solid \[#warning-solid]

```tsx
import { IconExclamationmarkCircleFill } from "@karrotmarket/react-monochrome-icon";
import { VStack } from "@seed-design/react";
import {
  ActionableInlineBanner,
  DismissibleInlineBanner,
  InlineBanner,
} from "seed-design/ui/inline-banner";

export default function InlineBannerWarningSolid() {
  return (
    <VStack gap="x4" width="full">
      <InlineBanner
        variant="warningSolid"
        prefixIcon={<IconExclamationmarkCircleFill />}
        description="사업자 정보를 등록해주세요."
      />
      <ActionableInlineBanner
        variant="warningSolid"
        prefixIcon={<IconExclamationmarkCircleFill />}
        description="사업자 정보를 등록해주세요."
      />
      <DismissibleInlineBanner
        variant="warningSolid"
        prefixIcon={<IconExclamationmarkCircleFill />}
        description="사업자 정보를 등록해주세요."
      />
    </VStack>
  );
}
```

#### Critical Weak \[#critical-weak]

```tsx
import { IconExclamationmarkCircleFill } from "@karrotmarket/react-monochrome-icon";
import { VStack } from "@seed-design/react";
import { ActionableInlineBanner, InlineBanner } from "seed-design/ui/inline-banner";

export default function InlineBannerCriticalWeak() {
  return (
    <VStack gap="x4" width="full">
      <InlineBanner
        variant="criticalWeak"
        prefixIcon={<IconExclamationmarkCircleFill />}
        description="사업자 정보를 등록해주세요."
      />
      <ActionableInlineBanner
        variant="criticalWeak"
        prefixIcon={<IconExclamationmarkCircleFill />}
        description="사업자 정보를 등록해주세요."
      />
    </VStack>
  );
}
```

#### Critical Solid \[#critical-solid]

<Callout type="warn">
  `criticalWeak`과 `criticalSolid` variant는 `InlineBanner`와 `ActionableInlineBanner`에서만 제공돼요.
</Callout>

<Callout type="warn">
  variant가 `criticalWeak`이나 `criticalSolid`인 경우 `position: sticky` 등을 활용하여 화면을 스크롤했을 때도 인라인 배너가 상단에 고정되도록 해 주세요.
</Callout>

```tsx
import { ActionableInlineBanner, InlineBanner } from "seed-design/ui/inline-banner";
import { IconExclamationmarkCircleFill } from "@karrotmarket/react-monochrome-icon";
import { VStack } from "@seed-design/react";

export default function InlineBannerCriticalSolid() {
  return (
    <VStack gap="x4" width="full">
      <InlineBanner
        variant="criticalSolid"
        prefixIcon={<IconExclamationmarkCircleFill />}
        description="사업자 정보를 등록해주세요."
      />
      <ActionableInlineBanner
        variant="criticalSolid"
        prefixIcon={<IconExclamationmarkCircleFill />}
        description="사업자 정보를 등록해주세요."
      />
    </VStack>
  );
}
```