import "./styles";

import { root } from "@lynx-js/react";
import { Chip, useSeedClassName } from "@seed-design/lynx-react";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <view className="chip-preview">
        <view className="chip-preview__row">
          <Chip.Button size="medium">
            <Chip.Label>Medium Button</Chip.Label>
          </Chip.Button>
          <Chip.Toggle size="medium">
            <Chip.Label>Medium Toggle</Chip.Label>
          </Chip.Toggle>
        </view>
        <Chip.RadioRoot defaultValue="option1">
          <view className="chip-preview__row">
            <Chip.RadioItem value="option1" size="medium">
              <Chip.Label>Medium Radio 1</Chip.Label>
            </Chip.RadioItem>
            <Chip.RadioItem value="option2" size="medium">
              <Chip.Label>Medium Radio 2</Chip.Label>
            </Chip.RadioItem>
          </view>
        </Chip.RadioRoot>
      </view>
    </page>
  );
}

root.render(<Root />);
