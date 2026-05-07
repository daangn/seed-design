import { ActionButton } from "seed-design/ui/action-button";
import {
  SidePanelBody,
  SidePanelContent,
  SidePanelFooter,
  SidePanelRoot,
  SidePanelTrigger,
} from "seed-design/ui/side-panel";

const SidePanelPreview = () => {
  return (
    <SidePanelRoot>
      <SidePanelTrigger asChild>
        <ActionButton variant="neutralSolid">Open Side Panel</ActionButton>
      </SidePanelTrigger>
      <SidePanelContent title="제목" description="설명을 작성할 수 있어요">
        <SidePanelBody>Content</SidePanelBody>
        <SidePanelFooter>
          <ActionButton variant="neutralSolid">확인</ActionButton>
        </SidePanelFooter>
      </SidePanelContent>
    </SidePanelRoot>
  );
};

export default SidePanelPreview;
