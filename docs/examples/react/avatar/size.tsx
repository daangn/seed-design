import { Flex } from "@seed-design/react";
import { Avatar } from "seed-design/ui/avatar";

export default function AvatarSize() {
  return (
    <Flex gap="x4">
      <Avatar size="20" src="https://avatars.githubusercontent.com/u/54893898?v=4" fallback="L" />
      <Avatar size="24" src="https://avatars.githubusercontent.com/u/54893898?v=4" fallback="L" />
      <Avatar size="36" src="https://avatars.githubusercontent.com/u/54893898?v=4" fallback="L" />
      <Avatar size="48" src="https://avatars.githubusercontent.com/u/54893898?v=4" fallback="L" />
      <Avatar size="64" src="https://avatars.githubusercontent.com/u/54893898?v=4" fallback="L" />
      <Avatar size="80" src="https://avatars.githubusercontent.com/u/54893898?v=4" fallback="L" />
      <Avatar size="96" src="https://avatars.githubusercontent.com/u/54893898?v=4" fallback="L" />
      <Avatar size="108" src="https://avatars.githubusercontent.com/u/54893898?v=4" fallback="L" />
    </Flex>
  );
}
