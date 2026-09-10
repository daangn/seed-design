import "./styles";

import IconArrowUpBracketDownLine from "@karrotmarket/lynx-monochrome-icon/IconArrowUpBracketDownLine";
import IconPencilLine from "@karrotmarket/lynx-monochrome-icon/IconPencilLine";
import IconPlusLine from "@karrotmarket/lynx-monochrome-icon/IconPlusLine";

import { ActionButton, VStack, useSeedClassName } from "@seed-design/lynx-react";
import { MenuContent, MenuGroup, MenuItem, MenuRoot, MenuTrigger } from "@/components/ui/menu";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-menu-root`}>
      <VStack width="full" height="full" align="center" justify="center">
        <MenuRoot>
          <MenuTrigger>
            <ActionButton variant="neutralSolid">열기</ActionButton>
          </MenuTrigger>
          <MenuContent>
            <MenuGroup>
              <MenuItem
                label="라이브러리에 추가"
                description="내 라이브러리에 항목을 추가합니다"
                prefixIcon={<IconPlusLine />}
              />
              <MenuItem
                label="수정"
                description="현재 항목을 수정합니다"
                prefixIcon={<IconPencilLine />}
              />
              <MenuItem
                label="공유"
                description="다른 사람에게 공유합니다"
                prefixIcon={<IconArrowUpBracketDownLine />}
              />
            </MenuGroup>
          </MenuContent>
        </MenuRoot>
      </VStack>
    </view>
  );
}
