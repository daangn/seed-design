import { Divider, List } from "@seed-design/react";

export default function ListBasic() {
  return (
    <List.Root width="300px">
      <List.Item>
        <List.Content>
          <List.Title>첫 번째 아이템</List.Title>
        </List.Content>
      </List.Item>
      <Divider />

      <List.Item>
        <List.Content>
          <List.Title>두 번째 아이템</List.Title>
        </List.Content>
      </List.Item>
      <Divider />

      <List.Item>
        <List.Content>
          <List.Title>세 번째 아이템</List.Title>
        </List.Content>
      </List.Item>
    </List.Root>
  );
}
