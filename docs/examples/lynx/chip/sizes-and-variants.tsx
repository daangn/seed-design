import "./styles";

import { root } from "@lynx-js/react";
import { Chip, useSeedClassName } from "@seed-design/lynx-react";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <view className="chip-preview">
        <view className="chip-preview__row">
          <Chip.Button size="small" variant="solid">
            <Chip.Label>Small</Chip.Label>
          </Chip.Button>
          <Chip.Button size="medium" variant="solid">
            <Chip.Label>Medium</Chip.Label>
          </Chip.Button>
          <Chip.Button size="large" variant="solid">
            <Chip.Label>Large</Chip.Label>
          </Chip.Button>
        </view>
        <view className="chip-preview__row">
          <Chip.Button variant="solid">
            <Chip.Label>Solid</Chip.Label>
          </Chip.Button>
          <Chip.Button variant="outlineStrong">
            <Chip.Label>Outline Strong</Chip.Label>
          </Chip.Button>
          <Chip.Button variant="outlineWeak">
            <Chip.Label>Outline Weak</Chip.Label>
          </Chip.Button>
        </view>
      </view>
    </page>
  );
}

root.render(<Root />);
