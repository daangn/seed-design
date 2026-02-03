import { IconEyeSlashLine } from "@karrotmarket/react-monochrome-icon";
import { HStack, Text, VStack } from "@seed-design/react";
import { useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  MenuSheetContent,
  MenuSheetGroup,
  MenuSheetItem,
  MenuSheetRoot,
  MenuSheetTrigger,
} from "seed-design/ui/menu-sheet";

export default function MenuSheetOnOpenChangeReason() {
  const [open, setOpen] = useState(false);
  const [openReason, setOpenReason] = useState<string | null>(null);
  const [closeReason, setCloseReason] = useState<string | null>(null);

  return (
    <VStack gap="x4" align="center">
      <MenuSheetRoot
        open={open}
        onOpenChange={(open, meta) => {
          setOpen(open);

          (open ? setOpenReason : setCloseReason)(meta?.reason ?? null);
        }}
      >
        <MenuSheetTrigger asChild>
          <ActionButton variant="neutralSolid">열기</ActionButton>
        </MenuSheetTrigger>
        <MenuSheetContent title="메뉴" aria-label="Menu Sheet">
          <MenuSheetGroup>
            <MenuSheetItem label="Action 1" prefixIcon={<IconEyeSlashLine />} />
            <MenuSheetItem label="Action 2" prefixIcon={<IconEyeSlashLine />} />
            <MenuSheetItem label="Action 3" prefixIcon={<IconEyeSlashLine />} />
          </MenuSheetGroup>
        </MenuSheetContent>
      </MenuSheetRoot>

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
