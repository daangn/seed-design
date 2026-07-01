import { useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import { PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from "seed-design/ui/popover";

const PopoverControlled = () => {
  const [open, setOpen] = useState(false);

  return (
    <PopoverRoot open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <ActionButton variant="neutralSolid">{open ? "닫기" : "열기"}</ActionButton>
      </PopoverTrigger>
      <PopoverContent title="제어 상태">
        <PopoverBody>open prop으로 Popover의 열림 상태를 직접 제어합니다.</PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
};

export default PopoverControlled;
