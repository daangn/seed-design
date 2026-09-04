import "./styles";

import { root, useState } from "@lynx-js/react";
import { Chip, useSeedClassName } from "@seed-design/lynx-react";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [toggleCount, setToggleCount] = useState(0);
  const [toggleLastValue, setToggleLastValue] = useState<boolean | null>(null);
  const [radioCount, setRadioCount] = useState(0);
  const [radioLastValue, setRadioLastValue] = useState<string | null>(null);

  return (
    <page className={seedClassName}>
      <view className="chip-preview">
        <view className="chip-preview__group">
          <Chip.Toggle
            onCheckedChange={(checked) => {
              setToggleCount((previous) => previous + 1);
              setToggleLastValue(checked);
            }}
          >
            <Chip.Label>Toggle Chip</Chip.Label>
          </Chip.Toggle>
          <text className="chip-preview__status">
            onCheckedChange called: {toggleCount} times, last value:{" "}
            {toggleLastValue === null ? "-" : JSON.stringify(toggleLastValue)}
          </text>
        </view>
        <view className="chip-preview__group">
          <Chip.RadioRoot
            defaultValue="option1"
            onValueChange={(value) => {
              setRadioCount((previous) => previous + 1);
              setRadioLastValue(value);
            }}
          >
            <view className="chip-preview__row">
              <Chip.RadioItem value="option1">
                <Chip.Label>Radio 1</Chip.Label>
              </Chip.RadioItem>
              <Chip.RadioItem value="option2">
                <Chip.Label>Radio 2</Chip.Label>
              </Chip.RadioItem>
            </view>
          </Chip.RadioRoot>
          <text className="chip-preview__status">
            onValueChange called: {radioCount} times, last value: {radioLastValue ?? "-"}
          </text>
        </view>
      </view>
    </page>
  );
}

root.render(<Root />);
