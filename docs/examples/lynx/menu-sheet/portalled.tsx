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
      <MenuSheetContent container="window" overlayLevel={2} title="게시글 관리">
        <MenuSheetGroup>
          <MenuSheetItem label="수정하기" prefixIcon={<IconEyeSlashLine />} />
          <MenuSheetItem label="숨기기" prefixIcon={<IconEyeSlashLine />} />
        </MenuSheetGroup>
        <MenuSheetGroup>
          <MenuSheetItem label="삭제하기" prefixIcon={<IconEyeSlashLine />} tone="critical" />
        </MenuSheetGroup>
      </MenuSheetContent>
    </MenuSheetRoot>
  );
}
