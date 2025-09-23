import { HStack, VStack } from "@seed-design/react";
import { Chip } from "seed-design/ui/chip";

export default function ChipSmall() {
  return (
    <VStack gap="x3" align="center">
      <HStack gap="x2">
        <Chip.Button size="small">
          <Chip.Label>Small Button</Chip.Label>
        </Chip.Button>
        <Chip.Toggle size="small">
          <Chip.Label>Small Toggle</Chip.Label>
        </Chip.Toggle>
      </HStack>
      <Chip.RadioRoot defaultValue="option1" aria-label="Options">
        <HStack gap="x2">
          <Chip.RadioItem value="option1" size="small">
            <Chip.Label>Small Radio 1</Chip.Label>
          </Chip.RadioItem>
          <Chip.RadioItem value="option2" size="small">
            <Chip.Label>Small Radio 2</Chip.Label>
          </Chip.RadioItem>
        </HStack>
      </Chip.RadioRoot>
    </VStack>
  );
}
