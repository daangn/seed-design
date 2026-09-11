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

function DialogExample({ showCloseAction }: { showCloseAction: boolean }) {
  return (
    <DialogRoot>
      <DialogTrigger>
        <ActionButton variant="neutralSolid">
          {showCloseAction ? "닫기 액션 있음" : "닫기 액션 없음"}
        </ActionButton>
      </DialogTrigger>
      <DialogContent
        title={showCloseAction ? "닫기 액션" : "닫기 액션 없음"}
        description={
          showCloseAction
            ? "Registry DialogContent가 닫기 ActionButton을 내부에서 제공합니다."
            : "닫기 액션을 숨긴 경우 푸터에 닫기 액션을 제공해야 합니다."
        }
        showCloseButton={showCloseAction}
      >
        <DialogBody>
          <text className="dialog-example-text">
            {showCloseAction
              ? "DialogContent의 showCloseButton을 사용합니다."
              : "showCloseButton={false}인 경우 푸터 액션만 제공합니다."}
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
  );
}

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-dialog-root`}>
      <view className="dialog-example-stage">
        <view className="dialog-example-column">
          <DialogExample showCloseAction />
          <DialogExample showCloseAction={false} />
        </view>
      </view>
    </view>
  );
}
