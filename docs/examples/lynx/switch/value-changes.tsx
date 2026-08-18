import { root, useState } from "@lynx-js/react";
import { Switch, VStack, useSeedClassName } from "@seed-design/lynx-react";
import "./styles";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [count, setCount] = useState(0);
  const [lastValue, setLastValue] = useState<boolean | null>(null);
  return (
    <page className={seedClassName}>
      <VStack className="switch-preview" gap="x4">
        <Switch.Root
          onCheckedChange={(checked) => {
            setCount((previous) => previous + 1);
            setLastValue(checked);
          }}
        >
          <Switch.Control>
            <Switch.Thumb />
          </Switch.Control>
          <Switch.Label>Click me</Switch.Label>
        </Switch.Root>
        <text className="switch-preview__status">
          onCheckedChange called: {count} times, last value: {`${lastValue ?? "-"}`}
        </text>
      </VStack>
    </page>
  );
}

root.render(<Root />);
