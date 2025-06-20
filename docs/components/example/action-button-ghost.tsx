import { HStack, Text, VStack } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";

export default function ActionButtonGhost() {
  return (
    <HStack gap="x2">
      <ActionButton bleedX="asPadding" bleedY="asPadding" variant="ghost">
        Default
      </ActionButton>
      <ActionButton bleedX="asPadding" bleedY="asPadding" variant="ghost" color="fg.neutralSubtle">
        Neutral Subtle
      </ActionButton>
      <ActionButton bleedX="asPadding" bleedY="asPadding" variant="ghost" color="fg.brand">
        Brand
      </ActionButton>
    </HStack>
  );
}
