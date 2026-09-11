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

function DialogExample({ size }: { size: "medium" | "large" }) {
  const isLarge = size === "large";

  return (
    <DialogRoot size={size}>
      <DialogTrigger>
        <ActionButton variant="neutralSolid">
          {isLarge ? "Large Dialog" : "Medium Dialog"}
        </ActionButton>
      </DialogTrigger>
      <DialogContent
        title={isLarge ? "Large Dialog" : "Medium Dialog"}
        description={
          isLarge
            ? "넓은 다이얼로그에서 더 많은 상세 콘텐츠를 다룹니다."
            : "기본 너비로 상세 정보와 주요 액션을 함께 제공합니다."
        }
      >
        <DialogBody>
          <text className="dialog-example-text">
            {isLarge
              ? "large size는 넓은 화면에서 더 큰 Dialog token 너비를 사용합니다."
              : "medium은 Dialog의 기본 size입니다."}
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
          <DialogExample size="medium" />
          <DialogExample size="large" />
        </view>
      </view>
    </view>
  );
}
