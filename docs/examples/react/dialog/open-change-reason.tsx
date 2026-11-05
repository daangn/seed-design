import { HStack, Text, VStack } from "@seed-design/react";
import { useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  DialogAction,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogRoot,
  DialogTrigger,
} from "seed-design/ui/dialog";
import { Switch } from "seed-design/ui/switch";

const DialogOnOpenChangeReason = () => {
  const [open, setOpen] = useState(false);
  const [openReason, setOpenReason] = useState<string | null>(null);
  const [closeReason, setCloseReason] = useState<string | null>(null);
  const [closeOnInteractOutside, setCloseOnInteractOutside] = useState(false);

  return (
    <VStack gap="x4" align="center">
      <DialogRoot
        open={open}
        closeOnInteractOutside={closeOnInteractOutside}
        onOpenChange={(open, details) => {
          setOpen(open);

          (open ? setOpenReason : setCloseReason)(details?.reason ?? null);
        }}
      >
        <DialogTrigger asChild>
          <ActionButton variant="neutralSolid">열기</ActionButton>
        </DialogTrigger>
        <DialogContent title="onOpenChange 이유">
          <DialogBody>
            <VStack gap="x3" align="flex-start">
              <Text textStyle="articleBody">
                ESC 키를 누르거나 우측 상단 닫기 버튼, 하단 버튼을 눌러 닫아보세요. 아래 스위치를 켠
                뒤 바깥 영역을 누르면 interactOutside 이유로 닫힙니다.
              </Text>
              <Switch
                tone="neutral"
                size="16"
                label="closeOnInteractOutside"
                checked={closeOnInteractOutside}
                onCheckedChange={setCloseOnInteractOutside}
              />
            </VStack>
          </DialogBody>
          <DialogFooter>
            <HStack gap="x2" justify="flex-end">
              <DialogAction variant="neutralWeak">취소</DialogAction>
              <DialogAction variant="neutralSolid">확인</DialogAction>
            </HStack>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>

      <HStack gap="x4">
        <Text fontSize="t3" color="fg.neutralMuted">
          마지막 열림 이유: {openReason ?? "-"}
        </Text>
        <Text fontSize="t3" color="fg.neutralMuted">
          마지막 닫힘 이유: {closeReason ?? "-"}
        </Text>
      </HStack>
    </VStack>
  );
};

export default DialogOnOpenChangeReason;
