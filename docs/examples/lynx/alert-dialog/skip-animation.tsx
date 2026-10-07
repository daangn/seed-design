import "./styles";

import { ActionButton } from "@seed-design/lynx-react";
import {
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogRoot,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Example() {
  return (
    <AlertDialogRoot skipAnimation>
      <AlertDialogTrigger>
        <ActionButton variant="neutralSolid">애니메이션 없이 열기</ActionButton>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>즉시 표시</AlertDialogTitle>
          <AlertDialogDescription>
            skipAnimation이 설정되어 열고 닫을 때 전환 애니메이션을 사용하지 않습니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <view className="alert-dialog-example-actions">
            <AlertDialogAction variant="neutralWeak">취소</AlertDialogAction>
            <AlertDialogAction variant="neutralSolid">확인</AlertDialogAction>
          </view>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogRoot>
  );
}
