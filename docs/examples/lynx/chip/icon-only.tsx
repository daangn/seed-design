import "./styles";

import IconArrowClockwiseCircularLine from "@karrotmarket/lynx-monochrome-icon/IconArrowClockwiseCircularLine";
import IconBellLine from "@karrotmarket/lynx-monochrome-icon/IconBellLine";
import IconBellSlashLine from "@karrotmarket/lynx-monochrome-icon/IconBellSlashLine";
import IconTimer_10Line from "@karrotmarket/lynx-monochrome-icon/IconTimer_10Line";
import IconTimer_3Line from "@karrotmarket/lynx-monochrome-icon/IconTimer_3Line";
import { root, useState } from "@lynx-js/react";
import { Chip, Icon, useSeedClassName } from "@seed-design/lynx-react";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [checked, setChecked] = useState(false);

  return (
    <page className={seedClassName}>
      <view className="chip-preview">
        <view className="chip-preview__row">
          <Chip.Button layout="iconOnly" accessibility-label="Refresh">
            <Icon icon={<IconArrowClockwiseCircularLine />} />
          </Chip.Button>
          <Chip.Toggle
            layout="iconOnly"
            checked={checked}
            onCheckedChange={setChecked}
            accessibility-label="Receive notifications"
          >
            <Icon icon={checked ? <IconBellLine /> : <IconBellSlashLine />} />
          </Chip.Toggle>
        </view>
        <Chip.RadioRoot defaultValue="3">
          <view className="chip-preview__row">
            <Chip.RadioItem value="3" layout="iconOnly" accessibility-label="3 seconds">
              <Icon icon={<IconTimer_3Line />} />
            </Chip.RadioItem>
            <Chip.RadioItem value="10" layout="iconOnly" accessibility-label="10 seconds">
              <Icon icon={<IconTimer_10Line />} />
            </Chip.RadioItem>
          </view>
        </Chip.RadioRoot>
      </view>
    </page>
  );
}

root.render(<Root />);
