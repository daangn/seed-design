import { Box, Flex, HStack, VStack } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  SidePanelBody,
  SidePanelContent,
  SidePanelFooter,
  SidePanelRoot,
  SidePanelTrigger,
} from "seed-design/ui/side-panel";

const SidePanelFooterLayout = () => {
  return (
    <Flex gap="x3" wrap="wrap">
      <SidePanelRoot size="small">
        <SidePanelTrigger asChild>
          <ActionButton variant="neutralSolid">Small</ActionButton>
        </SidePanelTrigger>
        <SidePanelContent
          title="Small Side Panel"
          description="좁은 패널에서는 주요 액션이 위에 오도록 세로로 배치합니다."
        >
          <SidePanelBody paddingX="x6">
            <VStack gap="x3">
              <Box>확인이 필요한 정보를 간결하게 보여줍니다.</Box>
              <Box>버튼은 패널 너비를 채우며 위에서 아래로 쌓입니다.</Box>
            </VStack>
          </SidePanelBody>
          <SidePanelFooter>
            <VStack gap="x2">
              <ActionButton variant="neutralSolid">확인</ActionButton>
              <ActionButton variant="neutralWeak">취소</ActionButton>
            </VStack>
          </SidePanelFooter>
        </SidePanelContent>
      </SidePanelRoot>

      <SidePanelRoot size="medium">
        <SidePanelTrigger asChild>
          <ActionButton variant="neutralSolid">Medium</ActionButton>
        </SidePanelTrigger>
        <SidePanelContent
          title="Medium Side Panel"
          description="넓은 패널에서는 주요 액션을 가로로 배치합니다."
        >
          <SidePanelBody paddingX="x6">
            <VStack gap="x3">
              <Box>상세 정보와 확인 액션을 함께 제공할 수 있습니다.</Box>
              <Box>버튼은 우측 영역에 가로로 정렬됩니다.</Box>
            </VStack>
          </SidePanelBody>
          <SidePanelFooter>
            <HStack gap="x2" justify="flex-end">
              <ActionButton variant="neutralWeak">취소</ActionButton>
              <ActionButton variant="neutralSolid">확인</ActionButton>
            </HStack>
          </SidePanelFooter>
        </SidePanelContent>
      </SidePanelRoot>
    </Flex>
  );
};

export default SidePanelFooterLayout;
