import { Stack } from "@seed-design/react";
import { MannerTemp } from "seed-design/ui/manner-temp";

export default function MannerTempPreview() {
  return (
    <Stack gap="x1">
      <MannerTemp temperature={12.5} />
      <MannerTemp temperature={36.2} />
      <MannerTemp temperature={36.5} />
      <MannerTemp temperature={41.9} />
      <MannerTemp temperature={51.9} />
      <MannerTemp temperature={52} />
    </Stack>
  );
}
