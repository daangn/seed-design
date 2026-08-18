import { root, useState } from "@lynx-js/react";
import IconCheckmarkFatFill from "@karrotmarket/lynx-monochrome-icon/IconCheckmarkFatFill";
import { Checkbox, VStack, useSeedClassName } from "@seed-design/lynx-react";
import "./styles";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [count, setCount] = useState(0);
  const [lastValue, setLastValue] = useState<boolean | null>(null);
  return (
    <page className={seedClassName}>
      <VStack className="checkbox-preview" gap="x4">
        <Checkbox.Root
          tone="neutral"
          size="large"
          onCheckedChange={(checked) => {
            setCount((previous) => previous + 1);
            setLastValue(checked);
          }}
        >
          <Checkbox.Control>
            <Checkbox.Indicator checked={<IconCheckmarkFatFill />} />
          </Checkbox.Control>
          <Checkbox.Label>Click me</Checkbox.Label>
        </Checkbox.Root>
        <text className="checkbox-preview__status">
          onCheckedChange called: {count} times, last value: {`${lastValue ?? "-"}`}
        </text>
      </VStack>
    </page>
  );
}

root.render(<Root />);
