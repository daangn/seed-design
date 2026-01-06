import { PrefixIcon, ResponsivePair } from "@seed-design/react";
import { IconCheckFill } from "@seed-design/react-icon";
import { ActionButton } from "seed-design/ui/action-button";
import {
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogRoot,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "seed-design/ui/alert-dialog";

const AlertDialogWrap = () => {
  return (
    // You can set z-index dialog with "--layer-index" custom property. useful for stackflow integration.
    <AlertDialogRoot>
      <AlertDialogTrigger asChild>
        <ActionButton variant="neutralSolid">열기</ActionButton>
      </AlertDialogTrigger>
      <AlertDialogContent layerIndex={50}>
        <AlertDialogHeader>
          <AlertDialogTitle>Wrapping</AlertDialogTitle>
          <AlertDialogDescription>
            ResponsivePair 컴포넌트를 사용해 버튼 컨텐츠가 길어지는 경우 레이아웃을 세로로 접을 수
            있습니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <ResponsivePair gap="x2">
            <AlertDialogAction variant="neutralWeak">취소</AlertDialogAction>
            <AlertDialogAction variant="neutralSolid">
              <PrefixIcon svg={<IconCheckFill />} />긴 레이블 예시
            </AlertDialogAction>
          </ResponsivePair>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogRoot>
  );
};

export default AlertDialogWrap;
