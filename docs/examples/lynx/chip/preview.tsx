import "./styles";

import { root } from "@lynx-js/react";
import { Chip, useSeedClassName } from "@seed-design/lynx-react";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <view className="chip-preview">
        <view className="chip-preview__row">
          <Chip.Button>
            <Chip.Label>Button Chip</Chip.Label>
          </Chip.Button>
          <Chip.Toggle defaultChecked>
            <Chip.Label>Toggle Chip</Chip.Label>
          </Chip.Toggle>
        </view>
        <Chip.RadioRoot defaultValue="first">
          <view className="chip-preview__row">
            <Chip.RadioItem value="first" variant="outlineStrong">
              <Chip.Label>Radio 1</Chip.Label>
            </Chip.RadioItem>
            <Chip.RadioItem value="second" variant="outlineStrong">
              <Chip.Label>Radio 2</Chip.Label>
            </Chip.RadioItem>
          </view>
        </Chip.RadioRoot>
      </view>
    </page>
  );
}

root.render(<Root />);
