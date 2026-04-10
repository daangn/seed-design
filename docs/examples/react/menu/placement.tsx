import { IconPencilLine, IconPlusLine } from "@karrotmarket/react-monochrome-icon";
import { Box } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  MenuContent,
  MenuGroup,
  MenuItem,
  MenuRoot,
  MenuTrigger,
  type MenuRootProps,
} from "seed-design/ui/menu";

function PlacementMenu({ placement }: { placement: NonNullable<MenuRootProps["placement"]> }) {
  return (
    <MenuRoot placement={placement} defaultOpen>
      <MenuTrigger asChild>
        <ActionButton variant="neutralSolid">{placement}</ActionButton>
      </MenuTrigger>
      <MenuContent>
        <MenuGroup>
          <MenuItem label="추가" prefixIcon={<IconPlusLine />} />
          <MenuItem label="수정" prefixIcon={<IconPencilLine />} />
        </MenuGroup>
      </MenuContent>
    </MenuRoot>
  );
}

export default function MenuPlacement() {
  return (
    <div
      style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "80px", padding: "80px" }}
    >
      <PlacementMenu placement="top-end" />
      <PlacementMenu placement="top" />
      <PlacementMenu placement="top-start" />
      <PlacementMenu placement="left-end" />
      <Box />
      <PlacementMenu placement="right-end" />
      <PlacementMenu placement="left" />
      <Box />
      <PlacementMenu placement="right" />
      <PlacementMenu placement="left-start" />
      <Box />
      <PlacementMenu placement="right-start" />
      <PlacementMenu placement="bottom-end" />
      <PlacementMenu placement="bottom" />
      <PlacementMenu placement="bottom-start" />
    </div>
  );
}
