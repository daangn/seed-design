import { IconEyeSlashLine } from "@karrotmarket/react-monochrome-icon";
import { HStack, Text, VStack } from "@seed-design/react";
import { useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  SwipableMenuSheetContent,
  SwipableMenuSheetGroup,
  SwipableMenuSheetItem,
  SwipableMenuSheetRoot,
  SwipableMenuSheetTrigger,
} from "seed-design/ui/swipable-menu-sheet";

export default function SwipableMenuSheetOnOpenChangeReason() {
  const [open, setOpen] = useState(false);
  const [openReason, setOpenReason] = useState<string | null>(null);
  const [closeReason, setCloseReason] = useState<string | null>(null);

  return (
    <VStack gap="x4" align="center">
      <SwipableMenuSheetRoot
        open={open}
        onOpenChange={(open, details) => {
          setOpen(open);

          (open ? setOpenReason : setCloseReason)(details?.reason ?? null);
        }}
      >
        <SwipableMenuSheetTrigger asChild>
          <ActionButton variant="neutralSolid">열기</ActionButton>
        </SwipableMenuSheetTrigger>
        <SwipableMenuSheetContent title="메뉴" aria-label="Swipable Menu Sheet">
          <SwipableMenuSheetGroup>
            <SwipableMenuSheetItem label="Action 1" prefixIcon={<IconEyeSlashLine />} />
            <SwipableMenuSheetItem label="Action 2" prefixIcon={<IconEyeSlashLine />} />
            <SwipableMenuSheetItem label="Action 3" prefixIcon={<IconEyeSlashLine />} />
          </SwipableMenuSheetGroup>
        </SwipableMenuSheetContent>
      </SwipableMenuSheetRoot>

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
