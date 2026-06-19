import { useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  SidePanelBody,
  SidePanelContent,
  SidePanelRoot,
  SidePanelTrigger,
} from "seed-design/ui/side-panel";

const SidePanelNonModal = () => {
  const [open, setOpen] = useState(false);

  return (
    <SidePanelRoot modal={false} open={open} onOpenChange={setOpen}>
      <SidePanelTrigger
        asChild
        onClick={(event) => {
          event.preventDefault();
          setOpen((open) => !open);
        }}
      >
        <ActionButton variant="neutralSolid">Non-modal Side Panel</ActionButton>
      </SidePanelTrigger>
      <SidePanelContent title="Non-modal">
        <SidePanelBody paddingX="x6">
          배경과 상호작용이 가능합니다. Backdrop이 표시되지 않습니다.
        </SidePanelBody>
      </SidePanelContent>
    </SidePanelRoot>
  );
};

export default SidePanelNonModal;
