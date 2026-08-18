import { root } from "@lynx-js/react";
import { ActionButton, useSeedClassName } from "@seed-design/lynx-react";
import "./styles";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  return (
    <page className={seedClassName}>
      <view className="action-button-preview">
        <ActionButton variant="ghost">Ghost</ActionButton>
      </view>
    </page>
  );
}

root.render(<Root />);
