import { IconPlusFill } from "@daangn/react-monochrome-icon";
import { PrefixIcon } from "@seed-design/react";
import { ActionChip } from "@seed-design/react";

export default function ActionChipPrefixIcon() {
  return (
    <ActionChip>
      <PrefixIcon svg={<IconPlusFill />} />
      라벨
    </ActionChip>
  );
}
