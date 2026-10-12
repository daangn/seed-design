import "./styles";
import { Avatar } from "@/components/ui/avatar";
import { IdentityPlaceholder } from "@/components/ui/identity-placeholder";

export default function AvatarFallbackExample() {
  return (
    <view className="avatar-row">
      <Avatar size="80" fallback={<IdentityPlaceholder identity="person" />} />
      <Avatar size="80" fallback={<IdentityPlaceholder identity="business" />} />
    </view>
  );
}
