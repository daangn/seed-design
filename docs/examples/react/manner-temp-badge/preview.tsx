import { VStack } from "@seed-design/react";
import { MannerTempBadge } from "seed-design/ui/manner-temp-badge";

export default function BadgePreview() {
  return (
    <VStack gap="x1" align="flex-start">
      <MannerTempBadge temperature={12.5} />
      <MannerTempBadge temperature={30} />
      <MannerTempBadge temperature={36} />
      <MannerTempBadge temperature={36.5} />
      <MannerTempBadge temperature={37} />
      <MannerTempBadge temperature={40} />
      <MannerTempBadge temperature={45} />
      <MannerTempBadge temperature={55} />
      <MannerTempBadge temperature={65} />
      <MannerTempBadge temperature={80} />
    </VStack>
  );
}
