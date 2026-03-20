import { Flex } from "@seed-design/react";
import { Avatar } from "seed-design/ui/avatar";
import { IdentityPlaceholder } from "seed-design/ui/identity-placeholder";

export default function AvatarFallbackExample() {
  return (
    <Flex gap="x4" align="center">
      <Avatar size="80" fallback={<IdentityPlaceholder identity="person" />} />
      <Avatar size="80" fallback={<IdentityPlaceholder identity="business" />} />
    </Flex>
  );
}
