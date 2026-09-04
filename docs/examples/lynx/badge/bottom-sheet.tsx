import "./styles";

import { root, useState } from "@lynx-js/react";
import { ActionButton, useSeedClassName } from "@seed-design/lynx-react";
import { Badge } from "@/components/ui/badge";
import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
} from "@/components/ui/bottom-sheet";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [open, setOpen] = useState(false);

  function handleOpen() {
    "background only";
    setOpen(true);
  }

  function handleClose() {
    "background only";
    setOpen(false);
  }

  return (
    <page className={seedClassName}>
      <view className="badge-preview">
        <BottomSheetRoot open={open} onOpenChange={setOpen}>
          <Badge
            actionProps={{
              "accessibility-label": "집주인 인증 안내",
              bindtap: handleOpen,
            }}
          >
            집주인
          </Badge>
          <BottomSheetContent
            title="집주인 인증 매물"
            description="집주인이 직접 등록한 매물에 표시돼요."
          >
            <BottomSheetBody>
              <text>
                매물을 올린 사람이 집주인임을 확인할 수 있어, 중개소에서 등록한 매물과 구분할 수
                있어요.
              </text>
            </BottomSheetBody>
            <BottomSheetFooter>
              <ActionButton variant="brandSolid" bindtap={handleClose}>
                확인
              </ActionButton>
            </BottomSheetFooter>
          </BottomSheetContent>
        </BottomSheetRoot>
      </view>
    </page>
  );
}

root.render(<Root />);
