import { IconPlusFill } from "@karrotmarket/react-monochrome-icon";
import { Icon } from "@seed-design/react";
import { ControlChip } from "@/registry/ui/control-chip";

export default function ControlChipIconOnly() {
  return (
    <ControlChip.Toggle layout="iconOnly">
      <Icon svg={<IconPlusFill />} />
    </ControlChip.Toggle>
  );
}
