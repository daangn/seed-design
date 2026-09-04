import "./styles";

import IconBellFill from "@karrotmarket/lynx-monochrome-icon/IconBellFill";
import { root } from "@lynx-js/react";
import { Count, PrefixIcon, ReactionButton, useSeedClassName } from "@seed-design/lynx-react";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <view className="reaction-button-preview">
        <ReactionButton size="xsmall">
          <PrefixIcon icon={<IconBellFill />} />
          도움돼요
          <Count>1</Count>
        </ReactionButton>
      </view>
    </page>
  );
}

root.render(<Root />);
