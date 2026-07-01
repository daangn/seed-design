import { ActionButton } from "seed-design/ui/action-button";
import { DialogBody, DialogContent, DialogRoot, DialogTrigger } from "seed-design/ui/dialog";

const DialogSkipAnimation = () => {
  return (
    <DialogRoot skipAnimation>
      <DialogTrigger asChild>
        <ActionButton variant="neutralSolid">애니메이션 없이 열기</ActionButton>
      </DialogTrigger>
      <DialogContent title="Skip Animation">
        <DialogBody>enter/exit 애니메이션 없이 즉시 나타나고 사라집니다.</DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};

export default DialogSkipAnimation;
