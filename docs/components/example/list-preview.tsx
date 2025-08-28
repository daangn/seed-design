import { List, ListItem } from "@/registry/ui/list";
import {
  IconILowercaseSerifCircleLine,
  IconPersonCircleLine,
} from "@karrotmarket/react-monochrome-icon";
import { Divider, Icon } from "@seed-design/react";

export default function ListPreview() {
  return (
    <List width="full">
      <ListItem title="기본 리스트 아이템" />
      <Divider />
      <ListItem
        prefix={<Icon svg={<IconPersonCircleLine />} />}
        title="아이콘이 있는 리스트 아이템"
        detail="부가 정보가 포함된 설명"
        suffix={<Icon svg={<IconILowercaseSerifCircleLine />} />}
      />
    </List>
  );
}
