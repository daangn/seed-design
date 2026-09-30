import type { StaticActivityComponentType } from "@stackflow/react/future";

import { useFlow } from "@stackflow/react/future";
import { useState } from "react";
import {
  AppBar,
  AppBarLeft,
  AppBarMain,
  AppBarBackButton,
  AppBarIconButton,
  AppBarRight,
} from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";
import { ActionButton } from "seed-design/ui/action-button";
import { Badge, type BadgeProps } from "seed-design/ui/badge";
import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
  BottomSheetTrigger,
} from "seed-design/ui/bottom-sheet";
import { HelpBubbleTooltipTrigger } from "seed-design/ui/help-bubble-tooltip";
import { IconHeartFill, IconHouseLine } from "@karrotmarket/react-monochrome-icon";
import { HStack, Portal, Text, VStack } from "@seed-design/react";
import { useActivityZIndexBase } from "@seed-design/stackflow";
import { badgeVariantMap } from "@seed-design/css/recipes/badge";

declare module "@stackflow/config" {
  interface Register {
    ActivityBadge: {};
  }
}

const SIZE_TYPOGRAPHY = {
  medium: { label: "t1", textStyle: "t1Bold" },
  large: { label: "t2", textStyle: "t2Bold" },
} as const;

const LOREM = "Est eiusmod sit do minim sunt incididunt aliqua et sit.";

function BottomSheetBadge({ size }: { size: BadgeProps["size"] }) {
  const [open, setOpen] = useState(false);
  const layerIndex = useActivityZIndexBase({ activityOffset: 1 });

  return (
    <BottomSheetRoot open={open} onOpenChange={setOpen}>
      <Badge
        size={size}
        variant="outline"
        actionProps={{
          "aria-label": "집주인 인증 안내",
          render: (trigger) => <BottomSheetTrigger asChild>{trigger}</BottomSheetTrigger>,
        }}
      >
        집주인
      </Badge>
      <Portal>
        <BottomSheetContent
          title="집주인 인증 매물"
          description="집주인이 직접 등록한 매물에 표시돼요."
          layerIndex={layerIndex}
        >
          <BottomSheetBody>
            매물을 올린 사람이 집주인임을 확인할 수 있어, 중개소에서 등록한 매물과 구분할 수 있어요.
          </BottomSheetBody>
          <BottomSheetFooter>
            <ActionButton variant="brandSolid" onClick={() => setOpen(false)}>
              확인
            </ActionButton>
          </BottomSheetFooter>
        </BottomSheetContent>
      </Portal>
    </BottomSheetRoot>
  );
}

const ActivityBadge: StaticActivityComponentType<"ActivityBadge"> = () => {
  const { push } = useFlow();

  return (
    <AppScreen layerOffsetBottom="safeArea">
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain>Badge</AppBarMain>
        <AppBarRight>
          <AppBarIconButton aria-label="Home" onClick={() => push("ActivityHome", {})}>
            <IconHouseLine />
          </AppBarIconButton>
        </AppBarRight>
      </AppBar>
      <AppScreenContent>
        <VStack gap="x8" px="spacingX.globalGutter" py="x4">
          {badgeVariantMap.size.map((size) => (
            <VStack key={size} gap="x4">
              <Text textStyle="t4Bold">{size}</Text>
              <Text textStyle={SIZE_TYPOGRAPHY[size].textStyle}>
                {SIZE_TYPOGRAPHY[size].label} {LOREM}
              </Text>
              <HStack gap="x2" wrap>
                {badgeVariantMap.variant.map((variant) => (
                  <VStack key={variant} gap="x2">
                    {badgeVariantMap.tone.map((tone) => (
                      <Badge key={tone} size={size} variant={variant} tone={tone}>
                        {SIZE_TYPOGRAPHY[size].label} {LOREM}
                      </Badge>
                    ))}
                  </VStack>
                ))}
              </HStack>

              <VStack gap="x2">
                <Text textStyle="t2Medium" color="fg.neutralMuted">
                  Prefix
                </Text>
                <HStack gap="x2" wrap>
                  {badgeVariantMap.variant.map((variant) => (
                    <VStack key={variant} gap="x2" align="flex-start">
                      {badgeVariantMap.tone.map((tone) => (
                        <Badge
                          key={tone}
                          size={size}
                          variant={variant}
                          tone={tone}
                          prefix={<IconHeartFill />}
                        >
                          관심 등록
                        </Badge>
                      ))}
                    </VStack>
                  ))}
                </HStack>
              </VStack>

              <VStack gap="x2">
                <Text textStyle="t2Medium" color="fg.neutralMuted">
                  Action
                </Text>
                <HStack gap="x2" wrap>
                  <Badge
                    size={size}
                    variant="weak"
                    actionProps={{
                      "aria-label": "도움말",
                      render: (trigger) => (
                        <HelpBubbleTooltipTrigger title="판매 완료된 상품이에요">
                          {trigger}
                        </HelpBubbleTooltipTrigger>
                      ),
                    }}
                  >
                    판매 완료
                  </Badge>
                  <BottomSheetBadge size={size} />
                  <Badge
                    size={size}
                    variant="solid"
                    tone="brand"
                    prefix={<IconHeartFill />}
                    actionProps={{
                      "aria-label": "관심 등록 안내",
                      render: (trigger) => (
                        <HelpBubbleTooltipTrigger title="관심 등록한 이웃이 많은 상품이에요">
                          {trigger}
                        </HelpBubbleTooltipTrigger>
                      ),
                    }}
                  >
                    관심 등록
                  </Badge>
                </HStack>
              </VStack>

              <VStack gap="x2">
                <Text textStyle="t2Medium" color="fg.neutralMuted">
                  Truncate
                </Text>
                <HStack gap="x2" wrap>
                  <Badge size={size} style={{ maxWidth: 120 }}>
                    {LOREM}
                  </Badge>
                  <Badge
                    size={size}
                    style={{ maxWidth: 160 }}
                    prefix={<IconHeartFill />}
                    actionProps={{
                      "aria-label": "도움말",
                      render: (trigger) => (
                        <HelpBubbleTooltipTrigger title={LOREM}>{trigger}</HelpBubbleTooltipTrigger>
                      ),
                    }}
                  >
                    {LOREM}
                  </Badge>
                </HStack>
              </VStack>
            </VStack>
          ))}
        </VStack>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityBadge;
