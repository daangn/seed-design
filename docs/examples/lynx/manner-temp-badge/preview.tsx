import "./styles";

import { root } from "@lynx-js/react";
import { MannerTempBadge, useSeedClassName, VStack } from "@seed-design/lynx-react";

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

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <VStack
        width="full"
        height="full"
        align="center"
        justify="center"
        gap="x1"
        p="x4"
        bg="bg.layerDefault"
      >
        {mannerTemps.map(([level, label]) => (
          <MannerTempBadge key={level} level={level}>
            {label}
          </MannerTempBadge>
        ))}
      </VStack>
    </page>
  );
}

root.render(<Root />);
