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

function DialogExample({ variant }: { variant: "maxHeight" | "minHeight" | "fullBleed" }) {
  const isMaxHeight = variant === "maxHeight";
  const isMinHeight = variant === "minHeight";
  const isFullBleed = variant === "fullBleed";

  return (
    <DialogRoot>
      <DialogTrigger>
        <ActionButton variant="neutralSolid">
          {isMaxHeight ? "maxHeight 200px" : isMinHeight ? "minHeight + 가운데 정렬" : "paddingX 0"}
        </ActionButton>
      </DialogTrigger>
      <DialogContent
        title={isMaxHeight ? "본문 최대 높이" : isMinHeight ? "빈 상태" : "Full Bleed"}
        description={
          isMaxHeight
            ? "DialogBody의 높이를 200px로 제한합니다"
            : isMinHeight
              ? "짧은 내용에서도 높이를 고정합니다"
              : "가로 패딩을 제거해 콘텐츠를 가장자리까지 배치합니다"
        }
      >
        <DialogBody
          className={
            isMaxHeight
              ? "dialog-example-scroll-body"
              : isMinHeight
                ? "dialog-example-min-height-body"
                : undefined
          }
          style={isFullBleed ? { paddingLeft: 0, paddingRight: 0 } : undefined}
        >
          {isMaxHeight ? (
            <view className="dialog-example-scroll-content">
              {Array.from({ length: 12 }, (_, index) => index + 1).map((line) => (
                <text key={line} className="dialog-example-text">
                  {line}. 본문이 200px을 넘으면 그 안에서 스크롤됩니다.
                </text>
              ))}
            </view>
          ) : isMinHeight ? (
            <text className="dialog-example-text">아직 항목이 없습니다</text>
          ) : (
            <view className="dialog-example-full-bleed">
              <text className="dialog-example-text">가장자리까지 닿는 영역입니다</text>
            </view>
          )}
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
          <DialogExample variant="maxHeight" />
          <DialogExample variant="minHeight" />
          <DialogExample variant="fullBleed" />
        </view>
      </view>
    </view>
  );
}
