import { IconChevronDownFill } from "@karrotmarket/react-monochrome-icon";
import { SuffixIcon } from "@seed-design/react";
import { ControlChip } from "@/registry/ui/control-chip";

export default function ControlChipSuffixIcon() {
  return (
    <ControlChip.Toggle>
      라벨
      <SuffixIcon svg={<IconChevronDownFill />} />
    </ControlChip.Toggle>
  );
}
