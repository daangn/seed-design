import "./styles";

import { Chip, useSeedClassName } from "@seed-design/lynx-react";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-chip-root`}>
      <view className="chip-preview">
        <view className="chip-preview__row">
          <Chip.Button size="large">
            <Chip.Label>Large Button</Chip.Label>
          </Chip.Button>
          <Chip.Toggle size="large">
            <Chip.Label>Large Toggle</Chip.Label>
          </Chip.Toggle>
        </view>
        <Chip.RadioRoot defaultValue="option1">
          <view className="chip-preview__row">
            <Chip.RadioItem value="option1" size="large">
              <Chip.Label>Large Radio 1</Chip.Label>
            </Chip.RadioItem>
            <Chip.RadioItem value="option2" size="large">
              <Chip.Label>Large Radio 2</Chip.Label>
            </Chip.RadioItem>
          </view>
        </Chip.RadioRoot>
      </view>
    </view>
  );
}
