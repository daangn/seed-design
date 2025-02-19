import { IconPlusFill } from "@daangn/react-monochrome-icon";
import { ActionChip, Icon } from "@seed-design/react";

export default function ActionChipIconOnly() {
  return (
    <ActionChip layout="iconOnly">
      <Icon svg={<IconPlusFill />} />
    </ActionChip>
  );
}
