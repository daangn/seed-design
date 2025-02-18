import { IconChevronDownFill } from "@daangn/react-monochrome-icon";
import { SuffixIcon } from "@seed-design/react";
import { ActionChip } from "@seed-design/react";

export default function ActionChipSuffixIcon() {
  return (
    <ActionChip>
      라벨
      <SuffixIcon svg={<IconChevronDownFill />} />
    </ActionChip>
  );
}
