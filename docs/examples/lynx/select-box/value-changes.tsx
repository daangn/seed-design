import "./styles";

import { root, useState } from "@lynx-js/react";
import { HStack, VStack, useSeedClassName } from "@seed-design/lynx-react";
import {
  CheckSelectBox,
  CheckSelectBoxCheckmark,
  CheckSelectBoxGroup,
  RadioSelectBoxItem,
  RadioSelectBoxRadiomark,
  RadioSelectBoxRoot,
} from "@/components/ui/select-box";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [checkCount, setCheckCount] = useState(0);
  const [checkLastValue, setCheckLastValue] = useState<boolean | null>(null);
  const [radioCount, setRadioCount] = useState(0);
  const [radioLastValue, setRadioLastValue] = useState<string | null>(null);

  return (
    <page className={seedClassName}>
      <HStack className="select-box-preview" gap="x8" align="center">
        <VStack className="select-box-preview__column" gap="x4" align="center">
          <CheckSelectBoxGroup accessibility-label="Fruit">
            <CheckSelectBox
              label="Apple"
              suffix={<CheckSelectBoxCheckmark />}
              onCheckedChange={(checked) => {
                setCheckCount((previous) => previous + 1);
                setCheckLastValue(checked);
              }}
            />
          </CheckSelectBoxGroup>
          <text className="select-box-preview__status">
            onCheckedChange called: {checkCount} times, last value:{" "}
            {checkLastValue === null ? "-" : JSON.stringify(checkLastValue)}
          </text>
        </VStack>

        <VStack className="select-box-preview__column" gap="x4" align="center">
          <RadioSelectBoxRoot
            defaultValue="apple"
            accessibility-label="Fruit"
            onValueChange={(value) => {
              setRadioCount((previous) => previous + 1);
              setRadioLastValue(value);
            }}
          >
            <RadioSelectBoxItem value="apple" label="Apple" suffix={<RadioSelectBoxRadiomark />} />
            <RadioSelectBoxItem
              value="banana"
              label="Banana"
              suffix={<RadioSelectBoxRadiomark />}
            />
          </RadioSelectBoxRoot>
          <text className="select-box-preview__status">
            onValueChange called: {radioCount} times, last value: {radioLastValue ?? "-"}
          </text>
        </VStack>
      </HStack>
    </page>
  );
}

root.render(<Root />);
