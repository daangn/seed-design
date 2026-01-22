import { HStack, Text, VStack } from "@seed-design/react";
import {
  CheckSelectBox,
  CheckSelectBoxCheckmark,
  CheckSelectBoxGroup,
  RadioSelectBoxItem,
  RadioSelectBoxRadiomark,
  RadioSelectBoxRoot,
} from "seed-design/ui/select-box";
import { useState } from "react";

export default function SelectBoxValueChanges() {
  const [checkCount, setCheckCount] = useState(0);
  const [checkLastValue, setCheckLastValue] = useState<boolean | null>(null);

  const [radioCount, setRadioCount] = useState(0);
  const [radioLastValue, setRadioLastValue] = useState<string | null>(null);

  return (
    <HStack gap="x8" align="center" width="full" p="x4">
      <VStack gap="x4" align="center" style={{ flex: 1 }}>
        <CheckSelectBoxGroup aria-label="Fruit">
          <CheckSelectBox
            label="Apple"
            suffix={<CheckSelectBoxCheckmark />}
            onCheckedChange={(checked) => {
              setCheckCount((prev) => prev + 1);
              setCheckLastValue(checked);
            }}
          />
        </CheckSelectBoxGroup>
        <Text align="center">
          onCheckedChange called: {checkCount} times, last value: {`${checkLastValue ?? "-"}`}
        </Text>
      </VStack>

      <VStack gap="x4" align="center" style={{ flex: 1 }}>
        <RadioSelectBoxRoot
          defaultValue="apple"
          aria-label="Fruit"
          onValueChange={(value) => {
            setRadioCount((prev) => prev + 1);
            setRadioLastValue(value);
          }}
        >
          <RadioSelectBoxItem value="apple" label="Apple" suffix={<RadioSelectBoxRadiomark />} />
          <RadioSelectBoxItem value="banana" label="Banana" suffix={<RadioSelectBoxRadiomark />} />
        </RadioSelectBoxRoot>
        <Text align="center">
          onValueChange called: {radioCount} times, last value: {radioLastValue ?? "-"}
        </Text>
      </VStack>
    </HStack>
  );
}
