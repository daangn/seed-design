import "./styles";

import IconEyeSlashLine from "@karrotmarket/lynx-monochrome-icon/IconEyeSlashLine";
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
          <MenuSheetContent accessibility-label="아이콘이 있는 메뉴">
            <MenuSheetGroup>
              <MenuSheetItem label="게시글 숨기기" prefixIcon={<IconEyeSlashLine />} />
              <MenuSheetItem label="알림 끄기" prefixIcon={<IconEyeSlashLine />} />
              <MenuSheetItem label="관심 없음" prefixIcon={<IconEyeSlashLine />} />
            </MenuSheetGroup>
            <MenuSheetGroup>
              <MenuSheetItem label="게시글 신고하기" prefixIcon={<IconEyeSlashLine />} />
              <MenuSheetItem
                label="게시글 삭제하기"
                prefixIcon={<IconEyeSlashLine />}
                tone="critical"
              />
            </MenuSheetGroup>
          </MenuSheetContent>
        </MenuSheetRoot>
      </VStack>
    </view>
  );
}
