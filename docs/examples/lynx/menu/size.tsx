import "./styles";

import IconPencilLine from "@karrotmarket/lynx-monochrome-icon/IconPencilLine";
import IconPlusLine from "@karrotmarket/lynx-monochrome-icon/IconPlusLine";
import { root } from "@lynx-js/react";
import { ActionButton, HStack, useSeedClassName } from "@seed-design/lynx-react";
import {
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuRoot,
  MenuTrigger,
  type MenuRootProps,
} from "@/components/ui/menu";

function SizeMenu({ size, label }: { size: MenuRootProps["size"]; label: string }) {
  return (
    <MenuRoot size={size}>
      <MenuTrigger>
        <ActionButton variant="neutralSolid">{label}</ActionButton>
      </MenuTrigger>
      <MenuContent>
        <MenuGroup>
          <MenuGroupLabel>작업</MenuGroupLabel>
          <MenuItem label="추가" prefixIcon={<IconPlusLine />} />
          <MenuItem label="수정" prefixIcon={<IconPencilLine />} />
        </MenuGroup>
      </MenuContent>
    </MenuRoot>
  );
}

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <HStack width="full" height="full" gap="x4" align="center" justify="center">
        <SizeMenu size="medium" label="Medium" />
        <SizeMenu size="small" label="Small" />
        <SizeMenu size="responsive" label="Responsive" />
      </HStack>
    </page>
  );
}

root.render(<Root />);
