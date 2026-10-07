import { VStack } from "@seed-design/lynx-react";
import { MannerTempBadge } from "@/components/ui/manner-temp-badge";

const temperatures = [12.5, 30, 36, 36.5, 37, 40, 45, 55, 65, 80];

export default function Example() {
  return (
    <VStack align="center" gap="x1">
      {temperatures.map((temperature) => (
        <MannerTempBadge key={temperature} temperature={temperature} />
      ))}
    </VStack>
  );
}
