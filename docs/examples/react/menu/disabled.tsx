import {
  IconArrowUpBracketDownLine,
  IconPencilLine,
  IconPlusLine,
} from "@karrotmarket/react-monochrome-icon";
import { ActionButton } from "seed-design/ui/action-button";
import { MenuContent, MenuGroup, MenuItem, MenuRoot, MenuTrigger } from "seed-design/ui/menu";

export default function MenuDisabled() {
  return (
    <MenuRoot>
      <MenuTrigger asChild>
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
