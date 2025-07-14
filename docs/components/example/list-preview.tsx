import { IconChevronRightLine, IconPersonCircleLine } from "@karrotmarket/react-monochrome-icon";
import { Icon, List } from "@seed-design/react";

export default function ListPreview() {
  return (
    <List.Root width="300px">
      <List.Item>
        <List.Content>
          <List.Title>기본 리스트 아이템</List.Title>
        </List.Content>
      </List.Item>

      <List.Item>
        <List.Prefix>
          <Icon svg={<IconPersonCircleLine />} />
        </List.Prefix>
        <List.Content>
          <List.Title>아이콘이 있는 리스트 아이템</List.Title>
          <List.Detail>부가 정보가 포함된 설명</List.Detail>
        </List.Content>
        <List.Suffix>
          <Icon svg={<IconChevronRightLine />} />
        </List.Suffix>
      </List.Item>
    </List.Root>
  );
}
