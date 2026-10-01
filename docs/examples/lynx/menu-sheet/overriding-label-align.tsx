import "./styles";

import { ActionButton, useSeedClassName, VStack } from "@seed-design/lynx-react";
import {
  MenuSheetContent,
  MenuSheetGroup,
  MenuSheetItem,
  MenuSheetRoot,
  MenuSheetTrigger,
} from "@/components/ui/menu-sheet";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-menu-sheet-root`}>
      <VStack className="menu-sheet-preview" gap="x3">
        <MenuSheetRoot>
          <MenuSheetTrigger>
            <ActionButton variant="neutralSolid">메뉴 열기</ActionButton>
          </MenuSheetTrigger>
          <MenuSheetContent accessibility-label="레이블 정렬 예제 메뉴" labelAlign="center">
            <MenuSheetGroup labelAlign="left">
              <MenuSheetItem label="그룹의 왼쪽 정렬" />
              <MenuSheetItem label="항목의 가운데 정렬" labelAlign="center" />
              <MenuSheetItem label="그룹의 왼쪽 정렬" />
            </MenuSheetGroup>
            <MenuSheetGroup>
              <MenuSheetItem label="콘텐츠의 가운데 정렬" />
              <MenuSheetItem label="항목의 왼쪽 정렬" labelAlign="left" tone="critical" />
            </MenuSheetGroup>
          </MenuSheetContent>
        </MenuSheetRoot>
      </VStack>
    </view>
  );
}
