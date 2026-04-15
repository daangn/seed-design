import { ActionButton } from "seed-design/ui/action-button";
import { DrawerBody, DrawerContent, DrawerRoot, DrawerTrigger } from "seed-design/ui/drawer";

const DrawerDismissible = () => {
  return (
    <DrawerRoot dismissible={false}>
      <DrawerTrigger asChild>
        <ActionButton variant="neutralSolid">닫기 불가 Drawer</ActionButton>
      </DrawerTrigger>
      <DrawerContent title="닫기 불가" showCloseButton={false}>
        <DrawerBody>
          Escape 키, 외부 클릭으로 닫을 수 없습니다. 프로그래밍 방식으로만 닫을 수 있습니다.
        </DrawerBody>
      </DrawerContent>
    </DrawerRoot>
  );
};

export default DrawerDismissible;
