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
          <MenuSheetContent accessibility-label="아이콘이 없는 메뉴" labelAlign="center">
            <MenuSheetGroup>
              <MenuSheetItem label="게시글 수정하기" />
              <MenuSheetItem label="게시글 공유하기" />
              <MenuSheetItem label="게시글 끌어올리기" />
            </MenuSheetGroup>
            <MenuSheetGroup>
              <MenuSheetItem label="게시글 숨기기" />
              <MenuSheetItem label="게시글 삭제하기" tone="critical" />
            </MenuSheetGroup>
          </MenuSheetContent>
        </MenuSheetRoot>
      </VStack>
    </view>
  );
}
