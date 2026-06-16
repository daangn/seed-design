import { Box, Flex } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  SidePanelBody,
  SidePanelContent,
  SidePanelRoot,
  SidePanelTrigger,
} from "seed-design/ui/side-panel";

const SidePanelSize = () => {
  return (
    <Flex gap="x3" wrap="wrap">
      <SidePanelRoot direction="right" size="small">
        <SidePanelTrigger asChild>
          <ActionButton variant="neutralSolid">Small (480px)</ActionButton>
        </SidePanelTrigger>
        <SidePanelContent title="Small Side Panel">
          <SidePanelBody paddingX="x6">
            <Box py="x4">
              좁은 패널에 적합한 간결한 콘텐츠를 배치합니다.
            </Box>
          </SidePanelBody>
        </SidePanelContent>
      </SidePanelRoot>

      <SidePanelRoot direction="right" size="medium">
        <SidePanelTrigger asChild>
          <ActionButton variant="neutralSolid">Medium (720px)</ActionButton>
        </SidePanelTrigger>
        <SidePanelContent title="Medium Side Panel">
          <SidePanelBody paddingX="x6">
            <Box py="x4">
              기본 너비로 상세 정보와 주요 액션을 함께 제공합니다.
            </Box>
          </SidePanelBody>
        </SidePanelContent>
      </SidePanelRoot>

      <SidePanelRoot direction="right" size="large">
        <SidePanelTrigger asChild>
          <ActionButton variant="neutralSolid">Large (960px)</ActionButton>
        </SidePanelTrigger>
        <SidePanelContent title="Large Side Panel">
          <SidePanelBody paddingX="x6">
            <Box py="x4">
              넓은 패널에서 더 많은 폼 필드나 상세 콘텐츠를 다룹니다.
            </Box>
          </SidePanelBody>
        </SidePanelContent>
      </SidePanelRoot>
    </Flex>
  );
};

export default SidePanelSize;
