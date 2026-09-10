import "./styles";

import { Chip, useSeedClassName } from "@seed-design/lynx-react";

function AppAvatar() {
  return (
    <view className="chip-preview__avatar">
      <text className="chip-preview__avatar-label">A</text>
    </view>
  );
}

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-chip-root`}>
      <view className="chip-preview">
        <view className="chip-preview__row">
          <Chip.Button>
            <Chip.PrefixAvatar>
              <AppAvatar />
            </Chip.PrefixAvatar>
            <Chip.Label>With Avatar Button</Chip.Label>
          </Chip.Button>
          <Chip.Toggle>
            <Chip.PrefixAvatar>
              <AppAvatar />
            </Chip.PrefixAvatar>
            <Chip.Label>With Avatar Toggle</Chip.Label>
          </Chip.Toggle>
        </view>
        <Chip.RadioRoot defaultValue="option1">
          <view className="chip-preview__row">
            <Chip.RadioItem value="option1">
              <Chip.PrefixAvatar>
                <AppAvatar />
              </Chip.PrefixAvatar>
              <Chip.Label>With Avatar Radio 1</Chip.Label>
            </Chip.RadioItem>
            <Chip.RadioItem value="option2">
              <Chip.PrefixAvatar>
                <AppAvatar />
              </Chip.PrefixAvatar>
              <Chip.Label>With Avatar Radio 2</Chip.Label>
            </Chip.RadioItem>
          </view>
        </Chip.RadioRoot>
      </view>
    </view>
  );
}
