import { Flex } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";
import { DrawerBody, DrawerContent, DrawerRoot, DrawerTrigger } from "seed-design/ui/drawer";

const DrawerSize = () => {
  return (
    <Flex gap="x3" wrap="wrap">
      <DrawerRoot direction="right" size="small">
        <DrawerTrigger asChild>
          <ActionButton variant="neutralSolid">Small (480px)</ActionButton>
        </DrawerTrigger>
        <DrawerContent title="Small Drawer">
          <DrawerBody>480px 너비의 Drawer</DrawerBody>
        </DrawerContent>
      </DrawerRoot>

      <DrawerRoot direction="right" size="medium">
        <DrawerTrigger asChild>
          <ActionButton variant="neutralSolid">Medium (720px)</ActionButton>
        </DrawerTrigger>
        <DrawerContent title="Medium Drawer">
          <DrawerBody>720px 너비의 Drawer (기본값)</DrawerBody>
        </DrawerContent>
      </DrawerRoot>

      <DrawerRoot direction="right" size="large">
        <DrawerTrigger asChild>
          <ActionButton variant="neutralSolid">Large (960px)</ActionButton>
        </DrawerTrigger>
        <DrawerContent title="Large Drawer">
          <DrawerBody>960px 너비의 Drawer</DrawerBody>
        </DrawerContent>
      </DrawerRoot>
    </Flex>
  );
};

export default DrawerSize;
