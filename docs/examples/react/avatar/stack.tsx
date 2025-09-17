import { Avatar, AvatarStack } from "@/registry/ui/avatar";
import { IdentityPlaceholder } from "@/registry/ui/identity-placeholder";

export default function AvatarStackExample() {
  return (
    <AvatarStack size="64">
      <Avatar
        src="https://avatars.githubusercontent.com/u/54893898?v=4"
        fallback={<IdentityPlaceholder />}
      />
      <Avatar
        src="https://avatars.githubusercontent.com/u/54893898?v=4"
        fallback={<IdentityPlaceholder />}
      />
      <Avatar
        src="https://avatars.githubusercontent.com/u/54893898?v=4"
        fallback={<IdentityPlaceholder />}
      />
      <Avatar
        src="https://avatars.githubusercontent.com/u/54893898?v=4"
        fallback={<IdentityPlaceholder />}
      />
    </AvatarStack>
  );
}
