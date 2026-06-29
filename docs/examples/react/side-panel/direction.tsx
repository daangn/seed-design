import { Flex } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  SidePanelBody,
  SidePanelContent,
  SidePanelRoot,
  SidePanelTrigger,
} from "seed-design/ui/side-panel";

const SidePanelDirection = () => {
  return (
    <Flex gap="x3" wrap="wrap">
      <SidePanelRoot direction="right">
        <SidePanelTrigger asChild>
          <ActionButton variant="neutralSolid">Right</ActionButton>
        </SidePanelTrigger>
        <SidePanelContent title="Right Side Panel">
          <SidePanelBody paddingX="x6">
            오른쪽 가장자리에서 슬라이드되어 보조 콘텐츠를 표시합니다.
          </SidePanelBody>
        </SidePanelContent>
      </SidePanelRoot>

      <SidePanelRoot direction="left">
        <SidePanelTrigger asChild>
          <ActionButton variant="neutralSolid">Left</ActionButton>
        </SidePanelTrigger>
        <SidePanelContent title="Left Side Panel">
          <SidePanelBody paddingX="x6">
            왼쪽 가장자리에서 슬라이드되어 탐색이나 설정 영역을 표시합니다.
          </SidePanelBody>
        </SidePanelContent>
      </SidePanelRoot>
    </Flex>
  );
};

export default SidePanelDirection;
