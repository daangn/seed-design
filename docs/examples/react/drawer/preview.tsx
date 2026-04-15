import { ActionButton } from "seed-design/ui/action-button";
import {
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerRoot,
  DrawerTrigger,
} from "seed-design/ui/drawer";

const DrawerPreview = () => {
  return (
    <DrawerRoot>
      <DrawerTrigger asChild>
        <ActionButton variant="neutralSolid">Open Drawer</ActionButton>
      </DrawerTrigger>
      <DrawerContent title="제목" description="설명을 작성할 수 있어요">
        <DrawerBody>Content</DrawerBody>
        <DrawerFooter>
          <ActionButton variant="neutralSolid">확인</ActionButton>
        </DrawerFooter>
      </DrawerContent>
    </DrawerRoot>
  );
};

export default DrawerPreview;
