import { useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import { PopoverAnchor, PopoverBody, PopoverContent, PopoverRoot } from "seed-design/ui/popover";

const PopoverAnchorExample = () => {
  const [open, setOpen] = useState(false);

  return (
    <PopoverRoot open={open} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <div
          style={{
            padding: 16,
            borderRadius: 8,
            border: "1px dashed var(--seed-color-stroke-neutral-muted)",
          }}
        >
          이 영역을 기준으로 배치됩니다
        </div>
      </PopoverAnchor>
      <ActionButton variant="neutralSolid" onClick={() => setOpen((prev) => !prev)}>
        {open ? "닫기" : "열기"}
      </ActionButton>
      <PopoverContent title="Anchor">
        <PopoverBody>
          트리거와 분리된 요소를 기준으로 Popover의 위치를 잡을 수 있습니다.
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
};

export default PopoverAnchorExample;
