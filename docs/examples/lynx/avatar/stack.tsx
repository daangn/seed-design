import "./styles";
import { Avatar, AvatarStack } from "@/components/ui/avatar";
import { IdentityPlaceholder } from "@/components/ui/identity-placeholder";

export default function AvatarStackExample() {
  return (
    <AvatarStack size="64">
      {(["first", "second", "third", "fourth"] as const).map((id) => (
        <Avatar
          key={id}
          src="https://avatars.githubusercontent.com/u/54893898?v=4"
          fallback={<IdentityPlaceholder />}
        />
      ))}
    </AvatarStack>
  );
}
