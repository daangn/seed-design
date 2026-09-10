import "./styles";

import { Chip, useSeedClassName } from "@seed-design/lynx-react";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-chip-root`}>
      <view className="chip-preview">
        <view className="chip-preview__row">
          <Chip.Button>
            <Chip.Label>Button Chip</Chip.Label>
          </Chip.Button>
          <Chip.Toggle>
            <Chip.Label>Toggle Chip</Chip.Label>
          </Chip.Toggle>
        </view>
        <Chip.RadioRoot defaultValue="option1">
          <view className="chip-preview__row">
            <Chip.RadioItem value="option1">
              <Chip.Label>Radio Chip 1</Chip.Label>
            </Chip.RadioItem>
            <Chip.RadioItem value="option2">
              <Chip.Label>Radio Chip 2</Chip.Label>
            </Chip.RadioItem>
          </view>
        </Chip.RadioRoot>
      </view>
    </view>
  );
}
