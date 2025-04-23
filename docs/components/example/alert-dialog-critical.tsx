import { HStack } from "@seed-design/react";
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

const AlertDialogCritical = () => {
  return (
    // You can set z-index dialog with "--layer-index" custom property. useful for stackflow integration.
    <AlertDialogRoot>
      <AlertDialogTrigger asChild>
        <ActionButton>열기</ActionButton>
      </AlertDialogTrigger>
      <AlertDialogContent layerIndex={50}>
        <AlertDialogHeader>
          <AlertDialogTitle>제목</AlertDialogTitle>
          <AlertDialogDescription>파괴적, 비가역적 작업을 경고합니다.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <HStack gap="x2">
            <AlertDialogAction asChild>
              <ActionButton variant="neutralSolid" flexGrow={1}>
                취소
              </ActionButton>
            </AlertDialogAction>
            <AlertDialogAction asChild>
              <ActionButton variant="criticalSolid" flexGrow={1}>
                확인
              </ActionButton>
            </AlertDialogAction>
          </HStack>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogRoot>
  );
};

export default AlertDialogCritical;
