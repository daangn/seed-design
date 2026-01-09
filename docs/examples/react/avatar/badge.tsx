import { IdentityPlaceholder } from "seed-design/ui/identity-placeholder";
import { Avatar, AvatarBadge } from "seed-design/ui/avatar";
import { Box, HStack } from "@seed-design/react";

export default function () {
  return (
    <HStack gap="x4">
      <Avatar
        size="64"
        badgeMask="circle"
        src="https://avatars.githubusercontent.com/u/54893898?v=4"
        fallback={<IdentityPlaceholder />}
      >
        <AvatarBadge asChild>
          <Box bg="palette.green600" borderRadius="full" />
        </AvatarBadge>
      </Avatar>
      <Avatar
        size="64"
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
      <Avatar
        size="64"
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
    </HStack>
  );
}
