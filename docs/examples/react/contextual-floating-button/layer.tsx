import { IconPlusLine } from "@karrotmarket/react-monochrome-icon";
import { PrefixIcon } from "@seed-design/react";
import { ContextualFloatingButton } from "seed-design/ui/contextual-floating-button";

export default function ContextualFloatingButtonLayer() {
  return (
    <ContextualFloatingButton variant="layer">
      <PrefixIcon svg={<IconPlusLine />} />
      Layer Variant
    </ContextualFloatingButton>
  );
}
