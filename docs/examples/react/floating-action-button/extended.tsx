import { FloatingActionButton } from "@/registry/ui/floating-action-button";
import IconPlusLine from "@karrotmarket/react-monochrome-icon/IconPlusLine";
import { HStack } from "@seed-design/react";

export default function FloatingActionButtonExtended() {
  return (
    <HStack gap="x2">
      <FloatingActionButton icon={<IconPlusLine />} label="Extended" extended={true} />
      <FloatingActionButton icon={<IconPlusLine />} label="Extended" extended={false} />
    </HStack>
  );
}
