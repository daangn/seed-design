import "./styles";
import IconCheckmarkFill from "@karrotmarket/lynx-monochrome-icon/IconCheckmarkFill";

import { ActionButton, PrefixIcon, useSeedClassName } from "@seed-design/lynx-react";

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
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Wrapping</AlertDialogTitle>
              <AlertDialogDescription>
                Lynx에서는 긴 버튼 레이블을 위해 action을 세로로 배치할 수 있습니다.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <view
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "stretch",
                  width: "100%",
                  gap: "8px",
                }}
              >
                <AlertDialogAction variant="neutralWeak" style={{ width: "100%" }}>
                  취소
                </AlertDialogAction>
                <AlertDialogAction variant="neutralSolid" style={{ width: "100%" }}>
                  <PrefixIcon icon={<IconCheckmarkFill />} />긴 레이블 예시
                </AlertDialogAction>
              </view>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogRoot>
      </view>
    </view>
  );
}
