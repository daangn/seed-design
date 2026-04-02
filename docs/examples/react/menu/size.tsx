import { IconPencilLine, IconPlusLine } from "@karrotmarket/react-monochrome-icon";
import { HStack } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  MenuContent,
  MenuGroup,
  MenuGroupHeader,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "seed-design/ui/menu";

const MenuSize = () => {
  return (
    <HStack gap="x4">
      <MenuRoot size="medium">
        <MenuTrigger asChild>
          <ActionButton variant="neutralSolid">Medium</ActionButton>
        </MenuTrigger>
        <MenuContent>
          <MenuGroup>
            <MenuGroupHeader>작업</MenuGroupHeader>
            <MenuItem label="추가" prefixIcon={<IconPlusLine />} />
            <MenuItem label="수정" prefixIcon={<IconPencilLine />} />
          </MenuGroup>
        </MenuContent>
      </MenuRoot>

      <MenuRoot size="small">
        <MenuTrigger asChild>
          <ActionButton variant="neutralSolid">Small</ActionButton>
        </MenuTrigger>
        <MenuContent>
          <MenuGroup>
            <MenuGroupHeader>작업</MenuGroupHeader>
            <MenuItem label="추가" prefixIcon={<IconPlusLine />} />
            <MenuItem label="수정" prefixIcon={<IconPencilLine />} />
          </MenuGroup>
        </MenuContent>
      </MenuRoot>
    </HStack>
  );
};

export default MenuSize;
