import { HStack, ResponsivePair, Text, VStack } from "@seed-design/react";
import { useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogRoot,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "seed-design/ui/alert-dialog";

export default function AlertDialogOnOpenChangeReason() {
  const [open, setOpen] = useState(false);
  const [openReason, setOpenReason] = useState<string | null>(null);
  const [closeReason, setCloseReason] = useState<string | null>(null);

  return (
    <VStack gap="x4" align="center">
      <AlertDialogRoot
        open={open}
        onOpenChange={(open, meta) => {
          setOpen(open);

          (open ? setOpenReason : setCloseReason)(meta?.reason ?? null);
        }}
      >
        <AlertDialogTrigger asChild>
          <ActionButton variant="neutralSolid">열기</ActionButton>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>알림</AlertDialogTitle>
            <AlertDialogDescription>
              ESC 키를 누르거나 버튼을 클릭하여 닫아보세요.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <ResponsivePair gap="x2">
              <AlertDialogAction variant="neutralWeak">취소</AlertDialogAction>
              <AlertDialogAction variant="neutralSolid">확인</AlertDialogAction>
            </ResponsivePair>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogRoot>

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
}
