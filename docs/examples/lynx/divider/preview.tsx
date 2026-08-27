import "./styles";

import { root } from "@lynx-js/react";
import { Divider, useSeedClassName } from "@seed-design/lynx-react";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <view className="divider-example">
        <view className="divider-preview">
          <text className="divider-preview__text">
            Nisi elit pariatur incididunt quis fugiat mollit ipsum fugiat duis culpa esse incididunt
            cupidatat.
          </text>
          <Divider />
          <text className="divider-preview__text">
            Consectetur voluptate quis do culpa et culpa.
          </text>
        </view>
      </view>
    </page>
  );
}

root.render(<Root />);
