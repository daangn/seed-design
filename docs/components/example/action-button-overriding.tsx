import { ActionButton } from "seed-design/ui/action-button";
import { vars } from "@seed-design/css/vars";
import { HStack } from "@seed-design/react";

export default function ActionButtonOverriding() {
  return (
    <HStack gap="x3">
      <ActionButton
        overrides={{
          "--seed-action-button-enabled-background": vars.$color.bg.informativeSolid,
          "--seed-action-button-active-background": vars.$color.bg.informativeSolidPressed,
        }}
      >
        라벨
      </ActionButton>
      <ActionButton
        overrides={{
          "--seed-action-button-enabled-background": `linear-gradient(135deg, ${vars.$color.palette.purple400} 0%, ${vars.$color.palette.purple800} 100%)`,
          "--seed-action-button-active-background": `linear-gradient(135deg, ${vars.$color.palette.purple500} 0%, ${vars.$color.palette.purple900} 100%)`,
        }}
      >
        라벨
      </ActionButton>
    </HStack>
  );
}
