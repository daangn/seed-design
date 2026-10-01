import "./styles";

import { useState } from "@lynx-js/react";
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
  const [open, setOpen] = useState(false);

  function handleOpenChange(nextOpen: boolean) {
    "background only";
    setOpen(nextOpen);
  }

  return (
    <view className={`${seedClassName} docs-lynx-menu-sheet-root`}>
      <VStack className="menu-sheet-preview" gap="x3">
        <text className="menu-sheet-preview__status">{open ? "열림: true" : "열림: false"}</text>
        <MenuSheetRoot open={open} onOpenChange={handleOpenChange}>
          <MenuSheetTrigger>
            <ActionButton variant="neutralSolid">메뉴 열기</ActionButton>
          </MenuSheetTrigger>
          <MenuSheetContent title="게시글 관리" description="원하는 작업을 선택해 주세요.">
            <MenuSheetGroup>
              <MenuSheetItem label="수정하기" />
              <MenuSheetItem label="공유하기" description="친구에게 게시글을 공유할 수 있어요." />
              <MenuSheetItem label="끌어올리기" />
            </MenuSheetGroup>
            <MenuSheetGroup>
              <MenuSheetItem label="숨기기" />
              <MenuSheetItem label="삭제하기" tone="critical" />
            </MenuSheetGroup>
          </MenuSheetContent>
        </MenuSheetRoot>
      </VStack>
    </view>
  );
}
