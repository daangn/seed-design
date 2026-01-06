import { Box, Flex } from "@seed-design/react";
import { Avatar, AvatarBadge } from "seed-design/ui/avatar";
import { IdentityPlaceholder } from "seed-design/ui/identity-placeholder";

export default function AvatarPreview() {
  return (
    <Flex gap="x4">
      <Avatar
        size="80"
        badgeMask="circle"
        src="https://avatars.githubusercontent.com/u/54893898?v=4"
        fallback={<IdentityPlaceholder />}
      >
        <AvatarBadge>
          <Box borderRadius="full" bg="palette.green600" width="x6" height="x6" />
        </AvatarBadge>
      </Avatar>
      <Avatar size="80" src={undefined} fallback={<IdentityPlaceholder />} />
    </Flex>
  );
}
