import { Box, Flex } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  SidePanelBody,
  SidePanelContent,
  SidePanelRoot,
  SidePanelTrigger,
} from "seed-design/ui/side-panel";

const SidePanelShowCloseButton = () => {
  return (
    <Flex gap="x3">
      <SidePanelRoot>
        <SidePanelTrigger asChild>
          <ActionButton variant="neutralSolid">닫기 버튼 있음</ActionButton>
        </SidePanelTrigger>
        <SidePanelContent title="닫기 버튼" showCloseButton>
          <SidePanelBody paddingX="x6">
            <Box py="x4">
              기본적으로 닫기 버튼이 표시되어 패널을 바로 닫을 수 있습니다.
            </Box>
          </SidePanelBody>
        </SidePanelContent>
      </SidePanelRoot>

      <SidePanelRoot>
        <SidePanelTrigger asChild>
          <ActionButton variant="neutralSolid">닫기 버튼 없음</ActionButton>
        </SidePanelTrigger>
        <SidePanelContent title="닫기 버튼 없음" showCloseButton={false}>
          <SidePanelBody paddingX="x6">
            <Box py="x4">
              닫기 버튼을 숨길 때는 본문이나 푸터에 닫을 수 있는 액션을 제공하세요.
            </Box>
          </SidePanelBody>
        </SidePanelContent>
      </SidePanelRoot>
    </Flex>
  );
};

export default SidePanelShowCloseButton;
