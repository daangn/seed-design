import "./styles";

import { root } from "@lynx-js/react";
import { Chip, useSeedClassName } from "@seed-design/lynx-react";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <view className="chip-preview">
        <Chip.Toggle
          defaultChecked
          onCheckedChange={(checked) => console.log("거래 가능", checked)}
        >
          <Chip.Label>거래 가능</Chip.Label>
        </Chip.Toggle>
      </view>
    </page>
  );
}

root.render(<Root />);
