import "./styles";

import IconPencilLine from "@karrotmarket/lynx-monochrome-icon/IconPencilLine";
import IconPlusLine from "@karrotmarket/lynx-monochrome-icon/IconPlusLine";
import { useState } from "@lynx-js/react";
import { ActionButton, HStack, VStack, useSeedClassName } from "@seed-design/lynx-react";
import { MenuContent, MenuGroup, MenuItem, MenuRoot, MenuTrigger } from "@/components/ui/menu";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [open, setOpen] = useState(false);
  const [openReason, setOpenReason] = useState<string | null>(null);
  const [closeReason, setCloseReason] = useState<string | null>(null);

  function handleOpenChange(nextOpen: boolean, details?: { reason?: string }) {
    "background only";
    setOpen(nextOpen);
    (nextOpen ? setOpenReason : setCloseReason)(details?.reason ?? null);
  }

  return (
    <view className={`${seedClassName} docs-lynx-menu-root`}>
      <VStack width="full" height="full" gap="x4" align="center" justify="center">
        <MenuRoot open={open} onOpenChange={handleOpenChange}>
          <MenuTrigger>
            <ActionButton variant="neutralSolid">열기</ActionButton>
          </MenuTrigger>
          <MenuContent>
            <MenuGroup>
              <MenuItem label="추가" prefixIcon={<IconPlusLine />} />
              <MenuItem label="수정" prefixIcon={<IconPencilLine />} />
            </MenuGroup>
          </MenuContent>
        </MenuRoot>
        <HStack gap="x4">
          <text>마지막 열림 이유: {openReason ?? "-"}</text>
          <text>마지막 닫힘 이유: {closeReason ?? "-"}</text>
        </HStack>
      </VStack>
    </view>
  );
}
