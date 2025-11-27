import { ActionButton } from "seed-design/ui/action-button";
import { AppBar, AppBarMain } from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";
import { ProgressCircle } from "seed-design/ui/progress-circle";
import { ResultSection } from "seed-design/ui/result-section";
import { IconExclamationmarkCircleFill } from "@karrotmarket/react-monochrome-icon";
import { Box, Flex, Icon, VStack } from "@seed-design/react";
import { ActivityComponentType } from "@stackflow/react/future";
import { useEffect, useState, type ComponentProps } from "react";

declare module "@stackflow/config" {
  interface Register {
    "react/result-section/cta-progress-circle": {};
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

const ResultSectionStackflow: ActivityComponentType<
  "react/result-section/cta-progress-circle"
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
          <Flex p="x4" width="full" px="spacingX.globalGutter" pt="x3" pb="x2">
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

export default ResultSectionStackflow;
