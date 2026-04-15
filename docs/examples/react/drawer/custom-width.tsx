import { Flex } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";
import { DrawerBody, DrawerContent, DrawerRoot, DrawerTrigger } from "seed-design/ui/drawer";

const DrawerCustomWidth = () => {
  return (
    <Flex gap="x3" wrap="wrap">
      <DrawerRoot direction="right">
        <DrawerTrigger asChild>
          <ActionButton variant="neutralSolid">50vw</ActionButton>
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
          <DrawerBody>최대 높이가 70vh로 제한됩니다</DrawerBody>
        </DrawerContent>
      </DrawerRoot>
    </Flex>
  );
};

export default DrawerCustomWidth;
