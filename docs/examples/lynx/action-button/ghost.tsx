import "./styles";
import IconTagFill from "@karrotmarket/lynx-monochrome-icon/IconTagFill";
import { root } from "@lynx-js/react";
import { ActionButton, PrefixIcon, useSeedClassName } from "@seed-design/lynx-react";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  return (
    <page className={seedClassName}>
      <view className="action-button-preview">
        <ActionButton variant="ghost">
          <PrefixIcon icon={<IconTagFill />} />
          Default (fg.neutral)
        </ActionButton>
      </view>
    </page>
  );
}

root.render(<Root />);
