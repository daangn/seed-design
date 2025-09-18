import { IconPlusFill } from "@karrotmarket/react-monochrome-icon";
import { Icon } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";

export default function ActionButtonIconOnly() {
  return (
    <ActionButton layout="iconOnly">
      <Icon svg={<IconPlusFill />} />
    </ActionButton>
  );
}
