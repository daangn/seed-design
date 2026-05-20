import { Box } from "@seed-design/react";
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
        <SidePanelBody paddingX="x6">
          <Box py="x4">
            패널 본문에는 사용자가 확인해야 할 내용이나 추가 입력 폼을 배치할 수 있습니다.
          </Box>
        </SidePanelBody>
        <SidePanelFooter>
          <ActionButton variant="neutralSolid">확인</ActionButton>
        </SidePanelFooter>
      </SidePanelContent>
    </SidePanelRoot>
  );
};

export default SidePanelPreview;
