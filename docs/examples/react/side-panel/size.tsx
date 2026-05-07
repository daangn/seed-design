import { Flex } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  SidePanelBody,
  SidePanelContent,
  SidePanelRoot,
  SidePanelTrigger,
} from "seed-design/ui/side-panel";

const SidePanelSize = () => {
  return (
    <Flex gap="x3" wrap="wrap">
      <SidePanelRoot direction="right" size="small">
        <SidePanelTrigger asChild>
          <ActionButton variant="neutralSolid">Small (480px)</ActionButton>
        </SidePanelTrigger>
        <SidePanelContent title="Small Side Panel">
          <SidePanelBody>480px 너비의 Side Panel</SidePanelBody>
        </SidePanelContent>
      </SidePanelRoot>

      <SidePanelRoot direction="right" size="medium">
        <SidePanelTrigger asChild>
          <ActionButton variant="neutralSolid">Medium (720px)</ActionButton>
        </SidePanelTrigger>
        <SidePanelContent title="Medium Side Panel">
          <SidePanelBody>720px 너비의 Side Panel (기본값)</SidePanelBody>
        </SidePanelContent>
      </SidePanelRoot>

      <SidePanelRoot direction="right" size="large">
        <SidePanelTrigger asChild>
          <ActionButton variant="neutralSolid">Large (960px)</ActionButton>
        </SidePanelTrigger>
        <SidePanelContent title="Large Side Panel">
          <SidePanelBody>960px 너비의 Side Panel</SidePanelBody>
        </SidePanelContent>
      </SidePanelRoot>
    </Flex>
  );
};

export default SidePanelSize;
