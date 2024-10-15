"use client";

import IconAddFill from "@seed-design/icon/IconAddFill";
import { ControlChip } from "seed-design/ui/control-chip";

export default function ControlChipIconOnly() {
  return (
    <ControlChip.Toggle layout="iconOnly">
      <IconAddFill />
    </ControlChip.Toggle>
  );
}
