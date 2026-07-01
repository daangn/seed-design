import { ActionButton } from "seed-design/ui/action-button";
import { PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from "seed-design/ui/popover";

const PopoverPlacement = () => {
  return (
    <PopoverRoot placement="right-start">
      <PopoverTrigger asChild>
        <ActionButton variant="neutralSolid">right-start</ActionButton>
      </PopoverTrigger>
      <PopoverContent title="Placement">
        <PopoverBody>
          placement prop으로 트리거 기준 위치를 지정합니다. 뷰포트를 벗어나면 자동으로 뒤집히거나
          이동합니다.
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
};

export default PopoverPlacement;
