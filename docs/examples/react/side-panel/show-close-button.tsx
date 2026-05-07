import { Flex } from "@seed-design/react";
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
          <SidePanelBody>닫기 버튼이 표시됩니다 (기본값)</SidePanelBody>
        </SidePanelContent>
      </SidePanelRoot>

      <SidePanelRoot>
        <SidePanelTrigger asChild>
          <ActionButton variant="neutralSolid">닫기 버튼 없음</ActionButton>
        </SidePanelTrigger>
        <SidePanelContent title="닫기 버튼 없음" showCloseButton={false}>
          <SidePanelBody>닫기 버튼이 숨겨집니다</SidePanelBody>
        </SidePanelContent>
      </SidePanelRoot>
    </Flex>
  );
};

export default SidePanelShowCloseButton;
