import { Accordion } from "seed-design/ui/accordion";
import { Avatar } from "seed-design/ui/avatar";
import { IdentityPlaceholder } from "seed-design/ui/identity-placeholder";

export default function AccordionWithPrefixAvatar() {
  return (
    <Accordion>
      <Accordion.Item value="item-1">
        <Accordion.Trigger>
          <Accordion.PrefixAvatar>
            <Avatar
              size="24"
              src="https://avatars.githubusercontent.com/u/54893898?v=4"
              fallback={<IdentityPlaceholder />}
            />
          </Accordion.PrefixAvatar>
          <Accordion.Body>
            <Accordion.Title>아코디언 항목 1</Accordion.Title>
          </Accordion.Body>
        </Accordion.Trigger>
        <Accordion.Content>
          <p>첫 번째 항목의 내용입니다.</p>
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="item-2">
        <Accordion.Trigger>
          <Accordion.PrefixAvatar>
            <Avatar
              size="24"
              src="https://avatars.githubusercontent.com/u/54893898?v=4"
              fallback={<IdentityPlaceholder />}
            />
          </Accordion.PrefixAvatar>
          <Accordion.Body>
            <Accordion.Title>아코디언 항목 2</Accordion.Title>
          </Accordion.Body>
        </Accordion.Trigger>
        <Accordion.Content>
          <p>두 번째 항목의 내용입니다.</p>
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="item-3">
        <Accordion.Trigger>
          <Accordion.PrefixAvatar>
            <Avatar
              size="24"
              src="https://avatars.githubusercontent.com/u/54893898?v=4"
              fallback={<IdentityPlaceholder />}
            />
          </Accordion.PrefixAvatar>
          <Accordion.Body>
            <Accordion.Title>아코디언 항목 3</Accordion.Title>
          </Accordion.Body>
        </Accordion.Trigger>
        <Accordion.Content>
          <p>세 번째 항목의 내용입니다.</p>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  );
}
