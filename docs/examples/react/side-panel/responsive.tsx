import { Box, VStack } from "@seed-design/react";
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
        description="화면 크기에 따라 적합한 컴포넌트로 자동 전환됩니다."
      >
        <ResponsiveSidePanelBody>
          <VStack gap="x3" py="x4">
            <Box>본문 영역은 Header/Body/Footer 구조로 동일합니다.</Box>
            <Box>md 이상에서는 화면 우측에서 슬라이드되는 Side Panel로,</Box>
            <Box>sm 이하에서는 화면 하단에서 슬라이드되는 Bottom Sheet로 표시됩니다.</Box>
          </VStack>
        </ResponsiveSidePanelBody>
        <ResponsiveSidePanelFooter>
          <ActionButton variant="neutralSolid">확인</ActionButton>
        </ResponsiveSidePanelFooter>
      </ResponsiveSidePanelContent>
    </ResponsiveSidePanelRoot>
  );
};

export default SidePanelResponsive;
