import { IconPlusLine } from "@karrotmarket/react-monochrome-icon";
import { PrefixIcon } from "@seed-design/react";
import { ContextualFloatingButton } from "@/registry/ui/contextual-floating-button";

export default function ContextualFloatingButtonSolid() {
  return (
    <ContextualFloatingButton variant="solid">
      <PrefixIcon svg={<IconPlusLine />} />
      Solid Variant
    </ContextualFloatingButton>
  );
}
