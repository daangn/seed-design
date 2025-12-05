import { VStack } from "@seed-design/react";
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

const AlertDialogNonpreferred = () => {
  return (
    // You can set z-index dialog with "--layer-index" custom property. useful for stackflow integration.
    <AlertDialogRoot>
      <AlertDialogTrigger asChild>
        <ActionButton variant="neutralSolid">열기</ActionButton>
      </AlertDialogTrigger>
      <AlertDialogContent layerIndex={50}>
        <AlertDialogHeader>
          <AlertDialogTitle>제목</AlertDialogTitle>
          <AlertDialogDescription>중립적인 선택지를 제공합니다.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <VStack gap="x4" alignSelf="stretch">
            <AlertDialogAction size="medium" variant="neutralSolid" layout="withText">
              라벨
            </AlertDialogAction>
            <AlertDialogAction
              size="medium"
              variant="ghost"
              layout="withText"
              color="fg.neutralMuted"
              fontWeight="bold"
              bleedY="asPadding"
            >
              라벨
            </AlertDialogAction>
          </VStack>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogRoot>
  );
};

export default AlertDialogNonpreferred;
