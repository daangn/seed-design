"use client";

import { IconPlusFill } from "@daangn/react-icon";
import { ControlChip } from "seed-design/ui/control-chip";

export default function ControlChipIconOnly() {
  return (
    <ControlChip.Toggle layout="iconOnly">
      <IconPlusFill />
    </ControlChip.Toggle>
  );
}
