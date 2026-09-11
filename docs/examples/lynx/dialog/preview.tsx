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
            <ActionButton variant="neutralSolid">Open Dialog</ActionButton>
          </DialogTrigger>
          <DialogContent title="제목" description="설명을 작성할 수 있어요">
            <DialogBody>
              <text className="dialog-example-text">
                본문에는 사용자가 확인해야 할 내용이나 추가 입력 폼을 배치할 수 있습니다.
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
