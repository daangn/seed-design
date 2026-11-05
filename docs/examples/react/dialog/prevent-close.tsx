import { HStack } from "@seed-design/react";
import { useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  DialogAction,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogRoot,
  DialogTrigger,
} from "seed-design/ui/dialog";
import { Switch } from "seed-design/ui/switch";

const DialogPreventClose = () => {
  const [preventClose, setPreventClose] = useState(true);

  return (
    <DialogRoot>
      <DialogTrigger asChild>
        <ActionButton variant="neutralSolid">열기</ActionButton>
      </DialogTrigger>
      <DialogContent
        title="닫기 방지"
        description="확인 버튼을 눌러도 Dialog가 닫히지 않도록 설정할 수 있습니다."
      >
        <DialogBody alignItems="flex-start">
          <Switch
            size="16"
            tone="neutral"
            label="preventDefault 사용"
            checked={preventClose}
            onCheckedChange={setPreventClose}
          />
        </DialogBody>
        <DialogFooter>
          <HStack gap="x2" justify="flex-end">
            <DialogAction variant="neutralWeak">취소</DialogAction>
            <DialogAction
              variant="neutralSolid"
              onClick={(e) => {
                if (preventClose) {
                  e.preventDefault();
                }
              }}
            >
              확인
            </DialogAction>
          </HStack>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default DialogPreventClose;
