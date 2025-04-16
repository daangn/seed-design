import { Avatar, AvatarBadge } from "seed-design/ui/avatar";
import { IdentityPlaceholder } from "seed-design/ui/identity-placeholder";

export default function AvatarBadgeShield() {
  return (
    <Avatar
      size="80"
      badgeMask="shield"
      src="https://avatars.githubusercontent.com/u/54893898?v=4"
      fallback={<IdentityPlaceholder />}
    >
      <AvatarBadge asChild>
        <img
          src="/shield_blue_checkmark.svg"
          alt="뱃지를 설명하는 대체 텍스트를 제공해야 합니다."
        />
      </AvatarBadge>
    </Avatar>
  );
}
