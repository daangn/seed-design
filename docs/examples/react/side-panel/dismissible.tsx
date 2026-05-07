import { useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  SidePanelBody,
  SidePanelContent,
  SidePanelFooter,
  SidePanelRoot,
  SidePanelTrigger,
} from "seed-design/ui/side-panel";

const SidePanelDismissible = () => {
  const [open, setOpen] = useState(false);

  return (
    <SidePanelRoot open={open} onOpenChange={(o) => setOpen(o)} dismissible={false}>
      <SidePanelTrigger asChild>
        <ActionButton variant="neutralSolid">닫기 불가 Side Panel</ActionButton>
      </SidePanelTrigger>
      <SidePanelContent title="닫기 불가" showCloseButton={false}>
        <SidePanelBody>
          Escape 키, 외부 클릭으로 닫을 수 없습니다. 프로그래밍 방식으로만 닫을 수 있습니다.
        </SidePanelBody>
        <SidePanelFooter>
          <ActionButton variant="neutralSolid" onClick={() => setOpen(false)}>
            닫기
          </ActionButton>
        </SidePanelFooter>
      </SidePanelContent>
    </SidePanelRoot>
  );
};

export default SidePanelDismissible;
