import "./styles";

import IconChevronDownLine from "@karrotmarket/lynx-monochrome-icon/IconChevronDownLine";
import { root } from "@lynx-js/react";
import { Chip, useSeedClassName } from "@seed-design/lynx-react";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
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
    </page>
  );
}

root.render(<Root />);
