import "./styles";

import IconChevronRightFill from "@karrotmarket/lynx-monochrome-icon/IconChevronRightFill";
import IconPlusFill from "@karrotmarket/lynx-monochrome-icon/IconPlusFill";
import { root } from "@lynx-js/react";
import { Chip, Icon, useSeedClassName } from "@seed-design/lynx-react";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <view className="chip-preview">
        <view className="chip-preview__row">
          <Chip.Button>
            <Chip.PrefixIcon icon={<IconPlusFill />} />
            <Chip.Label>추가</Chip.Label>
          </Chip.Button>
          <Chip.Button>
            <Chip.PrefixAvatar>
              <view className="chip-preview__avatar">
                <text className="chip-preview__avatar-label">A</text>
              </view>
            </Chip.PrefixAvatar>
            <Chip.Label>프로필</Chip.Label>
          </Chip.Button>
          <Chip.Button>
            <Chip.Label>다음</Chip.Label>
            <Chip.SuffixIcon icon={<IconChevronRightFill />} />
          </Chip.Button>
        </view>
        <Chip.Button layout="iconOnly" accessibility-label="추가">
          <Icon icon={<IconPlusFill />} />
        </Chip.Button>
      </view>
    </page>
  );
}

root.render(<Root />);
