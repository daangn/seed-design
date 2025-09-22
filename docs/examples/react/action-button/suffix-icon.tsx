import { IconChevronRightFill } from "@karrotmarket/react-monochrome-icon";
import { SuffixIcon } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";

export default function ActionButtonSuffixIcon() {
  return (
    <ActionButton>
      라벨
      <SuffixIcon svg={<IconChevronRightFill />} />
    </ActionButton>
  );
}
