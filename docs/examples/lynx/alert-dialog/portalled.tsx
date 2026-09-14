import "./styles";

import { ActionButton, useSeedClassName } from "@seed-design/lynx-react";
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
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-alert-dialog-root`}>
      <view className="alert-dialog-example-stage">
        <AlertDialogRoot>
          <AlertDialogTrigger>
            <ActionButton variant="neutralSolid">열기</ActionButton>
          </AlertDialogTrigger>
          <AlertDialogContent container="window" overlayLevel={2}>
            <AlertDialogHeader>
              <AlertDialogTitle>window overlay</AlertDialogTitle>
              <AlertDialogDescription>
                Lynx에서는 container와 overlayLevel로 네이티브 overlay 위치를 지정합니다.
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
      </view>
    </view>
  );
}
