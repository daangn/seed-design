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
  const [preventClose, setPreventClose] = useState(true);

  function handleOpen() {
    "background only";
    setOpen(true);
  }

  function handleTogglePreventClose() {
    "background only";
    setPreventClose((previous) => !previous);
  }

  function handleOpenChange(nextOpen: boolean) {
    "background only";
    if (nextOpen || !preventClose) {
      setOpen(nextOpen);
    }
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
          <AlertDialogRoot open={open} onOpenChange={handleOpenChange}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>닫기 방지</AlertDialogTitle>
                <AlertDialogDescription>
                  닫힘 방지 상태에서는 확인 버튼을 눌러도 Alert Dialog가 닫히지 않습니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <view style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <view
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "8px",
                    }}
                  >
                    <text>닫힘 방지: {preventClose ? "켜짐" : "꺼짐"}</text>
                    <ActionButton variant="neutralWeak" bindtap={handleTogglePreventClose}>
                      {preventClose ? "닫힘 허용" : "닫힘 방지"}
                    </ActionButton>
                  </view>
                  <view className="alert-dialog-example-actions">
                    <AlertDialogAction variant="neutralSolid">확인</AlertDialogAction>
                  </view>
                </view>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogRoot>
        </view>
      </view>
    </view>
  );
}
