import { Flex } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";
import { DrawerBody, DrawerContent, DrawerRoot, DrawerTrigger } from "seed-design/ui/drawer";

const DrawerDirection = () => {
  return (
    <Flex gap="x3" wrap="wrap">
      <DrawerRoot direction="right">
        <DrawerTrigger asChild>
          <ActionButton variant="neutralSolid">Right</ActionButton>
        </DrawerTrigger>
        <DrawerContent title="Right Drawer">
          <DrawerBody>오른쪽에서 열리는 Drawer</DrawerBody>
        </DrawerContent>
      </DrawerRoot>

      <DrawerRoot direction="left">
        <DrawerTrigger asChild>
          <ActionButton variant="neutralSolid">Left</ActionButton>
        </DrawerTrigger>
        <DrawerContent title="Left Drawer">
          <DrawerBody>왼쪽에서 열리는 Drawer</DrawerBody>
        </DrawerContent>
      </DrawerRoot>

      <DrawerRoot direction="bottom">
        <DrawerTrigger asChild>
          <ActionButton variant="neutralSolid">Bottom</ActionButton>
        </DrawerTrigger>
        <DrawerContent title="Bottom Drawer">
          <DrawerBody>아래에서 열리는 Drawer</DrawerBody>
        </DrawerContent>
      </DrawerRoot>

      <DrawerRoot direction="top">
        <DrawerTrigger asChild>
          <ActionButton variant="neutralSolid">Top</ActionButton>
        </DrawerTrigger>
        <DrawerContent title="Top Drawer">
          <DrawerBody>위에서 열리는 Drawer</DrawerBody>
        </DrawerContent>
      </DrawerRoot>
    </Flex>
  );
};

export default DrawerDirection;
