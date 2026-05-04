import { IconPencilLine, IconPlusLine } from "@karrotmarket/react-monochrome-icon";
import { HStack } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "seed-design/ui/menu";

export default function MenuSize() {
  return (
    <HStack gap="x4">
      <MenuRoot size="medium">
        <MenuTrigger asChild>
          <ActionButton variant="neutralSolid">Medium</ActionButton>
        </MenuTrigger>
        <MenuContent>
          <MenuGroup>
            <MenuGroupLabel>작업</MenuGroupLabel>
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
            <MenuGroupLabel>작업</MenuGroupLabel>
            <MenuItem label="추가" prefixIcon={<IconPlusLine />} />
            <MenuItem label="수정" prefixIcon={<IconPencilLine />} />
          </MenuGroup>
        </MenuContent>
      </MenuRoot>
    </HStack>
  );
}
