import "./styles";

import IconEyeSlashLine from "@karrotmarket/lynx-monochrome-icon/IconEyeSlashLine";
import { ActionButton } from "@seed-design/lynx-react";
import {
  MenuSheetContent,
  MenuSheetGroup,
  MenuSheetItem,
  MenuSheetRoot,
  MenuSheetTrigger,
} from "@/components/ui/menu-sheet";

export default function Example() {
  return (
    <MenuSheetRoot>
      <MenuSheetTrigger>
        <ActionButton variant="neutralSolid">메뉴 열기</ActionButton>
      </MenuSheetTrigger>
      <MenuSheetContent title="게시글 관리" description="원하는 작업을 선택해 주세요.">
        <MenuSheetGroup>
          <MenuSheetItem label="수정하기" prefixIcon={<IconEyeSlashLine />} />
          <MenuSheetItem
            label="공유하기"
            prefixIcon={<IconEyeSlashLine />}
            description="친구에게 게시글을 공유할 수 있어요."
          />
          <MenuSheetItem
            label="끌어올리기"
            prefixIcon={<IconEyeSlashLine />}
            description="게시글을 다시 상단에 표시해요."
          />
        </MenuSheetGroup>
        <MenuSheetGroup>
          <MenuSheetItem label="숨기기" prefixIcon={<IconEyeSlashLine />} />
          <MenuSheetItem label="삭제하기" prefixIcon={<IconEyeSlashLine />} tone="critical" />
        </MenuSheetGroup>
      </MenuSheetContent>
    </MenuSheetRoot>
  );
}
