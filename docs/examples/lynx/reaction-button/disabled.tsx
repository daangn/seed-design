import "./styles";

import IconBellFill from "@karrotmarket/lynx-monochrome-icon/IconBellFill";
import { root } from "@lynx-js/react";
import { PrefixIcon, ReactionButton, useSeedClassName } from "@seed-design/lynx-react";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <view className="reaction-button-preview">
        <ReactionButton disabled>
          <PrefixIcon icon={<IconBellFill />} />
          비활성
        </ReactionButton>
      </view>
    </page>
  );
}

root.render(<Root />);
