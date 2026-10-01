import "./styles";

import IconEyeSlashLine from "@karrotmarket/lynx-monochrome-icon/IconEyeSlashLine";
import { useState } from "@lynx-js/react";
import { ActionButton, useSeedClassName, VStack } from "@seed-design/lynx-react";
import {
  MenuSheetContent,
  MenuSheetGroup,
  MenuSheetItem,
  MenuSheetRoot,
  MenuSheetTrigger,
} from "@/components/ui/menu-sheet";

type OpenChangeReason = "trigger" | "closeButton" | "interactOutside" | "drag";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [open, setOpen] = useState(false);
  const [openReason, setOpenReason] = useState<OpenChangeReason | null>(null);
  const [closeReason, setCloseReason] = useState<OpenChangeReason | null>(null);

  function handleOpenChange(nextOpen: boolean, details: { reason: OpenChangeReason }) {
    "background only";
    setOpen(nextOpen);

    if (nextOpen) {
      setOpenReason(details.reason);
    } else {
      setCloseReason(details.reason);
    }
  }

  return (
    <view className={`${seedClassName} docs-lynx-menu-sheet-root`}>
      <VStack className="menu-sheet-preview" gap="x3">
        <text className="menu-sheet-preview__status">
          {open ? "열림 상태: true" : "열림 상태: false"}
        </text>
        <text className="menu-sheet-preview__status">마지막 열림 이유: {openReason ?? "-"}</text>
        <text className="menu-sheet-preview__status">마지막 닫힘 이유: {closeReason ?? "-"}</text>
        <MenuSheetRoot open={open} onOpenChange={handleOpenChange}>
          <MenuSheetTrigger>
            <ActionButton variant="neutralSolid">메뉴 열기</ActionButton>
          </MenuSheetTrigger>
          <MenuSheetContent title="메뉴" showCloseButton>
            <MenuSheetGroup>
              <MenuSheetItem label="숨기기" prefixIcon={<IconEyeSlashLine />} />
            </MenuSheetGroup>
          </MenuSheetContent>
        </MenuSheetRoot>
      </VStack>
    </view>
  );
}
