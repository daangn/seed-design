import { List } from "@seed-design/react";
import { Avatar } from "seed-design/ui/avatar";
import { IdentityPlaceholder } from "seed-design/ui/identity-placeholder";

export default function ListWithAvatar() {
  return (
    <List.Root width="300px">
      <List.Item>
        <List.Prefix>
          <Avatar
            size="48"
            src="https://avatars.githubusercontent.com/u/54893898?v=4"
            fallback={<IdentityPlaceholder />}
          />
        </List.Prefix>
        <List.Content>
          <List.Title>사용자 이름</List.Title>
          <List.Detail>온라인 상태</List.Detail>
        </List.Content>
      </List.Item>

      <List.Item>
        <List.Prefix>
          <Avatar size="48" fallback={<IdentityPlaceholder />} />
        </List.Prefix>
        <List.Content>
          <List.Title>익명 사용자</List.Title>
          <List.Detail>오프라인</List.Detail>
        </List.Content>
      </List.Item>
    </List.Root>
  );
}
