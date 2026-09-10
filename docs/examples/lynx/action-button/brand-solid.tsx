import "./styles";
import { root } from "@lynx-js/react";
import { ActionButton, useSeedClassName } from "@seed-design/lynx-react";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  return (
    <page className={seedClassName}>
      <view className="action-button-preview">
        <ActionButton variant="brandSolid">라벨</ActionButton>
      </view>
    </page>
  );
}

root.render(<Root />);
