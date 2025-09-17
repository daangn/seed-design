import { VStack } from "@seed-design/react";
import { MannerTempBadge } from "@/registry/ui/manner-temp-badge";

export default function BadgePreview() {
  return (
    <VStack gap="x1">
      <MannerTempBadge temperature={12.5} />
      <MannerTempBadge temperature={36.2} />
      <MannerTempBadge temperature={36.5} />
      <MannerTempBadge temperature={41.9} />
      <MannerTempBadge temperature={51.9} />
      <MannerTempBadge temperature={52} />
    </VStack>
  );
}
