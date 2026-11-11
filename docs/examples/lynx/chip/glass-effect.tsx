import "./styles";

import { useState } from "@lynx-js/react";
import { Chip, SeedProvider, VStack } from "@seed-design/lynx-react";
import { Switch } from "@/components/ui/switch";

// 이 예제만 호스트 지원 여부를 직접 판단합니다. 앱에서는 root `SeedProvider`에 호스트가 준 값을 넘기세요.
const supportsLiquidGlass =
  typeof SystemInfo !== "undefined" &&
  SystemInfo.platform === "iOS" &&
  Number.parseInt(SystemInfo.osVersion, 10) >= 26;

export default function Example() {
  const [clear, setClear] = useState(false);
  const [interactive, setInteractive] = useState(true);

  function handleClearChange(checked: boolean) {
    "background only";
    setClear(checked);
  }

  function handleInteractiveChange(checked: boolean) {
    "background only";
    setInteractive(checked);
  }

  const glassEffect = { style: clear ? "clear" : "regular", interactive } as const;

  return (
    <SeedProvider supportsLiquidGlass={supportsLiquidGlass}>
      <VStack align="center" gap="x6">
        <view className="chip-preview__row">
          <Chip.Toggle glassEffect={glassEffect} defaultChecked>
            <Chip.Label>Toggle 1</Chip.Label>
          </Chip.Toggle>
          <Chip.Toggle glassEffect={glassEffect}>
            <Chip.Label>Toggle 2</Chip.Label>
          </Chip.Toggle>
          <Chip.Button glassEffect={glassEffect}>
            <Chip.Label>Button</Chip.Label>
          </Chip.Button>
        </view>
        <VStack gap="x3">
          <Switch
            size="16"
            tone="neutral"
            label="Clear style"
            checked={clear}
            onCheckedChange={handleClearChange}
          />
          <Switch
            size="16"
            tone="neutral"
            label="Interactive"
            checked={interactive}
            onCheckedChange={handleInteractiveChange}
          />
        </VStack>
      </VStack>
    </SeedProvider>
  );
}
