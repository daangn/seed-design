import { useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import { DrawerBody, DrawerContent, DrawerFooter, DrawerRoot } from "seed-design/ui/drawer";

const DrawerControlled = () => {
  const [open, setOpen] = useState(false);

  const scheduleOpen = () => {
    setTimeout(() => {
      setOpen(true);
    }, 1000);
  };

  return (
    <>
      <ActionButton variant="neutralSolid" onClick={scheduleOpen}>
        1초 후 열기
      </ActionButton>
      <DrawerRoot open={open} onOpenChange={setOpen}>
        <DrawerContent title="제목" description="설명을 작성할 수 있어요">
          <DrawerBody minHeight="x16">Content</DrawerBody>
          <DrawerFooter>
            <ActionButton variant="neutralSolid">확인</ActionButton>
          </DrawerFooter>
        </DrawerContent>
      </DrawerRoot>
    </>
  );
};

export default DrawerControlled;
