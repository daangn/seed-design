import "./styles";

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

  return (
    <view className={`${seedClassName} docs-lynx-dialog-root`}>
      <view className="dialog-example-stage">
        <DialogRoot>
          <DialogTrigger>
            <ActionButton variant="neutralSolid">Open</ActionButton>
          </DialogTrigger>
          <DialogContent title="Trigger 패턴">
            <DialogBody>
              <text className="dialog-example-text">
                Trigger를 탭하면 현재 화면 위에 Dialog가 열립니다.
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
  );
}
