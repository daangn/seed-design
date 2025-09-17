import { IconPlusFill } from "@karrotmarket/react-monochrome-icon";
import { PrefixIcon } from "@seed-design/react";
import { ActionButton } from "@/registry/ui/action-button";

export default function ActionButtonPrefixIcon() {
  return (
    <ActionButton>
      <PrefixIcon svg={<IconPlusFill />} />
      라벨
    </ActionButton>
  );
}
