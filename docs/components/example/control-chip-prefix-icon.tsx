"use client";

import { IconPlusFill } from "@daangn/react-icon";
import { ControlChip } from "seed-design/ui/control-chip";

export default function ControlChipPrefixIcon() {
  return <ControlChip.Toggle prefixIcon={<IconPlusFill />}>라벨</ControlChip.Toggle>;
}
