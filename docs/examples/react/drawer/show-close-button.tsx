import { Flex } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";
import { DrawerBody, DrawerContent, DrawerRoot, DrawerTrigger } from "seed-design/ui/drawer";

const DrawerShowCloseButton = () => {
  return (
    <Flex gap="x3">
      <DrawerRoot>
        <DrawerTrigger asChild>
          <ActionButton variant="neutralSolid">닫기 버튼 있음</ActionButton>
        </DrawerTrigger>
        <DrawerContent title="닫기 버튼" showCloseButton>
          <DrawerBody>닫기 버튼이 표시됩니다 (기본값)</DrawerBody>
        </DrawerContent>
      </DrawerRoot>

      <DrawerRoot>
        <DrawerTrigger asChild>
          <ActionButton variant="neutralSolid">닫기 버튼 없음</ActionButton>
        </DrawerTrigger>
        <DrawerContent title="닫기 버튼 없음" showCloseButton={false}>
          <DrawerBody>닫기 버튼이 숨겨집니다</DrawerBody>
        </DrawerContent>
      </DrawerRoot>
    </Flex>
  );
};

export default DrawerShowCloseButton;
