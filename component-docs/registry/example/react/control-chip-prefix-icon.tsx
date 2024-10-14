import IconAddFill from "@seed-design/icon/IconAddFill";
import { ControlChip } from "seed-design/ui/control-chip";

export default function ControlChipPrefixIcon() {
  return <ControlChip.Toggle prefixIcon={<IconAddFill />}>라벨</ControlChip.Toggle>;
}