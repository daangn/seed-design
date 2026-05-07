import { useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  SidePanelBody,
  SidePanelContent,
  SidePanelFooter,
  SidePanelRoot,
} from "seed-design/ui/side-panel";

const SidePanelControlled = () => {
  const [open, setOpen] = useState(false);

  const scheduleOpen = () => {
    setTimeout(() => {
      setOpen(true);
    }, 1000);
  };

  return (
    <>
      <ActionButton variant="neutralSolid" onClick={scheduleOpen}>
        1초 후 열기
      </ActionButton>
      <SidePanelRoot open={open} onOpenChange={setOpen}>
        <SidePanelContent title="제목" description="설명을 작성할 수 있어요">
          <SidePanelBody minHeight="x16">Content</SidePanelBody>
          <SidePanelFooter>
            <ActionButton variant="neutralSolid">확인</ActionButton>
          </SidePanelFooter>
        </SidePanelContent>
      </SidePanelRoot>
    </>
  );
};

export default SidePanelControlled;
