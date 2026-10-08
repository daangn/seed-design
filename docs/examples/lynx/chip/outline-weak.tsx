import "./styles";

import { Chip } from "@seed-design/lynx-react";

export default function Example() {
  return (
    <view className="chip-preview">
      <view className="chip-preview__row">
        <Chip.Button variant="outlineWeak">
          <Chip.Label>Outline Weak Button</Chip.Label>
        </Chip.Button>
        <Chip.Toggle variant="outlineWeak">
          <Chip.Label>Outline Weak Toggle</Chip.Label>
        </Chip.Toggle>
      </view>
      <Chip.RadioRoot defaultValue="option1">
        <view className="chip-preview__row">
          <Chip.RadioItem value="option1" variant="outlineWeak">
            <Chip.Label>Outline Weak Radio 1</Chip.Label>
          </Chip.RadioItem>
          <Chip.RadioItem value="option2" variant="outlineWeak">
            <Chip.Label>Outline Weak Radio 2</Chip.Label>
          </Chip.RadioItem>
        </view>
      </Chip.RadioRoot>
    </view>
  );
}
