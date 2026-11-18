import "./styles";

import {
  DialogAction,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogRoot,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ActionButton } from "@seed-design/lynx-react";

export default function Example() {
  return (
    <DialogRoot>
      <DialogTrigger>
        <ActionButton variant="neutralSolid">Open Dialog</ActionButton>
      </DialogTrigger>
      <DialogContent title="긴 본문" description="최대 높이에 닿으면 Body만 스크롤됩니다">
        <DialogBody>
          <view className="dialog-example-scroll-content">
            {Array.from({ length: 40 }, (_, index) => index + 1).map((line) => (
              <text key={line} className="dialog-example-text">
                {line}. 본문이 길어지면 Body 영역만 스크롤됩니다.
              </text>
            ))}
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
  );
}
