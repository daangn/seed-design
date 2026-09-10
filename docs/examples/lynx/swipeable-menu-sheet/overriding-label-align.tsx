import "./styles";

import { root } from "@lynx-js/react";
import { ActionButton, useSeedClassName, VStack } from "@seed-design/lynx-react";
import {
  SwipeableMenuSheetContent,
  SwipeableMenuSheetGroup,
  SwipeableMenuSheetItem,
  SwipeableMenuSheetRoot,
  SwipeableMenuSheetTrigger,
} from "@/components/ui/swipeable-menu-sheet";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <VStack className="swipeable-menu-sheet-preview" gap="x3">
        <SwipeableMenuSheetRoot>
          <SwipeableMenuSheetTrigger>
            <ActionButton variant="neutralSolid">메뉴 열기</ActionButton>
          </SwipeableMenuSheetTrigger>
          <SwipeableMenuSheetContent
            accessibility-label="레이블 정렬 예제 메뉴"
            labelAlign="center"
          >
            <SwipeableMenuSheetGroup labelAlign="left">
              <SwipeableMenuSheetItem label="그룹의 왼쪽 정렬" />
              <SwipeableMenuSheetItem label="항목의 가운데 정렬" labelAlign="center" />
              <SwipeableMenuSheetItem label="그룹의 왼쪽 정렬" />
            </SwipeableMenuSheetGroup>
            <SwipeableMenuSheetGroup>
              <SwipeableMenuSheetItem label="콘텐츠의 가운데 정렬" />
              <SwipeableMenuSheetItem label="항목의 왼쪽 정렬" labelAlign="left" tone="critical" />
            </SwipeableMenuSheetGroup>
          </SwipeableMenuSheetContent>
        </SwipeableMenuSheetRoot>
      </VStack>
    </page>
  );
}

root.render(<Root />);
