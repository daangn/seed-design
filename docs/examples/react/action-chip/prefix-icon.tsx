import { IconPlusFill } from "@karrotmarket/react-monochrome-icon";
import { ActionChip, PrefixIcon } from "@seed-design/react";

export default function ActionChipPrefixIcon() {
  return (
    <ActionChip>
      <PrefixIcon svg={<IconPlusFill />} />
      라벨
    </ActionChip>
  );
}
