import { Box, Flex, VStack } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";
import { DrawerBody, DrawerContent, DrawerRoot, DrawerTrigger } from "seed-design/ui/drawer";

const DrawerCustomSize = () => {
  return (
    <Flex gap="x3" wrap="wrap">
      <DrawerRoot direction="right">
        <DrawerTrigger asChild>
          <ActionButton variant="neutralSolid">width 50vw</ActionButton>
        </DrawerTrigger>
        <DrawerContent title="Fluid Width" width="50vw">
          <DrawerBody>뷰포트 너비의 50%를 차지합니다</DrawerBody>
        </DrawerContent>
      </DrawerRoot>

      <DrawerRoot direction="bottom">
        <DrawerTrigger asChild>
          <ActionButton variant="neutralSolid">maxHeight 70vh</ActionButton>
        </DrawerTrigger>
        <DrawerContent title="Custom Height" maxHeight="70vh">
          <DrawerBody>
            <VStack gap="x3">
              {Array.from({ length: 20 }, (_, i) => (
                <Box key={i} width="full" height="60px" bg="bg.layerBasement" borderRadius="r2" />
              ))}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </DrawerRoot>
    </Flex>
  );
};

export default DrawerCustomSize;
