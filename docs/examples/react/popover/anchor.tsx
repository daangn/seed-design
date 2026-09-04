import { HStack } from "@seed-design/react";
import { useState } from "react";
import { Avatar } from "seed-design/ui/avatar";
import { IdentityPlaceholder } from "seed-design/ui/identity-placeholder";
import { PopoverAnchor, PopoverBody, PopoverContent, PopoverRoot } from "seed-design/ui/popover";
import { Switch } from "seed-design/ui/switch";

const PopoverAnchorExample = () => {
  const [open, setOpen] = useState(false);

  return (
    <HStack align="center" justify="space-between" width="full">
      <Switch tone="neutral" label="Popover" checked={open} onCheckedChange={setOpen} />
      <PopoverRoot
        open={open}
        onOpenChange={(nextOpen, details) => {
          if (!nextOpen && details?.reason === "interactOutside") return;
          setOpen(nextOpen);
        }}
      >
        <PopoverAnchor asChild>
          <Avatar
            size="80"
            src="https://avatars.githubusercontent.com/u/54893898?v=4"
            fallback={<IdentityPlaceholder />}
          />
        </PopoverAnchor>
        <PopoverContent title="Anchor">
          <PopoverBody>
            트리거와 분리된 요소를 기준으로 Popover의 위치를 잡을 수 있습니다.
          </PopoverBody>
        </PopoverContent>
      </PopoverRoot>
    </HStack>
  );
};

export default PopoverAnchorExample;
