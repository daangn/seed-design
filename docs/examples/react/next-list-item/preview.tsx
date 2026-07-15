import { List, ListDivider } from "seed-design/ui/list";
import { NextListItem } from "seed-design/ui/next-list-item";
import { ListHeader } from "seed-design/ui/list-header";
import {
  IconILowercaseSerifCircleLine,
  IconPersonCircleLine,
} from "@karrotmarket/react-monochrome-icon";
import { Icon, VStack } from "@seed-design/react";

export default function ListPreview() {
  return (
    <VStack width="360px">
      <ListHeader as="h2">리스트 헤더</ListHeader>
      <List width="full">
        <NextListItem title="기본 리스트 아이템" />
        <ListDivider />
        <NextListItem
          prefix={<Icon svg={<IconPersonCircleLine />} />}
          title="아이콘이 있는 리스트 아이템"
          detail="부가 정보가 포함된 설명"
          suffix={<Icon svg={<IconILowercaseSerifCircleLine />} />}
        />
      </List>
    </VStack>
  );
}
