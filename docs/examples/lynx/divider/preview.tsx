import "./styles";

import { Divider, useSeedClassName } from "@seed-design/lynx-react";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-divider-root`}>
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
    </view>
  );
}
