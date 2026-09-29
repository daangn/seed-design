import "./styles";
import "./preview.css";

import { useSeedClassName, VStack } from "@seed-design/lynx-react";
import { MannerTemp } from "@/components/ui/manner-temp";

const temperatures = [12.5, 30, 36, 36.5, 37, 40, 45, 55, 65, 80];

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-manner-temp-root`}>
      <VStack
        width="full"
        height="full"
        align="center"
        justify="center"
        p="x4"
        bg="bg.layerDefault"
      >
        <view className="manner-temp-preview__frame">
          <VStack gap="x1" align="flex-end">
            {temperatures.map((temperature) => (
              <MannerTemp key={temperature} temperature={temperature} />
            ))}
          </VStack>
        </view>
      </VStack>
    </view>
  );
}
