import "./styles";
import { useSeedClassName } from "@seed-design/lynx-react";
import { Avatar, AvatarBadge } from "@/components/ui/avatar";
import { IdentityPlaceholder } from "@/components/ui/identity-placeholder";

export default function AvatarBadgeExample() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  return (
    <view className={`${seedClassName} docs-lynx-avatar-root`}>
      <view className="avatar-row">
        <Avatar
          size="64"
          src="https://avatars.githubusercontent.com/u/54893898?v=4"
          fallback={<IdentityPlaceholder />}
        >
          <AvatarBadge accessibility-label="온라인">
            <view className="avatar-online" />
          </AvatarBadge>
        </Avatar>
        <Avatar
          size="64"
          src="https://avatars.githubusercontent.com/u/54893898?v=4"
          fallback={<IdentityPlaceholder />}
        >
          <AvatarBadge>
            <image
              className="avatar-badge-image"
              src="https://seed-design.io/flower_green_checkmark.svg"
              accessibility-label="인증된 프로필"
            />
          </AvatarBadge>
        </Avatar>
        <Avatar
          size="64"
          src="https://avatars.githubusercontent.com/u/54893898?v=4"
          fallback={<IdentityPlaceholder />}
        >
          <AvatarBadge>
            <image
              className="avatar-badge-image"
              src="https://seed-design.io/shield_blue_checkmark.svg"
              accessibility-label="보호된 프로필"
            />
          </AvatarBadge>
        </Avatar>
      </view>
    </view>
  );
}
