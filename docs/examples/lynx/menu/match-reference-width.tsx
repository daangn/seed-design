import "./styles";

import { root } from "@lynx-js/react";
import { ActionButton, Box, VStack, useSeedClassName } from "@seed-design/lynx-react";
import { MenuContent, MenuGroup, MenuItem, MenuRoot, MenuTrigger } from "@/components/ui/menu";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <VStack width="full" height="full" align="center" justify="center">
        <MenuRoot matchReferenceWidth>
          <MenuTrigger>
            <Box width="400px" maxWidth="100%">
              <ActionButton variant="neutralSolid">열기</ActionButton>
            </Box>
          </MenuTrigger>
          <MenuContent>
            <MenuGroup>
              <MenuItem label="추가" />
              <MenuItem label="수정" />
              <MenuItem label="공유" />
            </MenuGroup>
          </MenuContent>
        </MenuRoot>
      </VStack>
    </page>
  );
}

root.render(<Root />);
