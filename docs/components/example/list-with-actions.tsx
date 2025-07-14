import { IconChevronRightLine, IconDot3HorizontalLine } from "@karrotmarket/react-monochrome-icon";
import { Icon, List } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";

export default function ListWithActions() {
  return (
    <List.Root width="300px">
      <List.Item>
        <List.Content>
          <List.Title>설정</List.Title>
          <List.Detail>계정 및 개인정보 설정</List.Detail>
        </List.Content>
        <List.Suffix>
          <Icon svg={<IconChevronRightLine />} />
        </List.Suffix>
      </List.Item>

      <List.Item>
        <List.Content>
          <List.Title>알림</List.Title>
          <List.Detail>푸시 알림 및 소리 설정</List.Detail>
        </List.Content>
        <List.Suffix gap="x2">
          <ActionButton size="xsmall" variant="neutralWeak">
            편집
          </ActionButton>
          <Icon svg={<IconDot3HorizontalLine />} />
        </List.Suffix>
      </List.Item>

      <List.Item>
        <List.Content>
          <List.Title>도움말</List.Title>
        </List.Content>
        <List.Suffix>
          <ActionButton size="xsmall" variant="brandSolid">
            보기
          </ActionButton>
        </List.Suffix>
      </List.Item>
    </List.Root>
  );
}
