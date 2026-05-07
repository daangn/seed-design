import { Flex } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  SidePanelBody,
  SidePanelContent,
  SidePanelRoot,
  SidePanelTrigger,
} from "seed-design/ui/side-panel";

const SidePanelCustomSize = () => {
  return (
    <Flex gap="x3" wrap="wrap">
      <SidePanelRoot direction="right">
        <SidePanelTrigger asChild>
          <ActionButton variant="neutralSolid">width 50vw</ActionButton>
        </SidePanelTrigger>
        <SidePanelContent title="Fluid Width" width="50vw">
          <SidePanelBody>뷰포트 너비의 50%를 차지합니다</SidePanelBody>
        </SidePanelContent>
      </SidePanelRoot>

      <SidePanelRoot direction="left">
        <SidePanelTrigger asChild>
          <ActionButton variant="neutralSolid">width 400px</ActionButton>
        </SidePanelTrigger>
        <SidePanelContent title="Fixed Width" width="400px">
          <SidePanelBody>고정된 400px 너비의 Side Panel</SidePanelBody>
        </SidePanelContent>
      </SidePanelRoot>
    </Flex>
  );
};

export default SidePanelCustomSize;
