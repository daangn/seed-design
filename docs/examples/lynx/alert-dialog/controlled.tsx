import "./styles";

import { useState } from "@lynx-js/react";
import { ActionButton, useSeedClassName } from "@seed-design/lynx-react";
import {
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogRoot,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [open, setOpen] = useState(false);

  function handleOpen() {
    "background only";
    setOpen(true);
  }

  return (
    <view className={`${seedClassName} docs-lynx-alert-dialog-root`}>
      <view className="alert-dialog-example-stage">
        <view
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}
        >
          <text>열림 상태: {open ? "true" : "false"}</text>
          <ActionButton variant="neutralSolid" bindtap={handleOpen} disabled={open}>
            열기
          </ActionButton>
          <AlertDialogRoot open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>주의</AlertDialogTitle>
                <AlertDialogDescription>이 작업은 되돌릴 수 없습니다.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <view className="alert-dialog-example-actions">
                  <AlertDialogAction variant="neutralWeak">취소</AlertDialogAction>
                  <AlertDialogAction variant="neutralSolid">확인</AlertDialogAction>
                </view>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogRoot>
        </view>
      </view>
    </view>
  );
}
