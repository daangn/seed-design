import { ActionButton } from "seed-design/ui/action-button";
import { DrawerBody, DrawerContent, DrawerRoot, DrawerTrigger } from "seed-design/ui/drawer";

const DrawerNonModal = () => {
  return (
    <DrawerRoot modal={false}>
      <DrawerTrigger asChild>
        <ActionButton variant="neutralSolid">Non-modal Drawer</ActionButton>
      </DrawerTrigger>
      <DrawerContent title="Non-modal">
        <DrawerBody>배경과 상호작용이 가능합니다. Backdrop이 표시되지 않습니다.</DrawerBody>
      </DrawerContent>
    </DrawerRoot>
  );
};

export default DrawerNonModal;
