import { IdentityPlaceholder } from "seed-design/ui/identity-placeholder";
import { Avatar, AvatarBadge } from "seed-design/ui/avatar";
import { Box } from "@seed-design/react";

export default function AvatarBadgeFlower() {
  return (
    <Avatar
      size="80"
      badgeMask="flower"
      src="https://avatars.githubusercontent.com/u/54893898?v=4"
      fallback={<IdentityPlaceholder />}
    >
      <AvatarBadge asChild>
        <img
          src="/flower_green_checkmark.svg"
          alt="뱃지를 설명하는 대체 텍스트를 제공해야 합니다."
        />
      </AvatarBadge>
    </Avatar>
  );
}
