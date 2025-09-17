import { HStack, VStack } from "@seed-design/react";
import { Chip } from "seed-design/ui/chip";

export default function ChipOutlineStrong() {
  return (
    <VStack gap="x3" align="center">
      <HStack gap="x2">
        <Chip.Button variant="outlineStrong">
          <Chip.Label>Outline Strong Button</Chip.Label>
        </Chip.Button>
        <Chip.Toggle variant="outlineStrong">
          <Chip.Label>Outline Strong Toggle</Chip.Label>
        </Chip.Toggle>
      </HStack>
      <Chip.RadioRoot defaultValue="option1" aria-label="Options">
        <HStack gap="x2">
          <Chip.RadioItem value="option1" variant="outlineStrong">
            <Chip.Label>Outline Strong Radio 1</Chip.Label>
          </Chip.RadioItem>
          <Chip.RadioItem value="option2" variant="outlineStrong">
            <Chip.Label>Outline Strong Radio 2</Chip.Label>
          </Chip.RadioItem>
        </HStack>
      </Chip.RadioRoot>
    </VStack>
  );
}
