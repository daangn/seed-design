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
      <MenuSheetContent title="닫기 버튼이 있는 메뉴" showCloseButton>
        <MenuSheetGroup>
          <MenuSheetItem label="숨기기" prefixIcon={<IconEyeSlashLine />} />
        </MenuSheetGroup>
      </MenuSheetContent>
    </MenuSheetRoot>
  );
}
