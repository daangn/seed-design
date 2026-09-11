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

function DialogExample({ long }: { long: boolean }) {
  return (
    <DialogRoot>
      <DialogTrigger>
        <ActionButton variant={long ? "neutralSolid" : "neutralWeak"}>
          {long ? "긴 본문 (스크롤 적용)" : "짧은 본문 (스크롤 없음)"}
        </ActionButton>
      </DialogTrigger>
      <DialogContent
        title={long ? "긴 본문" : "짧은 본문"}
        description={
          long
            ? "본문이 넘치면 DialogBody 안에서 스크롤됩니다"
            : "본문이 짧으면 별도 스크롤이 생기지 않습니다"
        }
      >
        <DialogBody>
          <view className="dialog-example-scroll-content">
            {long ? (
              Array.from({ length: 16 }, (_, index) => index + 1).map((line) => (
                <text key={line} className="dialog-example-text">
                  {line}. Lynx의 DialogBody는 native scroll-view로 렌더링됩니다.
                </text>
              ))
            ) : (
              <text className="dialog-example-text">
                내용이 짧으면 마지막 줄까지 바로 확인할 수 있습니다.
              </text>
            )}
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

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-dialog-root`}>
      <view className="dialog-example-stage">
        <view className="dialog-example-column">
          <DialogExample long={false} />
          <DialogExample long />
        </view>
      </view>
    </view>
  );
}
