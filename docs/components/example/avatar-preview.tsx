import { Flex } from "@seed-design/react";
import { Avatar, AvatarBadge } from "seed-design/ui/avatar";
import { IdentityPlaceholder } from "seed-design/ui/identity-placeholder";

export default function AvatarPreview() {
  return (
    <Flex gap="x4">
      <Avatar
        size="80"
        src="https://avatars.githubusercontent.com/u/54893898?v=4"
        fallback={<IdentityPlaceholder />}
      >
        <AvatarBadge>
          <div style={{ background: "green", width: 20, height: 20, borderRadius: 9999 }} />
        </AvatarBadge>
      </Avatar>
      <Avatar size="80" src={undefined} fallback={<IdentityPlaceholder />} />
    </Flex>
  );
}
