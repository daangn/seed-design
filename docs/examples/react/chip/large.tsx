import { HStack, VStack } from "@seed-design/react";
import { Chip } from "seed-design/ui/chip";

export default function ChipLarge() {
  return (
    <VStack gap="x3" align="center">
      <HStack gap="x2">
        <Chip.Button size="large">
          <Chip.Label>Large Button</Chip.Label>
        </Chip.Button>
        <Chip.Toggle size="large">
          <Chip.Label>Large Toggle</Chip.Label>
        </Chip.Toggle>
      </HStack>
      <Chip.RadioRoot defaultValue="option1" aria-label="Options">
        <HStack gap="x2">
          <Chip.RadioItem value="option1" size="large">
            <Chip.Label>Large Radio 1</Chip.Label>
          </Chip.RadioItem>
          <Chip.RadioItem value="option2" size="large">
            <Chip.Label>Large Radio 2</Chip.Label>
          </Chip.RadioItem>
        </HStack>
      </Chip.RadioRoot>
    </VStack>
  );
}
