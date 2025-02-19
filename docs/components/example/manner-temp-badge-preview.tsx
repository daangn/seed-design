import { Stack } from "@seed-design/react";
import { MannerTempBadge } from "seed-design/ui/manner-temp-badge";

export default function BadgePreview() {
  return (
    <Stack gap="x1">
      <MannerTempBadge temperature={12.5} />
      <MannerTempBadge temperature={36.2} />
      <MannerTempBadge temperature={36.5} />
      <MannerTempBadge temperature={41.9} />
      <MannerTempBadge temperature={51.9} />
      <MannerTempBadge temperature={52} />
    </Stack>
  );
}
