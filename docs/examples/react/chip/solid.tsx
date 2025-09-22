import { HStack, VStack } from "@seed-design/react";
import { Chip } from "seed-design/ui/chip";

export default function ChipSolid() {
  return (
    <VStack gap="x3" align="center">
      <HStack gap="x2">
        <Chip.Button variant="solid">
          <Chip.Label>Solid Button</Chip.Label>
        </Chip.Button>
        <Chip.Toggle variant="solid">
          <Chip.Label>Solid Toggle</Chip.Label>
        </Chip.Toggle>
      </HStack>
      <Chip.RadioRoot defaultValue="option1" aria-label="Options">
        <HStack gap="x2">
          <Chip.RadioItem value="option1" variant="solid">
            <Chip.Label>Solid Radio 1</Chip.Label>
          </Chip.RadioItem>
          <Chip.RadioItem value="option2" variant="solid">
            <Chip.Label>Solid Radio 2</Chip.Label>
          </Chip.RadioItem>
        </HStack>
      </Chip.RadioRoot>
    </VStack>
  );
}
