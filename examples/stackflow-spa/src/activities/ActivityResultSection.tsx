import type { StaticActivityComponentType } from "@stackflow/react/future";

import React from "react";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";
import { ResultSection, type ResultSectionProps } from "seed-design/ui/result-section";
import { AppBar, AppBarLeft, AppBarMain, AppBarBackButton } from "seed-design/ui/app-bar";
import { Box, Icon, VStack } from "@seed-design/react";
import { IconDiamond } from "@karrotmarket/react-multicolor-icon";

declare module "@stackflow/config" {
  interface Register {
    ActivityResultSection: {};
  }
}

const ActivityResultSection: StaticActivityComponentType<"ActivityResultSection"> = () => {
  const [size, setSize] = React.useState<ResultSectionProps["size"]>("large");
  const [showAsset, setShowAsset] = React.useState(true);
  return (
    <AppScreen>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain>Result Section</AppBarMain>
      </AppBar>
      <AppScreenContent
        ptr
        onPtrRefresh={async () => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }}
      >
        <VStack height="full">
          <ResultSection
            size={size}
            asset={
              showAsset ? (
                <Box pb="x4">
                  <Icon svg={<IconDiamond />} size="x10" />
                </Box>
              ) : undefined
            }
            title="완료되었어요"
            description={
              "요청하신 작업이 성공적으로 완료되었습니다.\n확인 후 다음 단계로 진행해주세요."
            }
            primaryActionProps={{
              children: showAsset ? "에셋 숨김" : "에셋 표시",
              onClick: () => setShowAsset((prev) => !prev),
            }}
            secondaryActionProps={{
              children: size === "large" ? "medium으로 전환" : "large로 전환",
              onClick: () => setSize((prev) => (prev === "large" ? "medium" : "large")),
            }}
          />
        </VStack>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityResultSection;
