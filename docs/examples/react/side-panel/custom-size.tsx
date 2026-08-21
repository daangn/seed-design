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
          <ActionButton variant="neutralSolid">width 80vw, max 640px</ActionButton>
        </SidePanelTrigger>
        <SidePanelContent title="Fluid Width" width="80vw" maxWidth="640px">
          <SidePanelBody paddingX="x6">
            뷰포트 너비에 따라 커지되 최대 640px까지만 확장됩니다.
          </SidePanelBody>
        </SidePanelContent>
      </SidePanelRoot>

      <SidePanelRoot direction="left">
        <SidePanelTrigger asChild>
          <ActionButton variant="neutralSolid">width 400px</ActionButton>
        </SidePanelTrigger>
        <SidePanelContent title="Fixed Width" width="400px">
          <SidePanelBody paddingX="x6">
            고정 너비가 필요한 작업 패널에 사용할 수 있습니다.
          </SidePanelBody>
        </SidePanelContent>
      </SidePanelRoot>
    </Flex>
  );
};

export default SidePanelCustomSize;
