import { VStack } from "@seed-design/lynx-react";
import { MannerTemp } from "@/components/ui/manner-temp";

const temperatures = [12.5, 30, 36, 36.5, 37, 40, 45, 55, 65, 80];

export default function Example() {
  return (
    <VStack gap="x1" align="center">
      {temperatures.map((temperature) => (
        <MannerTemp key={temperature} temperature={temperature} />
      ))}
    </VStack>
  );
}
