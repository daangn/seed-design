import { IconPlusFill } from "@karrotmarket/react-monochrome-icon";
import { ActionChip, Icon } from "@ride-developer/react";

export default function ActionChipIconOnly() {
  return (
    <ActionChip layout="iconOnly" aria-label="추가">
      <Icon svg={<IconPlusFill />} />
    </ActionChip>
  );
}
