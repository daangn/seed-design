import "./styles";

import { useState } from "@lynx-js/react";
import { VStack, useSeedClassName } from "@seed-design/lynx-react";
import { Switch } from "@/components/ui/switch";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [count, setCount] = useState(0);
  const [lastValue, setLastValue] = useState<boolean | null>(null);
  return (
    <view className={`${seedClassName} docs-lynx-switch-root`}>
      <VStack className="switch-preview" gap="x4">
        <Switch
          label="Click me"
          onCheckedChange={(checked) => {
            setCount((previous) => previous + 1);
            setLastValue(checked);
          }}
        />
        <text className="switch-preview__status">
          onCheckedChange called: {count} times, last value:{" "}
          {lastValue === null ? "-" : JSON.stringify(lastValue)}
        </text>
      </VStack>
    </view>
  );
}
