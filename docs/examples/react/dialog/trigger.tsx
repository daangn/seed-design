import { HStack, Text } from "@seed-design/react";
import {
  DialogAction,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogRoot,
  DialogTrigger,
} from "seed-design/ui/dialog";
import { ActionButton } from "seed-design/ui/action-button";

const DialogTriggerExample = () => {
  return (
    <DialogRoot>
      <DialogTrigger asChild>
        <ActionButton variant="neutralSolid">Open</ActionButton>
      </DialogTrigger>
      <DialogContent title="Trigger 패턴">
        <DialogBody>
          <Text textStyle="articleBody">Trigger를 클릭하면 현재 화면 위에 Dialog가 열립니다.</Text>
        </DialogBody>
        <DialogFooter>
          <HStack gap="x2" justify="flex-end">
            <DialogAction variant="neutralWeak">취소</DialogAction>
            <DialogAction variant="neutralSolid">확인</DialogAction>
          </HStack>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default DialogTriggerExample;
