import { IconPlusFill } from "@karrotmarket/react-monochrome-icon";
import { Icon } from "@seed-design/react";
import { ContextualFloatingButton } from "seed-design/ui/contextual-floating-button";

export default function ContextualFloatingButtonIconOnly() {
  return (
    <ContextualFloatingButton layout="iconOnly" aria-label="추가">
      <Icon svg={<IconPlusFill />} />
    </ContextualFloatingButton>
  );
}
