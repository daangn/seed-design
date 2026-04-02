import {
  IconPencilLine,
  IconPlusLine,
  IconTrashcanLine,
} from "@karrotmarket/react-monochrome-icon";
import { ActionButton } from "seed-design/ui/action-button";
import {
  MenuContent,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "seed-design/ui/menu";

export default function MenuTone() {
  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <ActionButton variant="neutralSolid">열기</ActionButton>
      </MenuTrigger>
      <MenuContent>
        <MenuGroup>
          <MenuItem label="추가" prefixIcon={<IconPlusLine />} />
          <MenuItem label="수정" prefixIcon={<IconPencilLine />} />
        </MenuGroup>
        <MenuDivider />
        <MenuGroup>
          <MenuItem label="삭제" tone="critical" prefixIcon={<IconTrashcanLine />} />
        </MenuGroup>
      </MenuContent>
    </MenuRoot>
  );
}
