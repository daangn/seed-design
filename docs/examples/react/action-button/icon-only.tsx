import { IconPlusFill } from "@karrotmarket/react-monochrome-icon";
import { Icon } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";

export default function ActionButtonIconOnly() {
  return (
    <ActionButton layout="iconOnly" aria-label="추가">
      <Icon svg={<IconPlusFill />} />
    </ActionButton>
  );
}
