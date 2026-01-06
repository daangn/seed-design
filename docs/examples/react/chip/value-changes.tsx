import { HStack, VStack, Text } from "@seed-design/react";
import { Chip } from "seed-design/ui/chip";
import { useState } from "react";

export default function ChipValueChanges() {
  const [toggleCount, setToggleCount] = useState(0);
  const [toggleLastValue, setToggleLastValue] = useState<boolean | null>(null);
  const [radioCount, setRadioCount] = useState(0);
  const [radioLastValue, setRadioLastValue] = useState<string | null>(null);

  return (
    <VStack gap="x4" align="center">
      <VStack gap="x2" align="center">
        <Chip.Toggle
          onCheckedChange={(checked) => {
            setToggleCount((prev) => prev + 1);
            setToggleLastValue(checked);
          }}
        >
          <Chip.Label>Toggle Chip</Chip.Label>
        </Chip.Toggle>
        <Text>
          onCheckedChange called: {toggleCount} times, last value: {`${toggleLastValue ?? "-"}`}
        </Text>
      </VStack>
      <VStack gap="x2" align="center">
        <Chip.RadioRoot
          defaultValue="option1"
          aria-label="Options"
          onValueChange={(value) => {
            setRadioCount((prev) => prev + 1);
            setRadioLastValue(value);
          }}
        >
          <HStack gap="x2">
            <Chip.RadioItem value="option1">
              <Chip.Label>Radio 1</Chip.Label>
            </Chip.RadioItem>
            <Chip.RadioItem value="option2">
              <Chip.Label>Radio 2</Chip.Label>
            </Chip.RadioItem>
          </HStack>
        </Chip.RadioRoot>
        <Text>
          onValueChange called: {radioCount} times, last value: {radioLastValue ?? "-"}
        </Text>
      </VStack>
    </VStack>
  );
}
