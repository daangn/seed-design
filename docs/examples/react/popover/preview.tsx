import { ActionButton } from "seed-design/ui/action-button";
import {
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverRoot,
  PopoverTrigger,
} from "seed-design/ui/popover";

const PopoverPreview = () => {
  return (
    <PopoverRoot>
      <PopoverTrigger asChild>
        <ActionButton variant="neutralSolid">Open Popover</ActionButton>
      </PopoverTrigger>
      <PopoverContent title="제목" description="설명을 작성할 수 있어요">
        <PopoverBody>
          Popover 본문에는 사용자가 확인해야 할 내용이나 추가 액션을 배치할 수 있습니다.
        </PopoverBody>
        <PopoverFooter>
          <ActionButton variant="neutralSolid">확인</ActionButton>
        </PopoverFooter>
      </PopoverContent>
    </PopoverRoot>
  );
};

export default PopoverPreview;
