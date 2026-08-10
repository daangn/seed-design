file: components/result-section.mdx

# Result Section

데이터 로딩 결과, 사용자의 액션 완료 여부 등 사용자에 액션에 대한 결과를 제공하는 템플릿입니다. 주로 전체 화면이나 특정 영역을 차지하여 다음 액션을 유도하거나 현재 상황을 안내하는 역할을 합니다.

사용 가능 버전: @seed-design/react@1.1.10, @seed-design/css@1.1.10

## Preview

```tsx
import { IconDiamond } from "@karrotmarket/react-multicolor-icon";
import { VStack, Icon, Box } from "@seed-design/react";
import { ResultSection } from "seed-design/ui/result-section";

export default function ResultSectionPreview() {
  return (
    <VStack minHeight="480px" width="320px" borderWidth={1} borderColor="stroke.neutralMuted">
      <ResultSection
        asset={
          <Box pb="x4">
            <Icon svg={<IconDiamond />} size="x10" />
          </Box>
        }
        title="결과 타이틀"
        description="부가 설명을 적어주세요"
        primaryActionProps={{
          children: "Primary Action",
          onClick: () => window.alert("Primary Action Clicked"),
        }}
        secondaryActionProps={{
          children: "Secondary Action",
          onClick: () => window.alert("Secondary Action Clicked"),
        }}
      />
    </VStack>
  );
}
```

## Installation \[#installation]

- npm: npx @seed-design/cli@latest add ui:result-section
- pnpm: pnpm dlx @seed-design/cli@latest add ui:result-section
- yarn: yarn dlx @seed-design/cli@latest add ui:result-section
- bun: bun x @seed-design/cli@latest add ui:result-section

<ManualInstallation name="result-section" />

## Props \[#props]

- `size`
  - type: `"large" | "medium" | undefined`
  - default: `"large"`
- `asset`
  - type: `React.ReactNode`
- `title`
  - type: `React.ReactNode`
- `description`
  - type: `React.ReactNode`
- `primaryActionProps`
  - type: `ActionButtonProps | undefined`
- `secondaryActionProps`
  - type: `ActionButtonProps | undefined`

## Examples \[#examples]

### Sizes \[#sizes]

#### Large \[#large]

```tsx
import { VStack } from "@seed-design/react";
import { ResultSection } from "seed-design/ui/result-section";

export default function ResultSectionLarge() {
  return (
    <VStack minHeight="480px" width="320px" borderWidth={1} borderColor="stroke.neutralMuted">
      <ResultSection
        size="large"
        title="cupidatat ad consequat"
        description="Lorem ipsum dolor sit amet consectetur adipisicing elit."
        primaryActionProps={{
          children: "Primary Action",
        }}
        secondaryActionProps={{
          children: "Secondary Action",
        }}
      />
    </VStack>
  );
}
```

#### Medium \[#medium]

```tsx
import { VStack } from "@seed-design/react";
import { ResultSection } from "seed-design/ui/result-section";

export default function ResultSectionMedium() {
  return (
    <VStack minHeight="480px" width="320px" borderWidth={1} borderColor="stroke.neutralMuted">
      <ResultSection
        size="medium"
        title="cupidatat ad consequat"
        description="Lorem ipsum dolor sit amet consectetur adipisicing elit."
        primaryActionProps={{
          children: "Primary Action",
        }}
        secondaryActionProps={{
          children: "Secondary Action",
        }}
      />
    </VStack>
  );
}
```

### With CTA & Progress Circle \[#with-cta--progress-circle]

<StackflowExample path="/result-section-cta-progress-circle">
  ```tsx
  import { ActionButton } from "seed-design/ui/action-button";
  import { AppBar, AppBarMain } from "seed-design/ui/app-bar";
  import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";
  import { ProgressCircle } from "seed-design/ui/progress-circle";
  import { ResultSection } from "seed-design/ui/result-section";
  import { IconExclamationmarkCircleFill } from "@karrotmarket/react-monochrome-icon";
  import { Box, Flex, Icon, VStack } from "@seed-design/react";
  import { type StaticActivityComponentType } from "@stackflow/react/future";
  import { useEffect, useState, type ComponentProps } from "react";

  declare module "@stackflow/config" {
    interface Register {
      ActivityResultSectionCtaProgressCircle: {};
    }
  }

  type RefundStatus = "in-progress" | "failed";

  const resultSectionProperties = {
    "in-progress": {
      title: "환불을 요청하고 있어요",
      description: "잠시만 기다려주세요",
      asset: (
        <Box pb="x4">
          <ProgressCircle size="40" />
        </Box>
      ),
    },
    failed: {
      title: "다시 시도해주세요",
      description: "환불 요청에 실패했어요",
      asset: (
        <Box pb="x4">
          <Icon svg={<IconExclamationmarkCircleFill />} size="x10" color="fg.critical" />
        </Box>
      ),
    },
  } satisfies Record<RefundStatus, ComponentProps<typeof ResultSection>>;

  const ActivityResultSectionCtaProgressCircle: StaticActivityComponentType<
    "ActivityResultSectionCtaProgressCircle"
  > = () => {
    const [refundStatus, setRefundStatus] = useState<RefundStatus>("in-progress");

    useEffect(() => {
      const timer = setTimeout(() => setRefundStatus("failed"), 3000);

      return () => clearTimeout(timer);
    }, []);

    return (
      <AppScreen>
        <AppBar>
          <AppBarMain title="환불 요청" />
        </AppBar>
        <AppScreenContent>
          <VStack grow gap="x4" height="full" pb="safeArea">
            <ResultSection {...resultSectionProperties[refundStatus]} />
            <Flex p="x4" px="spacingX.globalGutter" pt="x3" pb="x2">
              <ActionButton
                flexGrow
                size="large"
                variant="neutralSolid"
                disabled={refundStatus === "in-progress"}
                loading={refundStatus === "in-progress"}
                onClick={() => {
                  setRefundStatus("in-progress");

                  setTimeout(() => setRefundStatus("failed"), 3000);
                }}
              >
                다시 시도
              </ActionButton>
            </Flex>
          </VStack>
        </AppScreenContent>
      </AppScreen>
    );
  };

  export default ActivityResultSectionCtaProgressCircle;
  ```
</StackflowExample>

### Success Example \[#success-example]

Result Section 에셋 영역에서 다크 모드와 라이트 모드에서 서로 다른 Lottie 애니메이션을 사용하는 예시입니다.

[클라이언트에서 현재 테마 정보 감지하는 방법](/react/getting-started/styling/theming#클라이언트에서-현재-테마-정보-감지하기)을 참고하여 테마에 맞는 Lottie 애니메이션을 Result Section에 적용할 수 있습니다.

```tsx
import dynamic from "next/dynamic";
import { VStack, Box } from "@seed-design/react";
import { ResultSection } from "seed-design/ui/result-section";
import { useTheme } from "@/hooks/useTheme";

const Player = dynamic(() => import("@lottiefiles/react-lottie-player").then((mod) => mod.Player), {
  ssr: false,
});

const LOTTIE_URLS = {
  light:
    "https://asset-town.krrt.io/production/motion/bd9f3c71-5b81-40b0-8eea-eeebd668edae/c17fa891bb007b9e4e6b281e483b5491cb905703.json",
  dark: "https://asset-town.krrt.io/production/motion/19bf4654-5286-4def-a651-c674a20ce1ee/89c9e404edc356cf143dab80b627fde01ed8a8fb.json",
};

export default function ResultSectionSuccessWithLottie() {
  const { userColorScheme } = useTheme();
  const lottieUrl = LOTTIE_URLS[userColorScheme];

  return (
    <VStack minHeight="480px" width="320px" borderWidth={1} borderColor="stroke.neutralMuted">
      <ResultSection
        asset={
          <Box pb="x4">
            <Player
              src={lottieUrl}
              autoplay
              loop={false}
              keepLastFrame
              style={{ width: 70, height: 70 }}
            />
          </Box>
        }
        title="성공했어요"
        description="요청이 성공적으로 완료되었습니다"
        primaryActionProps={{
          children: "확인",
          onClick: () => window.alert("확인 클릭"),
        }}
      />
    </VStack>
  );
}
```