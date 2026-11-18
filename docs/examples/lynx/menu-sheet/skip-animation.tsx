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
    <MenuSheetRoot skipAnimation>
      <MenuSheetTrigger>
        <ActionButton variant="neutralSolid">즉시 메뉴 열기</ActionButton>
      </MenuSheetTrigger>
      <MenuSheetContent title="애니메이션 없이 열리는 메뉴">
        <MenuSheetGroup>
          <MenuSheetItem label="숨기기" prefixIcon={<IconEyeSlashLine />} />
        </MenuSheetGroup>
      </MenuSheetContent>
    </MenuSheetRoot>
  );
}
