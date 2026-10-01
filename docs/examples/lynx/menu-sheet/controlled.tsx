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

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [open, setOpen] = useState(false);

  function handleOpen() {
    "background only";
    setOpen(true);
  }

  function handleOpenChange(nextOpen: boolean) {
    "background only";
    setOpen(nextOpen);
  }

  return (
    <view className={`${seedClassName} docs-lynx-menu-sheet-root`}>
      <VStack className="menu-sheet-preview" gap="x3">
        <text className="menu-sheet-preview__status">
          {open ? "열림 상태: true" : "열림 상태: false"}
        </text>
        <ActionButton variant="neutralWeak" bindtap={handleOpen} disabled={open}>
          상태로 열기
        </ActionButton>
        <MenuSheetRoot open={open} onOpenChange={handleOpenChange}>
          <MenuSheetTrigger>
            <ActionButton variant="neutralSolid">메뉴 열기</ActionButton>
          </MenuSheetTrigger>
          <MenuSheetContent title="제어되는 메뉴">
            <MenuSheetGroup>
              <MenuSheetItem label="숨기기" prefixIcon={<IconEyeSlashLine />} />
            </MenuSheetGroup>
          </MenuSheetContent>
        </MenuSheetRoot>
      </VStack>
    </view>
  );
}
