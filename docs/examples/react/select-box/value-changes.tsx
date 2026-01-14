import { HStack, Text, VStack } from "@seed-design/react";
import {
  CheckSelectBox,
  CheckSelectBoxCheckmark,
  CheckSelectBoxGroup,
  RadioSelectBoxItem,
  RadioSelectBoxRadioMark,
  RadioSelectBoxRoot,
} from "seed-design/ui/select-box";
import { useState } from "react";

export default function SelectBoxValueChanges() {
  const [checkCount, setCheckCount] = useState(0);
  const [checkLastValue, setCheckLastValue] = useState<boolean | null>(null);

  const [radioCount, setRadioCount] = useState(0);
  const [radioLastValue, setRadioLastValue] = useState<string | null>(null);

  return (
    <HStack gap="x6" align="center" width="full">
      <VStack gap="x4" align="center" grow>
        <CheckSelectBoxGroup>
          <CheckSelectBox
            label="Apple"
            suffix={<CheckSelectBoxCheckmark />}
            onCheckedChange={(checked) => {
              setCheckCount((prev) => prev + 1);
              setCheckLastValue(checked);
            }}
          />
        </CheckSelectBoxGroup>
        <Text>
          onCheckedChange called: {checkCount} times, last value: {`${checkLastValue ?? "-"}`}
        </Text>
      </VStack>

      <VStack gap="x4" align="center" grow>
        <RadioSelectBoxRoot
          defaultValue="apple"
          aria-label="Fruit"
          onValueChange={(value) => {
            setRadioCount((prev) => prev + 1);
            setRadioLastValue(value);
          }}
        >
          <RadioSelectBoxItem value="apple" label="Apple" suffix={<RadioSelectBoxRadioMark />} />
          <RadioSelectBoxItem value="banana" label="Banana" suffix={<RadioSelectBoxRadioMark />} />
        </RadioSelectBoxRoot>
        <Text>
          onValueChange called: {radioCount} times, last value: {radioLastValue ?? "-"}
        </Text>
      </VStack>
    </HStack>
  );
}
