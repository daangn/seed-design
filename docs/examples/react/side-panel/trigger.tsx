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
        <SidePanelBody paddingX="x6">
          Trigger를 클릭하면 현재 화면 위에 Side Panel이 열립니다.
        </SidePanelBody>
      </SidePanelContent>
    </SidePanelRoot>
  );
};

export default SidePanelTriggerExample;
