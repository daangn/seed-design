import { ActionButton } from "seed-design/ui/action-button";
import { PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from "seed-design/ui/popover";

const PopoverTriggerExample = () => {
  return (
    <PopoverRoot>
      <PopoverTrigger asChild>
        <ActionButton variant="neutralSolid">Trigger</ActionButton>
      </PopoverTrigger>
      <PopoverContent title="제목">
        <PopoverBody>트리거를 눌러 Popover를 열 수 있습니다.</PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
};

export default PopoverTriggerExample;
