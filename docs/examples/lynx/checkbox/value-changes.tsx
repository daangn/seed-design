import "./styles";

import { useState } from "@lynx-js/react";
import { VStack, useSeedClassName } from "@seed-design/lynx-react";
import { Checkbox } from "@/components/ui/checkbox";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [count, setCount] = useState(0);
  const [lastValue, setLastValue] = useState<boolean | null>(null);

  function handleCheckedChange(checked: boolean) {
    "background only";

    setCount((previous) => previous + 1);
    setLastValue(checked);
  }

  return (
    <view className={`${seedClassName} docs-lynx-checkbox-root`}>
      <VStack className="checkbox-preview" gap="x4">
        <Checkbox
          label="Click me"
          tone="neutral"
          size="large"
          onCheckedChange={handleCheckedChange}
        />
        <text className="checkbox-preview__status">
          onCheckedChange called: {count} times, last value:{" "}
          {lastValue === null ? "-" : JSON.stringify(lastValue)}
        </text>
      </VStack>
    </view>
  );
}
