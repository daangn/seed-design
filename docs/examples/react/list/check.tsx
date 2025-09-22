import { Badge, HStack } from "@seed-design/react";
import { List, ListDivider, ListCheckItem } from "seed-design/ui/list";
import { Checkmark } from "seed-design/ui/checkbox";

export default function ListCheckbox() {
  return (
    <List as="fieldset" width="360px">
      <ListCheckItem
        title={
          <HStack gap="x1_5">
            <span>알림 수신 동의</span>
            <Badge variant="weak">권장</Badge>
          </HStack>
        }
        detail="푸시 알림을 받으시겠습니까?"
        suffix={<Checkmark tone="neutral" size="large" />}
        defaultChecked
      />
      <ListDivider as="div" />
      <ListCheckItem
        prefix={<Checkmark tone="neutral" size="large" />}
        title="마케팅 정보 수신 동의"
        detail="마케팅 정보를 받으시겠습니까?"
        defaultChecked
      />
      <ListDivider as="div" />
      <ListCheckItem
        prefix={<Checkmark tone="neutral" size="large" variant="ghost" />}
        title="Ghost Variant"
      />
    </List>
  );
}
