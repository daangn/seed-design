import { Box, VStack } from "@seed-design/react";
import { useState } from "react";
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
import { Switch } from "seed-design/ui/switch";

export default function AlertDialogPreventClose() {
  const [preventClose, setPreventClose] = useState(true);

  return (
    <AlertDialogRoot>
      <AlertDialogTrigger asChild>
        <ActionButton variant="neutralSolid">열기</ActionButton>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>닫기 방지</AlertDialogTitle>
          <AlertDialogDescription>
            확인 버튼을 눌러도 다이얼로그가 닫히지 않도록 설정할 수 있습니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter asChild>
          <VStack gap="x4">
            <Box alignSelf="flex-start">
              <Switch
                size="16"
                tone="neutral"
                label="preventDefault 사용"
                checked={preventClose}
                onCheckedChange={setPreventClose}
              />
            </Box>
            <AlertDialogAction
              variant="neutralSolid"
              onClick={(e) => {
                if (preventClose) {
                  e.preventDefault();
                }
              }}
            >
              확인
            </AlertDialogAction>
          </VStack>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogRoot>
  );
}
