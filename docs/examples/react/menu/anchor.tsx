import { Avatar } from "seed-design/ui/avatar";
import { IdentityPlaceholder } from "seed-design/ui/identity-placeholder";
import { IconPencilLine, IconPlusLine } from "@karrotmarket/react-monochrome-icon";
import { useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import { MenuAnchor, MenuContent, MenuGroup, MenuItem, MenuRoot } from "seed-design/ui/menu";
import { HStack } from "@seed-design/react";

export default function MenuAnchorExample() {
  const [open, setOpen] = useState(false);

  return (
    <HStack align="center" justify="space-between" width="full">
      <ActionButton variant="neutralSolid" onClick={() => setOpen((prev) => !prev)}>
        토글
      </ActionButton>
      <MenuRoot open={open} onOpenChange={setOpen}>
        <MenuAnchor asChild>
          <Avatar
            size="80"
            src="https://avatars.githubusercontent.com/u/54893898?v=4"
            fallback={<IdentityPlaceholder />}
          />
        </MenuAnchor>
        <MenuContent>
          <MenuGroup>
            <MenuItem label="추가" prefixIcon={<IconPlusLine />} />
            <MenuItem label="수정" prefixIcon={<IconPencilLine />} />
          </MenuGroup>
        </MenuContent>
      </MenuRoot>
    </HStack>
  );
}
