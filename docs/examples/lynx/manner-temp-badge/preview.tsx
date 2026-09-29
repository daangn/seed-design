import "./styles";

import { useSeedClassName, VStack } from "@seed-design/lynx-react";
import { MannerTempBadge } from "@/components/ui/manner-temp-badge";

const temperatures = [12.5, 30, 36, 36.5, 37, 40, 45, 55, 65, 80];

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-manner-temp-badge-root`}>
      <VStack
        width="full"
        height="full"
        align="center"
        justify="center"
        p="x4"
        bg="bg.layerDefault"
      >
        <VStack align="flex-start" gap="x1">
          {temperatures.map((temperature) => (
            <MannerTempBadge key={temperature} temperature={temperature} />
          ))}
        </VStack>
      </VStack>
    </view>
  );
}
