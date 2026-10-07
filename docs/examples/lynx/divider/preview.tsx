import "./styles";

import { Divider } from "@seed-design/lynx-react";

export default function Example() {
  return (
    <view className="divider-preview">
      <text className="divider-preview__text">
        Nisi elit pariatur incididunt quis fugiat mollit ipsum fugiat duis culpa esse incididunt
        cupidatat.
      </text>
      <Divider />
      <text className="divider-preview__text">Consectetur voluptate quis do culpa et culpa.</text>
    </view>
  );
}
