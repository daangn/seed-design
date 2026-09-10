import "./styles";

import { Chip, useSeedClassName } from "@seed-design/lynx-react";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-chip-root`}>
      <view className="chip-preview">
        <view className="chip-preview__row">
          <Chip.Button variant="outlineStrong">
            <Chip.Label>Outline Strong Button</Chip.Label>
          </Chip.Button>
          <Chip.Toggle variant="outlineStrong">
            <Chip.Label>Outline Strong Toggle</Chip.Label>
          </Chip.Toggle>
        </view>
        <Chip.RadioRoot defaultValue="option1">
          <view className="chip-preview__row">
            <Chip.RadioItem value="option1" variant="outlineStrong">
              <Chip.Label>Outline Strong Radio 1</Chip.Label>
            </Chip.RadioItem>
            <Chip.RadioItem value="option2" variant="outlineStrong">
              <Chip.Label>Outline Strong Radio 2</Chip.Label>
            </Chip.RadioItem>
          </view>
        </Chip.RadioRoot>
      </view>
    </view>
  );
}
