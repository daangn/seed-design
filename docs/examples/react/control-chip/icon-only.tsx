import { IconPlusFill } from "@karrotmarket/react-monochrome-icon";
import { Icon } from "@seed-design/react";
import { ControlChip } from "seed-design/ui/control-chip";

export default function ControlChipIconOnly() {
  return (
    <ControlChip.Toggle layout="iconOnly" inputProps={{ "aria-label": "추가" }}>
      <Icon svg={<IconPlusFill />} />
    </ControlChip.Toggle>
  );
}
