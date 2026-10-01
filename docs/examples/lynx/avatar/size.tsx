import "./styles";
import { useSeedClassName } from "@seed-design/lynx-react";
import { Avatar } from "@/components/ui/avatar";

export default function AvatarSize() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  return (
    <view className={`${seedClassName} docs-lynx-avatar-root`}>
      <view className="avatar-row">
        {(["20", "24", "36", "42", "48", "56", "64", "80", "96", "108"] as const).map((size) => (
          <Avatar
            key={size}
            size={size}
            src="https://avatars.githubusercontent.com/u/54893898?v=4"
            fallback="L"
          />
        ))}
      </view>
    </view>
  );
}
