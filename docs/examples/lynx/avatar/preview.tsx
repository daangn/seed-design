import "./styles";
import { Avatar, AvatarBadge } from "@/components/ui/avatar";
import { IdentityPlaceholder } from "@/components/ui/identity-placeholder";

export default function AvatarPreview() {
  return (
    <view className="avatar-row">
      <Avatar
        size="80"
        badgeMask="circle"
        src="https://avatars.githubusercontent.com/u/54893898?v=4"
        fallback={<IdentityPlaceholder />}
      >
        <AvatarBadge accessibility-label="온라인">
          <view className="avatar-online" />
        </AvatarBadge>
      </Avatar>
      <Avatar size="80" fallback={<IdentityPlaceholder />} />
    </view>
  );
}
