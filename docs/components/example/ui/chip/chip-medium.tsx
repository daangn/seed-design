import { HStack, VStack } from "@seed-design/react";
import { Chip } from "seed-design/ui/chip";

export default function ChipMedium() {
  return (
    <VStack gap="x3" align="center">
      <HStack gap="x2">
        <Chip.Button size="medium">
          <Chip.Label>Medium Button</Chip.Label>
        </Chip.Button>
        <Chip.Toggle size="medium">
          <Chip.Label>Medium Toggle</Chip.Label>
        </Chip.Toggle>
      </HStack>
      <Chip.RadioRoot defaultValue="option1" aria-label="Options">
        <HStack gap="x2">
          <Chip.RadioItem value="option1" size="medium">
            <Chip.Label>Medium Radio 1</Chip.Label>
          </Chip.RadioItem>
          <Chip.RadioItem value="option2" size="medium">
            <Chip.Label>Medium Radio 2</Chip.Label>
          </Chip.RadioItem>
        </HStack>
      </Chip.RadioRoot>
    </VStack>
  );
}
