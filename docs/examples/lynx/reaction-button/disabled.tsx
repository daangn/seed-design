import "./styles";

import IconBellFill from "@karrotmarket/lynx-monochrome-icon/IconBellFill";

import { PrefixIcon, ReactionButton, useSeedClassName } from "@seed-design/lynx-react";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-reaction-button-root`}>
      <view className="reaction-button-preview">
        <ReactionButton disabled>
          <PrefixIcon icon={<IconBellFill />} />
          비활성
        </ReactionButton>
      </view>
    </view>
  );
}
