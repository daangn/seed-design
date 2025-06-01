import { IconBellFill } from "@karrotmarket/react-monochrome-icon";
import { PrefixIcon } from "@seed-design/react";
import { ContextualFloatingButton } from "seed-design/ui/contextual-floating-button";

export default function ContextualFloatingButtonPreview() {
  return (
    <ContextualFloatingButton>
      <PrefixIcon svg={<IconBellFill />} />
      알림 설정
    </ContextualFloatingButton>
  );
}
