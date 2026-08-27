import "./styles";

import { root } from "@lynx-js/react";
import { Chip, useSeedClassName } from "@seed-design/lynx-react";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <Chip.RadioRoot defaultValue="recent" onValueChange={(value) => console.log("정렬", value)}>
        <view className="chip-preview">
          <view className="chip-preview__row">
            <Chip.RadioItem value="recent">
              <Chip.Label>최신순</Chip.Label>
            </Chip.RadioItem>
            <Chip.RadioItem value="nearby">
              <Chip.Label>가까운 순</Chip.Label>
            </Chip.RadioItem>
          </view>
        </view>
      </Chip.RadioRoot>
    </page>
  );
}

root.render(<Root />);
