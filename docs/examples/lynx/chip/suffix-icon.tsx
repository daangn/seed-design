import "./styles";

import IconChevronDownLine from "@karrotmarket/lynx-monochrome-icon/IconChevronDownLine";

import { Chip, useSeedClassName } from "@seed-design/lynx-react";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-chip-root`}>
      <view className="chip-preview">
        <view className="chip-preview__row">
          <Chip.Button>
            <Chip.Label>Button with Suffix</Chip.Label>
            <Chip.SuffixIcon icon={<IconChevronDownLine />} />
          </Chip.Button>
          <Chip.Toggle>
            <Chip.Label>Toggle with Suffix</Chip.Label>
            <Chip.SuffixIcon icon={<IconChevronDownLine />} />
          </Chip.Toggle>
        </view>
        <Chip.RadioRoot defaultValue="option1">
          <view className="chip-preview__row">
            <Chip.RadioItem value="option1">
              <Chip.Label>Radio with Suffix 1</Chip.Label>
              <Chip.SuffixIcon icon={<IconChevronDownLine />} />
            </Chip.RadioItem>
            <Chip.RadioItem value="option2">
              <Chip.Label>Radio with Suffix 2</Chip.Label>
              <Chip.SuffixIcon icon={<IconChevronDownLine />} />
            </Chip.RadioItem>
          </view>
        </Chip.RadioRoot>
      </view>
    </view>
  );
}
