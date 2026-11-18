import "./styles";

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
      <MenuSheetContent
        title="항목이 많은 메뉴"
        description="목록만 스크롤되고 제목은 그대로 남습니다."
      >
        {Array.from({ length: 4 }, (_, group) => (
          <MenuSheetGroup key={group}>
            {Array.from({ length: 6 }, (_, item) => (
              <MenuSheetItem key={item} label={`그룹 ${group + 1} · 항목 ${item + 1}`} />
            ))}
          </MenuSheetGroup>
        ))}
      </MenuSheetContent>
    </MenuSheetRoot>
  );
}
