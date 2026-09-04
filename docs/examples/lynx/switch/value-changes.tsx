import "./styles";

import { root, useState } from "@lynx-js/react";
import { VStack, useSeedClassName } from "@seed-design/lynx-react";
import { Switch } from "@/components/ui/switch";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [count, setCount] = useState(0);
  const [lastValue, setLastValue] = useState<boolean | null>(null);
  return (
    <page className={seedClassName}>
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
    </page>
  );
}

root.render(<Root />);
