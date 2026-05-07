import { ActionButton } from "seed-design/ui/action-button";
import {
  SidePanelBody,
  SidePanelContent,
  SidePanelRoot,
  SidePanelTrigger,
} from "seed-design/ui/side-panel";

const SidePanelTriggerExample = () => {
  return (
    <SidePanelRoot>
      <SidePanelTrigger asChild>
        <ActionButton variant="neutralSolid">Open</ActionButton>
      </SidePanelTrigger>
      <SidePanelContent title="Trigger 패턴">
        <SidePanelBody>Trigger를 클릭하면 SidePanel이 열립니다</SidePanelBody>
      </SidePanelContent>
    </SidePanelRoot>
  );
};

export default SidePanelTriggerExample;
