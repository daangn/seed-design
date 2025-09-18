import { HStack, VStack } from "@seed-design/react";
import { Chip } from "seed-design/ui/chip";
import { Avatar } from "seed-design/ui/avatar";
import { IdentityPlaceholder } from "seed-design/ui/identity-placeholder";

export default function ChipPrefixAvatar() {
  return (
    <VStack gap="x3" align="center">
      <HStack gap="x2">
        <Chip.Button>
          <Chip.PrefixAvatar>
            <Avatar
              size="24"
              src="https://avatars.githubusercontent.com/u/54893898?v=4"
              fallback={<IdentityPlaceholder />}
            />
          </Chip.PrefixAvatar>
          <Chip.Label>With Avatar Button</Chip.Label>
        </Chip.Button>
        <Chip.Toggle>
          <Chip.PrefixAvatar>
            <Avatar
              size="24"
              src="https://avatars.githubusercontent.com/u/54893898?v=4"
              fallback={<IdentityPlaceholder />}
            />
          </Chip.PrefixAvatar>
          <Chip.Label>With Avatar Toggle</Chip.Label>
        </Chip.Toggle>
      </HStack>
      <Chip.RadioRoot defaultValue="option1" aria-label="Options">
        <HStack gap="x2">
          <Chip.RadioItem value="option1">
            <Chip.PrefixAvatar>
              <Avatar
                size="24"
                src="https://avatars.githubusercontent.com/u/54893898?v=4"
                fallback={<IdentityPlaceholder />}
              />
            </Chip.PrefixAvatar>
            <Chip.Label>With Avatar Radio 1</Chip.Label>
          </Chip.RadioItem>
          <Chip.RadioItem value="option2">
            <Chip.PrefixAvatar>
              <Avatar
                size="24"
                src="https://avatars.githubusercontent.com/u/54893898?v=4"
                fallback={<IdentityPlaceholder />}
              />
            </Chip.PrefixAvatar>
            <Chip.Label>With Avatar Radio 2</Chip.Label>
          </Chip.RadioItem>
        </HStack>
      </Chip.RadioRoot>
    </VStack>
  );
}
