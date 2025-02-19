import { IconPlusFill } from "@daangn/react-monochrome-icon";
import { Icon } from "@seed-design/react";
import { ControlChip } from "seed-design/ui/control-chip";

export default function ControlChipIconOnly() {
  return (
    <ControlChip.Toggle layout="iconOnly">
      <Icon svg={<IconPlusFill />} />
    </ControlChip.Toggle>
  );
}
