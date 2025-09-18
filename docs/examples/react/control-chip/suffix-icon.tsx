import { IconChevronDownFill } from "@karrotmarket/react-monochrome-icon";
import { SuffixIcon } from "@seed-design/react";
import { ControlChip } from "seed-design/ui/control-chip";

export default function ControlChipSuffixIcon() {
  return (
    <ControlChip.Toggle>
      라벨
      <SuffixIcon svg={<IconChevronDownFill />} />
    </ControlChip.Toggle>
  );
}
