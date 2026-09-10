import "./styles";

import IconPencilLine from "@karrotmarket/lynx-monochrome-icon/IconPencilLine";
import IconPlusLine from "@karrotmarket/lynx-monochrome-icon/IconPlusLine";

import { ActionButton, Box, HStack, VStack, useSeedClassName } from "@seed-design/lynx-react";
import {
  MenuContent,
  MenuGroup,
  MenuItem,
  MenuRoot,
  MenuTrigger,
  type MenuRootProps,
} from "@/components/ui/menu";

function PlacementMenu({ placement }: { placement: NonNullable<MenuRootProps["placement"]> }) {
  return (
    <Box width="200px">
      <MenuRoot placement={placement}>
        <MenuTrigger>
          <ActionButton variant="neutralSolid">{placement}</ActionButton>
        </MenuTrigger>
        <MenuContent>
          <MenuGroup>
            <MenuItem label="추가" prefixIcon={<IconPlusLine />} />
            <MenuItem label="수정" prefixIcon={<IconPencilLine />} />
          </MenuGroup>
        </MenuContent>
      </MenuRoot>
    </Box>
  );
}

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-menu-root`}>
      <scroll-view scroll-orientation="horizontal" style={{ width: "100%", height: "100%" }}>
        <VStack width="760px" gap="x10" px="x10" py="x10">
          <HStack gap="x10">
            <PlacementMenu placement="top-end" />
            <PlacementMenu placement="top" />
            <PlacementMenu placement="top-start" />
          </HStack>
          <HStack gap="x10">
            <PlacementMenu placement="left-end" />
            <Box width="200px" />
            <PlacementMenu placement="right-end" />
          </HStack>
          <HStack gap="x10">
            <PlacementMenu placement="left" />
            <Box width="200px" />
            <PlacementMenu placement="right" />
          </HStack>
          <HStack gap="x10">
            <PlacementMenu placement="left-start" />
            <Box width="200px" />
            <PlacementMenu placement="right-start" />
          </HStack>
          <HStack gap="x10">
            <PlacementMenu placement="bottom-end" />
            <PlacementMenu placement="bottom" />
            <PlacementMenu placement="bottom-start" />
          </HStack>
        </VStack>
      </scroll-view>
    </view>
  );
}
