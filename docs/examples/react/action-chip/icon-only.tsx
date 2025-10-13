import { IconPlusFill } from "@karrotmarket/react-monochrome-icon";
import { ActionChip, Icon } from "@seed-design/react";

export default function ActionChipIconOnly() {
  return (
    <ActionChip layout="iconOnly" aria-label="추가">
      <Icon svg={<IconPlusFill />} />
    </ActionChip>
  );
}
