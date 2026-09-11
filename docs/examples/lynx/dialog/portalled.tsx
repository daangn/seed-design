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
            <ActionButton variant="neutralSolid">열기</ActionButton>
          </DialogTrigger>
          <DialogContent
            container="window"
            overlayLevel={2}
            title="Overlay"
            description="Lynx에서는 Positioner의 container와 overlayLevel로 네이티브 overlay 레이어를 선택합니다."
          >
            <DialogBody>
              <text className="dialog-example-text">
                콘텐츠는 window 컨테이너와 overlay level 2 위에 표시됩니다.
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
