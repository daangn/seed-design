import IconPlusLine from "@karrotmarket/lynx-monochrome-icon/IconPlusLine";
import { useState } from "@lynx-js/react";

import { SeedProvider, VStack } from "@seed-design/lynx-react";
import { FloatingActionButton } from "@/components/ui/floating-action-button";
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

  return (
    <SeedProvider supportsLiquidGlass={supportsLiquidGlass}>
      <VStack align="center" gap="x6">
        <FloatingActionButton
          icon={<IconPlusLine />}
          label="Glass"
          glassEffect={{ style: clear ? "clear" : "regular", interactive }}
        />
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
