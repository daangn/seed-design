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
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>제목</AlertDialogTitle>
              <AlertDialogDescription>중립적인 선택지를 제공합니다.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <view
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  alignSelf: "stretch",
                }}
              >
                <AlertDialogAction size="medium" variant="neutralSolid" layout="withText">
                  라벨
                </AlertDialogAction>
                <view style={{ marginTop: "-10px", marginBottom: "-10px" }}>
                  <AlertDialogAction size="medium" variant="ghost" layout="withText">
                    라벨
                  </AlertDialogAction>
                </view>
              </view>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogRoot>
      </view>
    </view>
  );
}
