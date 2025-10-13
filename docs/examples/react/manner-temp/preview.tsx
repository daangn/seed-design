import { VStack } from "@seed-design/react";
import { MannerTemp } from "seed-design/ui/manner-temp";

export default function MannerTempPreview() {
  return (
    <VStack gap="x1" align="flex-end">
      <MannerTemp temperature={12.5} />
      <MannerTemp temperature={30} />
      <MannerTemp temperature={36} />
      <MannerTemp temperature={36.5} />
      <MannerTemp temperature={37} />
      <MannerTemp temperature={40} />
      <MannerTemp temperature={45} />
      <MannerTemp temperature={55} />
      <MannerTemp temperature={65} />
      <MannerTemp temperature={80} />
    </VStack>
  );
}
