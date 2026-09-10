import "./styles";

import IconHeartFill from "@karrotmarket/lynx-monochrome-icon/IconHeartFill";

import { Chip, useSeedClassName } from "@seed-design/lynx-react";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-chip-root`}>
      <view className="chip-preview">
        <view className="chip-preview__row">
          <Chip.Button>
            <Chip.PrefixIcon icon={<IconHeartFill />} />
            <Chip.Label>With Icon Button</Chip.Label>
          </Chip.Button>
          <Chip.Toggle>
            <Chip.PrefixIcon icon={<IconHeartFill />} />
            <Chip.Label>With Icon Toggle</Chip.Label>
          </Chip.Toggle>
        </view>
        <Chip.RadioRoot defaultValue="option1">
          <view className="chip-preview__row">
            <Chip.RadioItem value="option1">
              <Chip.PrefixIcon icon={<IconHeartFill />} />
              <Chip.Label>With Icon Radio 1</Chip.Label>
            </Chip.RadioItem>
            <Chip.RadioItem value="option2">
              <Chip.PrefixIcon icon={<IconHeartFill />} />
              <Chip.Label>With Icon Radio 2</Chip.Label>
            </Chip.RadioItem>
          </view>
        </Chip.RadioRoot>
      </view>
    </view>
  );
}
