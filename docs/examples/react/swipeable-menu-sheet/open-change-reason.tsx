import { IconEyeSlashLine } from "@karrotmarket/react-monochrome-icon";
import { HStack, Text, VStack } from "@seed-design/react";
import { useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  SwipeableMenuSheetContent,
  SwipeableMenuSheetGroup,
  SwipeableMenuSheetItem,
  SwipeableMenuSheetRoot,
  SwipeableMenuSheetTrigger,
} from "seed-design/ui/swipeable-menu-sheet";

export default function SwipeableMenuSheetOnOpenChangeReason() {
  const [open, setOpen] = useState(false);
  const [openReason, setOpenReason] = useState<string | null>(null);
  const [closeReason, setCloseReason] = useState<string | null>(null);

  return (
    <VStack gap="x4" align="center">
      <SwipeableMenuSheetRoot
        open={open}
        onOpenChange={(open, details) => {
          setOpen(open);

          (open ? setOpenReason : setCloseReason)(details?.reason ?? null);
        }}
      >
        <SwipeableMenuSheetTrigger asChild>
          <ActionButton variant="neutralSolid">열기</ActionButton>
        </SwipeableMenuSheetTrigger>
        <SwipeableMenuSheetContent title="메뉴" aria-label="Swipeable Menu Sheet">
          <SwipeableMenuSheetGroup>
            <SwipeableMenuSheetItem label="Action 1" prefixIcon={<IconEyeSlashLine />} />
            <SwipeableMenuSheetItem label="Action 2" prefixIcon={<IconEyeSlashLine />} />
            <SwipeableMenuSheetItem label="Action 3" prefixIcon={<IconEyeSlashLine />} />
          </SwipeableMenuSheetGroup>
        </SwipeableMenuSheetContent>
      </SwipeableMenuSheetRoot>

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
