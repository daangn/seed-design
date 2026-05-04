import { ActionButton } from "seed-design/ui/action-button";
import { MenuContent, MenuGroup, MenuItem, MenuRoot, MenuTrigger } from "seed-design/ui/menu";

export default function MenuMatchReferenceWidth() {
  return (
    <MenuRoot matchReferenceWidth>
      <MenuTrigger asChild>
        <ActionButton variant="neutralSolid" style={{ width: 400, maxWidth: "100%" }}>
          열기
        </ActionButton>
      </MenuTrigger>
      <MenuContent>
        <MenuGroup>
          <MenuItem label="추가" />
          <MenuItem label="수정" />
          <MenuItem label="공유" />
        </MenuGroup>
      </MenuContent>
    </MenuRoot>
  );
}
