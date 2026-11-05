import {
  IconPencilLine,
  IconPlusLine,
  IconTrashcanLine,
} from "@karrotmarket/react-monochrome-icon";
import { ActionButton } from "seed-design/ui/action-button";
import {
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "seed-design/ui/menu";

export default function MenuPreview() {
  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <ActionButton variant="neutralSolid">열기</ActionButton>
      </MenuTrigger>
      <MenuContent>
        <MenuGroup>
          <MenuGroupLabel>작업</MenuGroupLabel>
          <MenuItem label="라이브러리에 추가" prefixIcon={<IconPlusLine />} />
          <MenuItem
            label="수정"
            description="현재 항목을 수정합니다"
            prefixIcon={<IconPencilLine />}
          />
        </MenuGroup>
        <MenuGroup>
          <MenuItem
            label="삭제"
            description="이 작업은 되돌릴 수 없습니다"
            tone="critical"
            prefixIcon={<IconTrashcanLine />}
          />
        </MenuGroup>
      </MenuContent>
    </MenuRoot>
  );
}
