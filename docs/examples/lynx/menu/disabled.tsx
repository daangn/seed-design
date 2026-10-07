import IconArrowUpBracketDownLine from "@karrotmarket/lynx-monochrome-icon/IconArrowUpBracketDownLine";
import IconPencilLine from "@karrotmarket/lynx-monochrome-icon/IconPencilLine";
import IconPlusLine from "@karrotmarket/lynx-monochrome-icon/IconPlusLine";

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
          <MenuItem
            label="수정"
            description="현재 항목을 수정합니다"
            prefixIcon={<IconPencilLine />}
            disabled
          />
          <MenuItem label="공유" prefixIcon={<IconArrowUpBracketDownLine />} />
        </MenuGroup>
      </MenuContent>
    </MenuRoot>
  );
}
