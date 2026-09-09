import "./styles";

import IconPencilLine from "@karrotmarket/lynx-monochrome-icon/IconPencilLine";
import IconPlusLine from "@karrotmarket/lynx-monochrome-icon/IconPlusLine";
import { root, useState } from "@lynx-js/react";
import { Box, HStack, useSeedClassName } from "@seed-design/lynx-react";
import { MenuAnchor, MenuContent, MenuGroup, MenuItem, MenuRoot } from "@/components/ui/menu";
import { Switch } from "@/components/ui/switch";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [open, setOpen] = useState(false);

  function handleOpenChange(nextOpen: boolean, details?: { reason?: string }) {
    "background only";
    if (!nextOpen && details?.reason === "interactOutside") return;
    setOpen(nextOpen);
  }

  return (
    <page className={seedClassName}>
      <HStack width="full" height="full" px="x5" align="center" justify="space-between">
        <Switch tone="neutral" label="메뉴" checked={open} onCheckedChange={setOpen} />
        <MenuRoot open={open} onOpenChange={handleOpenChange}>
          <MenuAnchor>
            <Box
              width="80px"
              height="80px"
              overflowX="hidden"
              overflowY="hidden"
              borderRadius="full"
            >
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
    </page>
  );
}

root.render(<Root />);
