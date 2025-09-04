import { Badge, HStack } from "@seed-design/react";
import { List, ListDivider, ListItemCheck } from "seed-design/ui/list";

export default function ListCheckbox() {
  return (
    <List as="fieldset" width="full">
      <ListItemCheck
        title={
          <HStack gap="x1_5">
            <span>알림 수신 동의</span>
            <Badge variant="weak">권장</Badge>
          </HStack>
        }
        detail="푸시 알림을 받으시겠습니까?"
        defaultChecked
      />
      <ListDivider as="div" />
      <ListItemCheck
        position="prefix"
        title="마케팅 정보 수신 동의"
        detail="마케팅 정보를 받으시겠습니까?"
        defaultChecked
      />
      <ListDivider as="div" />
      <ListItemCheck position="prefix" title="Ghost Variant" variant="ghost" size="large" />
    </List>
  );
}
