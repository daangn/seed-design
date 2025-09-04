import { Badge, Divider, HStack, RadioGroup, VStack } from "@seed-design/react";
import { List, ListItemCheck, ListItemRadio } from "seed-design/ui/list";

export default function ListFormControls() {
  return (
    <VStack width="full">
      <List as="fieldset">
        <ListItemCheck
          title={
            <HStack gap="x1_5">
              <span>알림 수신 동의</span>
              <Badge variant="weak">권장</Badge>
            </HStack>
          }
          detail="푸시 알림을 받으시겠습니까?"
        />
        <ListItemCheck
          position="prefix"
          title="마케팅 정보 수신 동의"
          detail="마케팅 정보를 받으시겠습니까?"
          defaultChecked
        />
        <ListItemCheck position="prefix" title="Ghost Variant" variant="ghost" size="large" />
      </List>
      <Divider />
      <List asChild>
        <RadioGroup.Root defaultValue="option1" aria-label="옵션 선택">
          <ListItemRadio value="option1" title="옵션 1" detail="첫 번째 선택지" />
          <ListItemRadio position="prefix" value="option2" title="옵션 2" detail="두 번째 선택지" />
        </RadioGroup.Root>
      </List>
    </VStack>
  );
}
