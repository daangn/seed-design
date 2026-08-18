import IconPlusFill from "@karrotmarket/lynx-monochrome-icon/IconPlusFill";
import { root } from "@lynx-js/react";
import { ActionButton, Icon, useSeedClassName } from "@seed-design/lynx-react";
import "./styles";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  return (
    <page className={seedClassName}>
      <view className="action-button-preview">
        <ActionButton layout="iconOnly" accessibility-label="추가">
          <Icon icon={<IconPlusFill />} />
        </ActionButton>
      </view>
    </page>
  );
}

root.render(<Root />);
