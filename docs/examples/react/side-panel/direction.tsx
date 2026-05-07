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
          <SidePanelBody>오른쪽에서 열리는 Side Panel</SidePanelBody>
        </SidePanelContent>
      </SidePanelRoot>

      <SidePanelRoot direction="left">
        <SidePanelTrigger asChild>
          <ActionButton variant="neutralSolid">Left</ActionButton>
        </SidePanelTrigger>
        <SidePanelContent title="Left Side Panel">
          <SidePanelBody>왼쪽에서 열리는 Side Panel</SidePanelBody>
        </SidePanelContent>
      </SidePanelRoot>
    </Flex>
  );
};

export default SidePanelDirection;
