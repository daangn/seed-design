import IconPlusFill from "@karrotmarket/lynx-monochrome-icon/IconPlusFill";
import { root } from "@lynx-js/react";
import { ActionButton, PrefixIcon, useSeedClassName } from "@seed-design/lynx-react";
import "./styles";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  return (
    <page className={seedClassName}>
      <view className="action-button-preview">
        <ActionButton>
          <PrefixIcon icon={<IconPlusFill />} />
          라벨
        </ActionButton>
      </view>
    </page>
  );
}

root.render(<Root />);
