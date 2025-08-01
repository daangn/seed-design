import { Chip } from "@/registry/ui/chip";
import { IconHeartFill } from "@karrotmarket/react-monochrome-icon";
import { Icon } from "@seed-design/react";

export default function ChipPrefixIcon() {
  return (
    <div className="flex items-center gap-2">
      <Chip.Button>
        <Chip.PrefixIcon>
          <Icon svg={<IconHeartFill />} />
        </Chip.PrefixIcon>
        <Chip.Label>With Icon Button</Chip.Label>
      </Chip.Button>
      <Chip.Toggle>
        <Chip.PrefixIcon>
          <Icon svg={<IconHeartFill />} />
        </Chip.PrefixIcon>
        <Chip.Label>With Icon Toggle</Chip.Label>
      </Chip.Toggle>
    </div>
  );
}
