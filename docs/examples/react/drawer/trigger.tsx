import { ActionButton } from "seed-design/ui/action-button";
import { DrawerBody, DrawerContent, DrawerRoot, DrawerTrigger } from "seed-design/ui/drawer";

const DrawerTriggerExample = () => {
  return (
    <DrawerRoot>
      <DrawerTrigger asChild>
        <ActionButton variant="neutralSolid">Open</ActionButton>
      </DrawerTrigger>
      <DrawerContent title="Trigger 패턴">
        <DrawerBody>Trigger를 클릭하면 Drawer가 열립니다</DrawerBody>
      </DrawerContent>
    </DrawerRoot>
  );
};

export default DrawerTriggerExample;
