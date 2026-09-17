import "./styles";
import { useSeedClassName } from "@seed-design/lynx-react";
import { Avatar } from "@/components/ui/avatar";
import { IdentityPlaceholder } from "@/components/ui/identity-placeholder";

export default function AvatarFallbackExample() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  return (
    <view className={`${seedClassName} docs-lynx-avatar-root`}>
      <view className="avatar-row">
        <Avatar size="80" fallback={<IdentityPlaceholder identity="person" />} />
        <Avatar size="80" fallback={<IdentityPlaceholder identity="business" />} />
      </view>
    </view>
  );
}
