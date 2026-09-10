import "./styles";

import { root } from "@lynx-js/react";
import { Chip, useSeedClassName } from "@seed-design/lynx-react";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <view className="chip-preview">
        <Chip.Button bindtap={() => console.log("필터 열기")}>
          <Chip.Label>필터 열기</Chip.Label>
        </Chip.Button>
      </view>
    </page>
  );
}

root.render(<Root />);
