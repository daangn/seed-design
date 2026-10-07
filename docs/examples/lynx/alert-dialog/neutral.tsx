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
    <AlertDialogRoot>
      <AlertDialogTrigger>
        <ActionButton variant="neutralSolid">열기</ActionButton>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>제목</AlertDialogTitle>
          <AlertDialogDescription>중립적인 선택지를 제공합니다.</AlertDialogDescription>
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
