import IconBellFill from "@karrotmarket/lynx-monochrome-icon/IconBellFill";

import { PrefixIcon, ReactionButton } from "@seed-design/lynx-react";

export default function Example() {
  return (
    <ReactionButton disabled>
      <PrefixIcon icon={<IconBellFill />} />
      비활성
    </ReactionButton>
  );
}
