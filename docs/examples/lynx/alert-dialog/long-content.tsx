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
          <AlertDialogTitle>긴 내용</AlertDialogTitle>
          <AlertDialogDescription>
            {Array.from(
              { length: 30 },
              (_, index) =>
                `${index + 1}. 내용이 최대 높이를 넘으면 AlertDialog 안에서 스크롤됩니다.`,
            ).join(" ")}
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
