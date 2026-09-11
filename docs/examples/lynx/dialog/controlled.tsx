import "./styles";

import { useState } from "@lynx-js/react";
import {
  DialogAction,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogRoot,
} from "@/components/ui/dialog";
import { ActionButton, useSeedClassName } from "@seed-design/lynx-react";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [open, setOpen] = useState(false);

  function handleOpen() {
    "background only";
    setOpen(true);
  }

  return (
    <view className={`${seedClassName} docs-lynx-dialog-root`}>
      <view className="dialog-example-stage">
        <view className="dialog-example-column">
          <ActionButton variant="neutralSolid" bindtap={handleOpen}>
            열기
          </ActionButton>
          <DialogRoot open={open} onOpenChange={setOpen}>
            <DialogContent title="제목" description="설명을 작성할 수 있어요">
              <DialogBody>
                <text className="dialog-example-text">
                  Labore do culpa dolore irure nisi dolor dolor laboris veniam ipsum excepteur
                  adipisicing laboris non quis.
                </text>
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
    </view>
  );
}
