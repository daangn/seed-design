import type { StaticActivityComponentType } from "@stackflow/react/future";

import React from "react";
import { NextAppScreen, NextAppScreenContent } from "seed-design/ui/next-app-screen";
import { ResultSection, type ResultSectionProps } from "seed-design/ui/result-section";
import {
  NextAppBar,
  NextAppBarLeft,
  NextAppBarMain,
  NextAppBarBackButton,
} from "seed-design/ui/next-app-bar";
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
    <NextAppScreen>
      <NextAppBar>
        <NextAppBarLeft>
          <NextAppBarBackButton />
        </NextAppBarLeft>
        <NextAppBarMain>Result Section</NextAppBarMain>
      </NextAppBar>
      <NextAppScreenContent
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
      </NextAppScreenContent>
    </NextAppScreen>
  );
};

export default ActivityResultSection;
