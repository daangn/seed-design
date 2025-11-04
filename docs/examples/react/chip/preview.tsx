import { HStack, VStack } from "@seed-design/react";
import { Chip } from "seed-design/ui/chip";

export default function ChipPreview() {
  return (
    <VStack gap="x3" align="center">
      <HStack gap="x2">
        <Chip.Button>
          <Chip.Label>Button Chip</Chip.Label>
        </Chip.Button>
        <Chip.Toggle>
          <Chip.Label>Toggle Chip</Chip.Label>
        </Chip.Toggle>
      </HStack>
      <Chip.RadioRoot defaultValue="option1" aria-label="Options">
        <HStack gap="x2">
          <Chip.RadioItem value="option1">
            <Chip.Label>Radio Chip 1</Chip.Label>
          </Chip.RadioItem>
          <Chip.RadioItem value="option2">
            <Chip.Label>Radio Chip 2</Chip.Label>
          </Chip.RadioItem>
        </HStack>
      </Chip.RadioRoot>
    </VStack>
  );
}
