import { IconPencilLine, IconPlusLine } from "@karrotmarket/react-monochrome-icon";
import { ActionButton } from "seed-design/ui/action-button";
import { MenuContent, MenuGroup, MenuItem, MenuRoot, MenuTrigger } from "seed-design/ui/menu";

export default function MenuPlacement() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, auto)",
        gap: 16,
        justifyContent: "center",
        padding: 80,
      }}
    >
      {(["bottom", "top", "right", "left"] as const).map((placement) => (
        <MenuRoot key={placement} placement={placement}>
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
      ))}
    </div>
  );
}
