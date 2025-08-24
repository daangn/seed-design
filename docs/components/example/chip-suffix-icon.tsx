import { Chip } from "@/registry/ui/chip";
import { IconChevronDownLine } from "@karrotmarket/react-monochrome-icon";
import { Icon } from "@seed-design/react";

export default function ChipSuffixIcon() {
  return (
    <div className="flex items-center gap-2">
      <Chip.Button>
        <Chip.Label>Button with Suffix</Chip.Label>
        <Chip.SuffixIcon>
          <Icon svg={<IconChevronDownLine />} />
        </Chip.SuffixIcon>
      </Chip.Button>
      <Chip.Toggle>
        <Chip.Label>Toggle with Suffix</Chip.Label>
        <Chip.SuffixIcon>
          <Icon svg={<IconChevronDownLine />} />
        </Chip.SuffixIcon>
      </Chip.Toggle>
    </div>
  );
}
