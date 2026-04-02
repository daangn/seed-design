import { IconPencilLine, IconPlusLine } from "@karrotmarket/react-monochrome-icon";
import { HStack } from "@seed-design/react";
import { useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import { MenuContent, MenuGroup, MenuItem, MenuRoot, MenuTrigger } from "seed-design/ui/menu";

const MenuControlled = () => {
  const [open, setOpen] = useState(false);

  return (
    <HStack gap="x2">
      <ActionButton variant="neutralSolid" onClick={() => setOpen(true)}>
        열기
      </ActionButton>
      <MenuRoot open={open} onOpenChange={setOpen}>
        <MenuTrigger asChild>
          <ActionButton variant="neutralWeak">Trigger</ActionButton>
        </MenuTrigger>
        <MenuContent>
          <MenuGroup>
            <MenuItem label="추가" prefixIcon={<IconPlusLine />} />
            <MenuItem label="수정" prefixIcon={<IconPencilLine />} />
          </MenuGroup>
        </MenuContent>
      </MenuRoot>
    </HStack>
  );
};

export default MenuControlled;
