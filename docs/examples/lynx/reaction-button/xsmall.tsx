import IconBellFill from "@karrotmarket/lynx-monochrome-icon/IconBellFill";

import { Count, PrefixIcon, ReactionButton } from "@seed-design/lynx-react";

export default function Example() {
  return (
    <ReactionButton size="xsmall">
      <PrefixIcon icon={<IconBellFill />} />
      도움돼요
      <Count>1</Count>
    </ReactionButton>
  );
}
