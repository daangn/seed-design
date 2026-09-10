import "./styles";
import "./preview.css";

import { MannerTemp, MannerTempEmote, useSeedClassName, VStack } from "@seed-design/lynx-react";

const mannerTemps = [
  ["l1", "12.5°C"],
  ["l2", "30°C"],
  ["l3", "36°C"],
  ["l4", "36.5°C"],
  ["l5", "37°C"],
  ["l6", "40°C"],
  ["l7", "45°C"],
  ["l8", "55°C"],
  ["l9", "65°C"],
  ["l10", "80°C"],
] as const;

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
            {mannerTemps.map(([level, label]) => (
              <MannerTemp key={level} level={level}>
                {label}
                <MannerTempEmote />
              </MannerTemp>
            ))}
          </VStack>
        </view>
      </VStack>
    </view>
  );
}
