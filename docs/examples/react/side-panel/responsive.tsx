import { ActionButton } from "seed-design/ui/action-button";
import {
  ResponsiveSidePanelBody,
  ResponsiveSidePanelContent,
  ResponsiveSidePanelFooter,
  ResponsiveSidePanelRoot,
  ResponsiveSidePanelTrigger,
} from "seed-design/ui/responsive-side-panel";

const SidePanelResponsive = () => {
  return (
    <ResponsiveSidePanelRoot>
      <ResponsiveSidePanelTrigger asChild>
        <ActionButton variant="neutralSolid">Open</ActionButton>
      </ResponsiveSidePanelTrigger>
      <ResponsiveSidePanelContent
        title="반응형 패널"
        description="md 이상에서는 Side Panel, sm 이하에서는 Bottom Sheet로 표시됩니다."
      >
        <ResponsiveSidePanelBody>뷰포트를 줄여서 동작을 확인해보세요.</ResponsiveSidePanelBody>
        <ResponsiveSidePanelFooter>
          <ActionButton variant="neutralSolid">확인</ActionButton>
        </ResponsiveSidePanelFooter>
      </ResponsiveSidePanelContent>
    </ResponsiveSidePanelRoot>
  );
};

export default SidePanelResponsive;
