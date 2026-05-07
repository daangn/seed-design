import { ActionButton } from "seed-design/ui/action-button";
import {
  SidePanelBody,
  SidePanelContent,
  SidePanelRoot,
  SidePanelTrigger,
} from "seed-design/ui/side-panel";

const SidePanelNonModal = () => {
  return (
    <SidePanelRoot modal={false}>
      <SidePanelTrigger asChild>
        <ActionButton variant="neutralSolid">Non-modal Side Panel</ActionButton>
      </SidePanelTrigger>
      <SidePanelContent title="Non-modal">
        <SidePanelBody>배경과 상호작용이 가능합니다. Backdrop이 표시되지 않습니다.</SidePanelBody>
      </SidePanelContent>
    </SidePanelRoot>
  );
};

export default SidePanelNonModal;
