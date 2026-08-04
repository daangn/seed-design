import { HStack, Text } from "@seed-design/react";
import { useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  DialogAction,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogRoot,
} from "seed-design/ui/dialog";

const DialogControlled = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <ActionButton variant="neutralSolid" onClick={() => setOpen(true)}>
        열기
      </ActionButton>
      <DialogRoot open={open} onOpenChange={setOpen}>
        <DialogContent title="제목" description="설명을 작성할 수 있어요">
          <DialogBody>
            <Text textStyle="articleBody">
              Labore do culpa dolore irure nisi dolor dolor laboris veniam ipsum excepteur
              adipisicing laboris non quis. Velit ea ut minim. Magna dolore culpa velit incididunt
              consequat sint. Fugiat ad culpa labore dolore esse dolore ex aliquip duis aute aliquip
              ad velit et.
            </Text>
          </DialogBody>
          <DialogFooter>
            <HStack gap="x2" justify="flex-end">
              <DialogAction variant="neutralWeak">취소</DialogAction>
              <DialogAction variant="neutralSolid">확인</DialogAction>
            </HStack>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </>
  );
};

export default DialogControlled;
