import {
  DialogAction,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogRoot,
  DialogTrigger,
} from "seed-design/ui/dialog";
import { ActionButton } from "seed-design/ui/action-button";

const DialogPreview = () => {
  return (
    <DialogRoot>
      <DialogTrigger asChild>
        <ActionButton variant="neutralSolid">Open Dialog</ActionButton>
      </DialogTrigger>
      <DialogContent title="제목" description="설명을 작성할 수 있어요">
        <DialogBody>
          본문에는 사용자가 확인해야 할 내용이나 추가 입력 폼을 배치할 수 있습니다.
        </DialogBody>
        <DialogFooter>
          <DialogAction variant="neutralSolid">확인</DialogAction>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default DialogPreview;
