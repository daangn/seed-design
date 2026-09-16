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
            <ActionButton variant="neutralSolid">Footer 레이아웃</ActionButton>
          </DialogTrigger>
          <DialogContent
            title="Footer 레이아웃"
            description="버튼 배치는 view의 flex 레이아웃으로 직접 구성합니다."
          >
            <DialogBody>
              <view className="dialog-example-column">
                <text className="dialog-example-text">
                  DialogFooter는 flex 레이아웃만 제공합니다.
                </text>
                <text className="dialog-example-text">
                  넓은 다이얼로그에서는 주요 액션을 우측에 가로로 정렬할 수 있습니다.
                </text>
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
