import { IconPlusFill } from "@karrotmarket/react-monochrome-icon";
import { PrefixIcon } from "@seed-design/react";
import { ControlChip } from "@/registry/ui/control-chip";

export default function ControlChipPrefixIcon() {
  return (
    <ControlChip.Toggle>
      <PrefixIcon svg={<IconPlusFill />} />
      라벨
    </ControlChip.Toggle>
  );
}
