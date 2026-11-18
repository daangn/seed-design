import "./styles";

import { HStack } from "@seed-design/lynx-react";

import { Badge } from "@/components/ui/badge";
import { Checkmark } from "@/components/ui/checkbox";
import { List, ListCheckItem, ListDivider } from "@/components/ui/list";

export default function Example() {
  return (
    <List className="list-preview">
      <ListCheckItem
        accessibility-label="알림 수신 동의"
        title={
          <HStack gap="x1_5" align="center">
            <text>알림 수신 동의</text>
            <Badge variant="weak">권장</Badge>
          </HStack>
        }
        detail="푸시 알림을 받으시겠습니까?"
        defaultChecked
      />
      <ListDivider />
      <ListCheckItem
        title="마케팅 정보 수신 동의"
        detail="마케팅 정보를 받으시겠습니까?"
        prefix={<Checkmark tone="neutral" size="large" />}
        suffix={null}
        defaultChecked
      />
      <ListDivider />
      <ListCheckItem
        prefix={<Checkmark tone="neutral" size="large" variant="ghost" />}
        suffix={null}
        title="Ghost Variant"
      />
    </List>
  );
}
