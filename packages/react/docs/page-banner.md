file: components/page-banner.mdx

# Page Banner

페이지 상단에 위치하며 사용자에게 전체적인 상태나 중요한 메시지를 전달하는 상위 레벨 메시지 컴포넌트입니다.

사용 가능 버전: @seed-design/react@0.1.14, @seed-design/css@0.1.14

## Preview

```tsx
import { VStack } from "@seed-design/react";
import {
  ActionablePageBanner,
  DismissiblePageBanner,
  PageBanner,
} from "seed-design/ui/page-banner";

export default function PageBannerPreview() {
  return (
    <VStack gap="x4" width="full">
      <PageBanner description="Ut veniam in ea ea anim laborum magna dolore ea laborum duis ut aute mollit amet." />
      <ActionablePageBanner description="Ut veniam in ea ea anim laborum magna dolore ea laborum duis ut aute mollit amet." />
      <DismissiblePageBanner description="Ut veniam in ea ea anim laborum magna dolore ea laborum duis ut aute mollit amet." />
    </VStack>
  );
}
```

## Installation \[#installation]

- npm: npx @seed-design/cli@latest add ui:page-banner
- pnpm: pnpm dlx @seed-design/cli@latest add ui:page-banner
- yarn: yarn dlx @seed-design/cli@latest add ui:page-banner
- bun: bun x @seed-design/cli@latest add ui:page-banner

<ManualInstallation name="page-banner" />

## Props \[#props]

### `PageBanner` \[#pagebanner]

- `prefixIcon`
  - type: `React.ReactNode`
- `title`
  - type: `React.ReactNode`
- `description`
  - type: `React.ReactNode`
  - required: `true`
- `suffix`
  - type: `React.ReactNode`
- `variant`
  - type: `"weak" | "solid" | undefined`
  - default: `"weak"`
  - description: - \`weak\`: 배경색이 연한 스타일입니다. - \`solid\`: 배경색이 진한 스타일입니다.
- `tone`
  - type: `"neutral" | "informative" | "positive" | "warning" | "critical" | "magic" | undefined`
  - default: `"neutral"`
  - description: - \`magic\`: AI 기능을 나타냅니다. variant=solid와 조합하여 사용하지 않습니다.

### `PageBannerButton` \[#pagebannerbutton]

- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.

### `ActionablePageBanner` \[#actionablepagebanner]

- `prefixIcon`
  - type: `React.ReactNode`
- `title`
  - type: `React.ReactNode`
- `description`
  - type: `React.ReactNode`
  - required: `true`
- `variant`
  - type: `"weak" | "solid" | undefined`
  - default: `"weak"`
  - description: - \`weak\`: 배경색이 연한 스타일입니다. - \`solid\`: 배경색이 진한 스타일입니다.
- `tone`
  - type: `"neutral" | "informative" | "positive" | "warning" | "critical" | "magic" | undefined`
  - default: `"neutral"`
  - description: - \`magic\`: AI 기능을 나타냅니다. variant=solid와 조합하여 사용하지 않습니다.

### `DismissiblePageBanner` \[#dismissiblepagebanner]

- `prefixIcon`
  - type: `React.ReactNode`
- `title`
  - type: `React.ReactNode`
- `description`
  - type: `React.ReactNode`
  - required: `true`
- `open`
  - type: `boolean | undefined`
- `defaultOpen`
  - type: `boolean | undefined`
- `onDismiss`
  - type: `(() => void) | undefined`
- `variant`
  - type: `"weak" | "solid" | undefined`
  - default: `"weak"`
  - description: - \`weak\`: 배경색이 연한 스타일입니다. - \`solid\`: 배경색이 진한 스타일입니다.
- `tone`
  - type: `"neutral" | "informative" | "positive" | "warning" | "critical" | "magic" | undefined`
  - default: `"neutral"`
  - description: - \`magic\`: AI 기능을 나타냅니다. variant=solid와 조합하여 사용하지 않습니다.

## Examples \[#examples]

### With Button \[#with-button]

`PageBanner`의 `suffix` prop에 `PageBannerButton`을 전달하여 버튼을 추가할 수 있습니다.

```tsx
import { PageBanner, PageBannerButton } from "seed-design/ui/page-banner";

export default function PageBannerWithButton() {
  return (
    <PageBanner
      description="사업자 정보를 등록해주세요."
      suffix={<PageBannerButton>자세히 보기</PageBannerButton>}
    />
  );
}
```

### Rendering `PageBannerButton` as a Child \[#rendering-pagebannerbutton-as-a-child]

```tsx
import { PageBanner, PageBannerButton } from "seed-design/ui/page-banner";

export default function PageBannerButtonAsChild() {
  return (
    <PageBanner
      description="사업자 정보를 등록해주세요."
      suffix={
        <PageBannerButton asChild>
          <a href="https://www.daangn.com" target="_blank" rel="noreferrer">
            새 탭에서 열기
          </a>
        </PageBannerButton>
      }
    />
  );
}
```

### Tones and Variants \[#tones-and-variants]

#### Neutral \[#neutral]

```tsx
import { IconExclamationmarkCircleFill } from "@karrotmarket/react-monochrome-icon";
import {
  ActionablePageBanner,
  DismissiblePageBanner,
  PageBanner,
  PageBannerButton,
} from "seed-design/ui/page-banner";

export default function PageBannerNeutral() {
  return (
    <div className="w-full grid grid-cols-2 items-start gap-4">
      <PageBanner
        tone="neutral"
        variant="weak"
        prefixIcon={<IconExclamationmarkCircleFill />}
        title="미노출"
        description="사업자 정보를 등록해주세요."
        suffix={<PageBannerButton>등록하기</PageBannerButton>}
      />
      <PageBanner
        tone="neutral"
        variant="solid"
        prefixIcon={<IconExclamationmarkCircleFill />}
        title="미노출"
        description="사업자 정보를 등록해주세요."
        suffix={<PageBannerButton>등록하기</PageBannerButton>}
      />
      <ActionablePageBanner
        tone="neutral"
        variant="weak"
        prefixIcon={<IconExclamationmarkCircleFill />}
        title="미노출"
        description="사업자 정보를 등록해주세요."
      />
      <ActionablePageBanner
        tone="neutral"
        variant="solid"
        prefixIcon={<IconExclamationmarkCircleFill />}
        title="미노출"
        description="사업자 정보를 등록해주세요."
      />
      <DismissiblePageBanner
        tone="neutral"
        variant="weak"
        prefixIcon={<IconExclamationmarkCircleFill />}
        title="미노출"
        description="사업자 정보를 등록해주세요."
      />
      <DismissiblePageBanner
        tone="neutral"
        variant="solid"
        prefixIcon={<IconExclamationmarkCircleFill />}
        title="미노출"
        description="사업자 정보를 등록해주세요."
      />
    </div>
  );
}
```

#### Positive \[#positive]

```tsx
import { IconExclamationmarkCircleFill } from "@karrotmarket/react-monochrome-icon";
import {
  ActionablePageBanner,
  DismissiblePageBanner,
  PageBanner,
  PageBannerButton,
} from "seed-design/ui/page-banner";

export default function PageBannerPositive() {
  return (
    <div className="w-full grid grid-cols-2 items-start gap-4">
      <PageBanner
        tone="positive"
        variant="weak"
        prefixIcon={<IconExclamationmarkCircleFill />}
        title="미노출"
        description="사업자 정보를 등록해주세요."
        suffix={<PageBannerButton>등록하기</PageBannerButton>}
      />
      <PageBanner
        tone="positive"
        variant="solid"
        prefixIcon={<IconExclamationmarkCircleFill />}
        title="미노출"
        description="사업자 정보를 등록해주세요."
        suffix={<PageBannerButton>등록하기</PageBannerButton>}
      />
      <ActionablePageBanner
        tone="positive"
        variant="weak"
        prefixIcon={<IconExclamationmarkCircleFill />}
        title="미노출"
        description="사업자 정보를 등록해주세요."
      />
      <ActionablePageBanner
        tone="positive"
        variant="solid"
        prefixIcon={<IconExclamationmarkCircleFill />}
        title="미노출"
        description="사업자 정보를 등록해주세요."
      />
      <DismissiblePageBanner
        tone="positive"
        variant="weak"
        prefixIcon={<IconExclamationmarkCircleFill />}
        title="미노출"
        description="사업자 정보를 등록해주세요."
      />
      <DismissiblePageBanner
        tone="positive"
        variant="solid"
        prefixIcon={<IconExclamationmarkCircleFill />}
        title="미노출"
        description="사업자 정보를 등록해주세요."
      />
    </div>
  );
}
```

#### Informative \[#informative]

```tsx
import { IconExclamationmarkCircleFill } from "@karrotmarket/react-monochrome-icon";
import {
  ActionablePageBanner,
  DismissiblePageBanner,
  PageBanner,
  PageBannerButton,
} from "seed-design/ui/page-banner";

export default function PageBannerInformative() {
  return (
    <div className="w-full grid grid-cols-2 items-start gap-4">
      <PageBanner
        tone="informative"
        variant="weak"
        prefixIcon={<IconExclamationmarkCircleFill />}
        title="미노출"
        description="사업자 정보를 등록해주세요."
        suffix={<PageBannerButton>등록하기</PageBannerButton>}
      />
      <PageBanner
        tone="informative"
        variant="solid"
        prefixIcon={<IconExclamationmarkCircleFill />}
        title="미노출"
        description="사업자 정보를 등록해주세요."
        suffix={<PageBannerButton>등록하기</PageBannerButton>}
      />
      <ActionablePageBanner
        tone="informative"
        variant="weak"
        prefixIcon={<IconExclamationmarkCircleFill />}
        title="미노출"
        description="사업자 정보를 등록해주세요."
      />
      <ActionablePageBanner
        tone="informative"
        variant="solid"
        prefixIcon={<IconExclamationmarkCircleFill />}
        title="미노출"
        description="사업자 정보를 등록해주세요."
      />
      <DismissiblePageBanner
        tone="informative"
        variant="weak"
        prefixIcon={<IconExclamationmarkCircleFill />}
        title="미노출"
        description="사업자 정보를 등록해주세요."
      />
      <DismissiblePageBanner
        tone="informative"
        variant="solid"
        prefixIcon={<IconExclamationmarkCircleFill />}
        title="미노출"
        description="사업자 정보를 등록해주세요."
      />
    </div>
  );
}
```

#### Warning \[#warning]

```tsx
import { IconExclamationmarkCircleFill } from "@karrotmarket/react-monochrome-icon";
import {
  ActionablePageBanner,
  DismissiblePageBanner,
  PageBanner,
  PageBannerButton,
} from "seed-design/ui/page-banner";

export default function PageBannerWarning() {
  return (
    <div className="w-full grid grid-cols-2 items-start gap-4">
      <PageBanner
        tone="warning"
        variant="weak"
        prefixIcon={<IconExclamationmarkCircleFill />}
        title="미노출"
        description="사업자 정보를 등록해주세요."
        suffix={<PageBannerButton>등록하기</PageBannerButton>}
      />
      <PageBanner
        tone="warning"
        variant="solid"
        prefixIcon={<IconExclamationmarkCircleFill />}
        title="미노출"
        description="사업자 정보를 등록해주세요."
        suffix={<PageBannerButton>등록하기</PageBannerButton>}
      />
      <ActionablePageBanner
        tone="warning"
        variant="weak"
        prefixIcon={<IconExclamationmarkCircleFill />}
        title="미노출"
        description="사업자 정보를 등록해주세요."
      />
      <ActionablePageBanner
        tone="warning"
        variant="solid"
        prefixIcon={<IconExclamationmarkCircleFill />}
        title="미노출"
        description="사업자 정보를 등록해주세요."
      />
      <DismissiblePageBanner
        tone="warning"
        variant="weak"
        prefixIcon={<IconExclamationmarkCircleFill />}
        title="미노출"
        description="사업자 정보를 등록해주세요."
      />
      <DismissiblePageBanner
        tone="warning"
        variant="solid"
        prefixIcon={<IconExclamationmarkCircleFill />}
        title="미노출"
        description="사업자 정보를 등록해주세요."
      />
    </div>
  );
}
```

#### Critical \[#critical]

```tsx
import { IconExclamationmarkCircleFill } from "@karrotmarket/react-monochrome-icon";
import {
  ActionablePageBanner,
  DismissiblePageBanner,
  PageBanner,
  PageBannerButton,
} from "seed-design/ui/page-banner";

export default function PageBannerCritical() {
  return (
    <div className="w-full grid grid-cols-2 items-start gap-4">
      <PageBanner
        tone="critical"
        variant="weak"
        prefixIcon={<IconExclamationmarkCircleFill />}
        title="미노출"
        description="사업자 정보를 등록해주세요."
        suffix={<PageBannerButton>등록하기</PageBannerButton>}
      />
      <PageBanner
        tone="critical"
        variant="solid"
        prefixIcon={<IconExclamationmarkCircleFill />}
        title="미노출"
        description="사업자 정보를 등록해주세요."
        suffix={<PageBannerButton>등록하기</PageBannerButton>}
      />
      <ActionablePageBanner
        tone="critical"
        variant="weak"
        prefixIcon={<IconExclamationmarkCircleFill />}
        title="미노출"
        description="사업자 정보를 등록해주세요."
      />
      <ActionablePageBanner
        tone="critical"
        variant="solid"
        prefixIcon={<IconExclamationmarkCircleFill />}
        title="미노출"
        description="사업자 정보를 등록해주세요."
      />
      <DismissiblePageBanner
        tone="critical"
        variant="weak"
        prefixIcon={<IconExclamationmarkCircleFill />}
        title="미노출"
        description="사업자 정보를 등록해주세요."
      />
      <DismissiblePageBanner
        tone="critical"
        variant="solid"
        prefixIcon={<IconExclamationmarkCircleFill />}
        title="미노출"
        description="사업자 정보를 등록해주세요."
      />
    </div>
  );
}
```

#### Magic \[#magic]

<Callout type="warning">
  `tone="magic"`은 `variant="weak"` 조합으로만 사용할 수 있습니다.
</Callout>

```tsx
import { IconSparkle2 } from "@karrotmarket/react-multicolor-icon";
import { VStack } from "@seed-design/react";
import {
  ActionablePageBanner,
  DismissiblePageBanner,
  PageBanner,
  PageBannerButton,
} from "seed-design/ui/page-banner";

export default function PageBannerMagic() {
  return (
    <VStack gap="x4" width="full">
      <PageBanner
        tone="magic"
        variant="weak"
        prefixIcon={<IconSparkle2 />}
        title="새로운 기능"
        description="마법 같은 소식이 도착했어요!"
        suffix={<PageBannerButton>둘러보기</PageBannerButton>}
      />
      <ActionablePageBanner
        tone="magic"
        variant="weak"
        prefixIcon={<IconSparkle2 />}
        title="새로운 기능"
        description="마법 같은 소식이 도착했어요!"
      />
      <DismissiblePageBanner
        tone="magic"
        variant="weak"
        prefixIcon={<IconSparkle2 />}
        title="새로운 기능"
        description="마법 같은 소식이 도착했어요!"
      />
    </VStack>
  );
}
```