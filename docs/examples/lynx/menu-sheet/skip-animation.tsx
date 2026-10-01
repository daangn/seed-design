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
      </VStack>
    </view>
  );
}
