import IconPencilLine from "@karrotmarket/lynx-monochrome-icon/IconPencilLine";
import IconPlusLine from "@karrotmarket/lynx-monochrome-icon/IconPlusLine";
import IconTrashcanLine from "@karrotmarket/lynx-monochrome-icon/IconTrashcanLine";

import { ActionButton } from "@seed-design/lynx-react";
import { MenuContent, MenuGroup, MenuItem, MenuRoot, MenuTrigger } from "@/components/ui/menu";

export default function Example() {
  return (
    <MenuRoot>
      <MenuTrigger>
        <ActionButton variant="neutralSolid">열기</ActionButton>
      </MenuTrigger>
      <MenuContent>
        <MenuGroup>
          <MenuItem label="추가" prefixIcon={<IconPlusLine />} />
          <MenuItem label="수정" prefixIcon={<IconPencilLine />} />
        </MenuGroup>
        <MenuGroup>
          <MenuItem label="삭제" tone="critical" prefixIcon={<IconTrashcanLine />} />
        </MenuGroup>
      </MenuContent>
    </MenuRoot>
  );
}
