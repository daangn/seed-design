import { List, ListDivider, ListItem } from "@/registry/ui/list";
import { ActionButton } from "seed-design/ui/action-button";
import {
  IconChevronRightFill,
  IconILowercaseSerifCircleLine,
  IconPersonCircleLine,
} from "@karrotmarket/react-monochrome-icon";
import { Icon, VStack, ListHeader, SuffixIcon } from "@seed-design/react";

export default function ListPreview() {
  return (
    <VStack>
      <ListHeader>
        Foobar
        <ActionButton
          variant="ghost"
          size="xsmall"
          bleedX="asPadding"
          bleedY="asPadding"
          color="fg.neutralSubtle"
        >
          자세히 보기
          <SuffixIcon svg={<IconChevronRightFill />} />
        </ActionButton>
      </ListHeader>
      <List width="full">
        <ListItem title="기본 리스트 아이템" />
        <ListDivider />
        <ListItem
          prefix={<Icon svg={<IconPersonCircleLine />} />}
          title="아이콘이 있는 리스트 아이템"
          detail="부가 정보가 포함된 설명"
          suffix={<Icon svg={<IconILowercaseSerifCircleLine />} />}
        />
      </List>
    </VStack>
  );
}
