import "./styles";

import { Chip } from "@seed-design/lynx-react";
import { Avatar } from "@/components/ui/avatar";
import { IdentityPlaceholder } from "@/components/ui/identity-placeholder";

function PrefixAvatar() {
  return (
    <Avatar
      size="24"
      src="https://avatars.githubusercontent.com/u/54893898?v=4"
      fallback={<IdentityPlaceholder />}
    />
  );
}

export default function Example() {
  return (
    <view className="chip-preview">
      <view className="chip-preview__row">
        <Chip.Button>
          <Chip.PrefixAvatar>
            <PrefixAvatar />
          </Chip.PrefixAvatar>
          <Chip.Label>With Avatar Button</Chip.Label>
        </Chip.Button>
        <Chip.Toggle>
          <Chip.PrefixAvatar>
            <PrefixAvatar />
          </Chip.PrefixAvatar>
          <Chip.Label>With Avatar Toggle</Chip.Label>
        </Chip.Toggle>
      </view>
      <Chip.RadioRoot defaultValue="option1">
        <view className="chip-preview__row">
          <Chip.RadioItem value="option1">
            <Chip.PrefixAvatar>
              <PrefixAvatar />
            </Chip.PrefixAvatar>
            <Chip.Label>With Avatar Radio 1</Chip.Label>
          </Chip.RadioItem>
          <Chip.RadioItem value="option2">
            <Chip.PrefixAvatar>
              <PrefixAvatar />
            </Chip.PrefixAvatar>
            <Chip.Label>With Avatar Radio 2</Chip.Label>
          </Chip.RadioItem>
        </view>
      </Chip.RadioRoot>
    </view>
  );
}
