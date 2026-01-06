import { HStack, PrefixIcon, VStack } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";
import { IconTagLine } from "@karrotmarket/react-monochrome-icon";

export default function ActionButtonGhost() {
  return (
    <VStack gap="spacingY.componentDefault" align="center">
      <HStack gap="x2">
        <ActionButton variant="ghost">
          <PrefixIcon svg={<IconTagLine />} />
          Default (fg.neutral)
        </ActionButton>
        <ActionButton variant="ghost" color="fg.neutralSubtle">
          <PrefixIcon svg={<IconTagLine />} />
          Neutral Subtle
        </ActionButton>
        <ActionButton variant="ghost" color="fg.brand">
          <PrefixIcon svg={<IconTagLine />} />
          Brand
        </ActionButton>
      </HStack>
      <HStack gap="x2">
        <ActionButton variant="ghost">Default (Bold)</ActionButton>
        <ActionButton variant="ghost" fontWeight="medium">
          Medium
        </ActionButton>
        <ActionButton variant="ghost" fontWeight="regular">
          Regular
        </ActionButton>
      </HStack>
    </VStack>
  );
}
