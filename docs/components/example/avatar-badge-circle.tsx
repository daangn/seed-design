import { IdentityPlaceholder } from "seed-design/ui/identity-placeholder";
import { Avatar, AvatarBadge } from "seed-design/ui/avatar";
import { Box } from "@seed-design/react";

export default function AvatarBadgeCircle() {
  return (
    <Avatar
      size="80"
      badgeMask="circle"
      src="https://avatars.githubusercontent.com/u/54893898?v=4"
      fallback={<IdentityPlaceholder />}
    >
      <AvatarBadge asChild>
        <Box background="palette.green600" borderRadius="full" />
      </AvatarBadge>
    </Avatar>
  );
}
