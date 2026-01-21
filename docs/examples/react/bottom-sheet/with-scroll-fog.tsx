import { Box, ScrollFog, VStack } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
  BottomSheetTrigger,
} from "seed-design/ui/bottom-sheet";

const BottomSheetMaxHeight = () => {
  return (
    <BottomSheetRoot>
      <BottomSheetTrigger asChild>
        <ActionButton variant="neutralSolid">Open</ActionButton>
      </BottomSheetTrigger>
      <BottomSheetContent title="제목" description="설명을 작성할 수 있어요">
        {/* If you need to omit padding, pass px={0}. */}
        <BottomSheetBody>
          <VStack maxHeight="300px" overflowY="auto">
            <ScrollFog placement={["top", "bottom"]}>
              <VStack
                justifyContent="center"
                alignItems="center"
                gap="x4"
                height="100%"
                pb="80px"
                pt="20px"
              >
                <Box width="100%" height="100px" bg="bg.layerBasement" />
                <Box width="100%" height="100px" bg="bg.layerBasement" />
                <Box width="100%" height="100px" bg="bg.layerBasement" />
                <Box width="100%" height="100px" bg="bg.layerBasement" />
              </VStack>
            </ScrollFog>
          </VStack>
        </BottomSheetBody>
        <BottomSheetFooter>
          <ActionButton variant="neutralSolid">확인</ActionButton>
        </BottomSheetFooter>
      </BottomSheetContent>
    </BottomSheetRoot>
  );
};

export default BottomSheetMaxHeight;
