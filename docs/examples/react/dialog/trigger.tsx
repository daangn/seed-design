import { DialogBody, DialogContent, DialogRoot, DialogTrigger } from "seed-design/ui/dialog";
import { ActionButton } from "seed-design/ui/action-button";

const DialogTriggerExample = () => {
  return (
    <DialogRoot>
      <DialogTrigger asChild>
        <ActionButton variant="neutralSolid">Open</ActionButton>
      </DialogTrigger>
      <DialogContent title="Trigger 패턴">
        <DialogBody>Trigger를 클릭하면 현재 화면 위에 Dialog가 열립니다.</DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};

export default DialogTriggerExample;
