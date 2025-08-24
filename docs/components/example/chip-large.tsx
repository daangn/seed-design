import { Chip } from "@/registry/ui/chip";
import { HStack } from "@seed-design/react";

export default function ChipLarge() {
  return (
    <HStack gap="x2" align="center">
      <Chip.Button size="large">
        <Chip.Label>Large Button</Chip.Label>
      </Chip.Button>
      <Chip.Toggle size="large">
        <Chip.Label>Large Toggle</Chip.Label>
      </Chip.Toggle>
    </HStack>
  );
}
