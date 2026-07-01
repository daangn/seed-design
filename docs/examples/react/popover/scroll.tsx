import { ActionButton } from "seed-design/ui/action-button";
import {
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverRoot,
  PopoverTrigger,
} from "seed-design/ui/popover";

const PopoverScroll = () => {
  return (
    <PopoverRoot>
      <PopoverTrigger asChild>
        <ActionButton variant="neutralSolid">긴 콘텐츠 Popover</ActionButton>
      </PopoverTrigger>
      <PopoverContent title="약관 동의" description="아래 내용을 확인해주세요">
        <PopoverBody>
          {Array.from({ length: 20 }, (_, index) => (
            <p key={index} style={{ margin: 0 }}>
              {index + 1}. 본문이 길어지면 Body가 스크롤되고, 스크롤 시 상단 divider와 하단 scroll
              fog가 나타납니다.
            </p>
          ))}
        </PopoverBody>
        <PopoverFooter>
          <ActionButton variant="neutralSolid">동의</ActionButton>
        </PopoverFooter>
      </PopoverContent>
    </PopoverRoot>
  );
};

export default PopoverScroll;
