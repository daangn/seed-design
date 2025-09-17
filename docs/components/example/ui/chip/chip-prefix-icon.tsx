import { HStack, VStack, Icon } from "@seed-design/react";
import { Chip } from "seed-design/ui/chip";
import { IconHeartFill } from "@karrotmarket/react-monochrome-icon";

export default function ChipPrefixIcon() {
  return (
    <VStack gap="x3" align="center">
      <HStack gap="x2">
        <Chip.Button>
          <Chip.PrefixIcon>
            <Icon svg={<IconHeartFill />} />
          </Chip.PrefixIcon>
          <Chip.Label>With Icon Button</Chip.Label>
        </Chip.Button>
        <Chip.Toggle>
          <Chip.PrefixIcon>
            <Icon svg={<IconHeartFill />} />
          </Chip.PrefixIcon>
          <Chip.Label>With Icon Toggle</Chip.Label>
        </Chip.Toggle>
      </HStack>
      <Chip.RadioRoot defaultValue="option1" aria-label="Options">
        <HStack gap="x2">
          <Chip.RadioItem value="option1">
            <Chip.PrefixIcon>
              <Icon svg={<IconHeartFill />} />
            </Chip.PrefixIcon>
            <Chip.Label>With Icon Radio 1</Chip.Label>
          </Chip.RadioItem>
          <Chip.RadioItem value="option2">
            <Chip.PrefixIcon>
              <Icon svg={<IconHeartFill />} />
            </Chip.PrefixIcon>
            <Chip.Label>With Icon Radio 2</Chip.Label>
          </Chip.RadioItem>
        </HStack>
      </Chip.RadioRoot>
    </VStack>
  );
}
