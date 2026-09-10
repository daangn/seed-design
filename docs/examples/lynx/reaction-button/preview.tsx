import "./styles";

import IconBellFill from "@karrotmarket/lynx-monochrome-icon/IconBellFill";

import { Count, PrefixIcon, ReactionButton, useSeedClassName } from "@seed-design/lynx-react";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-reaction-button-root`}>
      <view className="reaction-button-preview">
        <ReactionButton>
          <PrefixIcon icon={<IconBellFill />} />
          도움돼요
          <Count>1</Count>
        </ReactionButton>
      </view>
    </view>
  );
}
