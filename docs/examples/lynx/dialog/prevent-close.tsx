import "./styles";

import { useState } from "@lynx-js/react";
import {
  DialogAction,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogRoot,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ActionButton, useSeedClassName } from "@seed-design/lynx-react";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [open, setOpen] = useState(false);
  const [preventClose, setPreventClose] = useState(true);

  function handleTogglePreventClose() {
    "background only";
    setPreventClose((previous) => !previous);
  }

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen || !preventClose) {
      setOpen(nextOpen);
    }
  }

  return (
    <view className={`${seedClassName} docs-lynx-dialog-root`}>
      <view className="dialog-example-stage">
        <DialogRoot open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger>
            <ActionButton variant="neutralSolid">열기</ActionButton>
          </DialogTrigger>
          <DialogContent title="닫기 방지" description="확인 버튼을 눌러도 Dialog가 닫히지 않도록 설정할 수 있습니다.">
            <DialogBody>
              <view className="dialog-example-option">
                <text className="dialog-example-text">
                  닫힘 방지: {JSON.stringify(preventClose)}
                </text>
                <ActionButton variant="neutralWeak" bindtap={handleTogglePreventClose}>
                  전환
                </ActionButton>
              </view>
            </DialogBody>
            <DialogFooter>
              <view className="dialog-example-actions">
                <DialogAction variant="neutralWeak">취소</DialogAction>
                <DialogAction variant="neutralSolid">확인</DialogAction>
              </view>
            </DialogFooter>
          </DialogContent>
        </DialogRoot>
      </view>
    </view>
  );
}
