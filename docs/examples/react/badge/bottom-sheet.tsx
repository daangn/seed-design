"use client";

import { useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import { Badge } from "seed-design/ui/badge";
import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
  BottomSheetTrigger,
} from "seed-design/ui/bottom-sheet";

export default function BadgeWithBottomSheet() {
  const [open, setOpen] = useState(false);

  return (
    <BottomSheetRoot open={open} onOpenChange={setOpen}>
      <Badge
        action={{
          "aria-label": "집주인 인증 안내",
          render: (trigger) => <BottomSheetTrigger asChild>{trigger}</BottomSheetTrigger>,
        }}
      >
        집주인
      </Badge>
      <BottomSheetContent
        title="집주인 인증 매물"
        description="집주인이 직접 등록한 매물에 표시돼요."
      >
        <BottomSheetBody>
          매물을 올린 사람이 집주인임을 확인할 수 있어, 중개소에서 등록한 매물과 구분할 수 있어요.
        </BottomSheetBody>
        <BottomSheetFooter>
          <ActionButton variant="brandSolid" onClick={() => setOpen(false)}>
            확인
          </ActionButton>
        </BottomSheetFooter>
      </BottomSheetContent>
    </BottomSheetRoot>
  );
}
