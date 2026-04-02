import {
  IconArrowUpBracketDownLine,
  IconPencilLine,
  IconPlusLine,
} from "@karrotmarket/react-monochrome-icon";
import { ActionButton } from "seed-design/ui/action-button";
import { MenuContent, MenuGroup, MenuItem, MenuRoot, MenuTrigger } from "seed-design/ui/menu";

const MenuWithDescription = () => {
  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <ActionButton variant="neutralSolid">열기</ActionButton>
      </MenuTrigger>
      <MenuContent>
        <MenuGroup>
          <MenuItem
            label="라이브러리에 추가"
            description="내 라이브러리에 항목을 추가합니다"
            prefixIcon={<IconPlusLine />}
          />
          <MenuItem
            label="수정"
            description="현재 항목을 수정합니다"
            prefixIcon={<IconPencilLine />}
          />
          <MenuItem
            label="공유"
            description="다른 사람에게 공유합니다"
            prefixIcon={<IconArrowUpBracketDownLine />}
          />
        </MenuGroup>
      </MenuContent>
    </MenuRoot>
  );
};

export default MenuWithDescription;
