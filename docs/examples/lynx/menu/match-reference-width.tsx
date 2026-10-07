import { ActionButton, Box } from "@seed-design/lynx-react";
import { MenuContent, MenuGroup, MenuItem, MenuRoot, MenuTrigger } from "@/components/ui/menu";

export default function Example() {
  return (
    <Box width="full" maxWidth="400px">
      <MenuRoot matchReferenceWidth>
        <MenuTrigger>
          <ActionButton variant="neutralSolid">열기</ActionButton>
        </MenuTrigger>
        <MenuContent>
          <MenuGroup>
            <MenuItem label="추가" />
            <MenuItem label="수정" />
            <MenuItem label="공유" />
          </MenuGroup>
        </MenuContent>
      </MenuRoot>
    </Box>
  );
}
