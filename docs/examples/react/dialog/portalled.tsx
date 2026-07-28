import { HStack, Portal, Text } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  DialogAction,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogRoot,
  DialogTrigger,
} from "seed-design/ui/dialog";

const DialogPortalled = () => {
  return (
    // You can set z-index dialog with "--layer-index" custom property. useful for stackflow integration.
    <DialogRoot>
      <DialogTrigger asChild>
        <ActionButton variant="neutralSolid">열기</ActionButton>
      </DialogTrigger>
      <Portal>
        <DialogContent title="Portal" layerIndex={50}>
          <DialogBody>
            <Text textStyle="articleBody">Portal은 기본적으로 document.body에 렌더링됩니다.</Text>
          </DialogBody>
          <DialogFooter>
            <HStack gap="x2" justify="flex-end">
              <DialogAction variant="neutralWeak">취소</DialogAction>
              <DialogAction variant="neutralSolid">확인</DialogAction>
            </HStack>
          </DialogFooter>
        </DialogContent>
      </Portal>
    </DialogRoot>
  );
};

export default DialogPortalled;
