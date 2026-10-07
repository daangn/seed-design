import IconPencilLine from "@karrotmarket/lynx-monochrome-icon/IconPencilLine";
import IconPlusLine from "@karrotmarket/lynx-monochrome-icon/IconPlusLine";
import { useState } from "@lynx-js/react";
import { Box, HStack } from "@seed-design/lynx-react";
import { MenuAnchor, MenuContent, MenuGroup, MenuItem, MenuRoot } from "@/components/ui/menu";
import { Switch } from "@/components/ui/switch";

export default function Example() {
  const [open, setOpen] = useState(false);

  function handleOpenChange(nextOpen: boolean, details?: { reason?: string }) {
    "background only";
    if (!nextOpen && details?.reason === "interactOutside") return;
    setOpen(nextOpen);
  }

  return (
    <HStack width="full" align="center" justify="space-between">
      <Switch tone="neutral" label="메뉴" checked={open} onCheckedChange={setOpen} />
      <MenuRoot open={open} onOpenChange={handleOpenChange}>
        <MenuAnchor>
          <Box width="80px" height="80px" overflowX="hidden" overflowY="hidden" borderRadius="full">
            <image
              src="https://avatars.githubusercontent.com/u/54893898?v=4"
              mode="aspectFill"
              style={{ width: "80px", height: "80px" }}
            />
          </Box>
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
