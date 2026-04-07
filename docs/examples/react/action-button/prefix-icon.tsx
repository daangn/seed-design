import { IconPlusFill } from "@karrotmarket/react-monochrome-icon";
import { PrefixIcon } from "@ride-developer/react";
import { ActionButton } from "seed-design/ui/action-button";

export default function ActionButtonPrefixIcon() {
  return (
    <ActionButton>
      <PrefixIcon svg={<IconPlusFill />} />
      라벨
    </ActionButton>
  );
}
