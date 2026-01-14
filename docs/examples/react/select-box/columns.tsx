import { HStack } from "@seed-design/react";
import {
  CheckSelectBox,
  CheckSelectBoxCheckmark,
  CheckSelectBoxGroup,
  RadioSelectBoxItem,
  RadioSelectBoxRadioMark,
  RadioSelectBoxRoot,
} from "seed-design/ui/select-box";

export default function SelectBoxColumns() {
  return (
    <HStack gap="x6" align="flex-start">
      <CheckSelectBoxGroup columns={2}>
        <CheckSelectBox label="옵션 1" suffix={<CheckSelectBoxCheckmark />} />
        <CheckSelectBox label="옵션 2" suffix={<CheckSelectBoxCheckmark />} />
        <CheckSelectBox label="옵션 3" suffix={<CheckSelectBoxCheckmark />} />
        <CheckSelectBox label="옵션 4" suffix={<CheckSelectBoxCheckmark />} />
      </CheckSelectBoxGroup>

      <RadioSelectBoxRoot columns={2} defaultValue="option1" aria-label="Grid 레이아웃 예제">
        <RadioSelectBoxItem value="option1" label="옵션 1" suffix={<RadioSelectBoxRadioMark />} />
        <RadioSelectBoxItem value="option2" label="옵션 2" suffix={<RadioSelectBoxRadioMark />} />
        <RadioSelectBoxItem value="option3" label="옵션 3" suffix={<RadioSelectBoxRadioMark />} />
        <RadioSelectBoxItem value="option4" label="옵션 4" suffix={<RadioSelectBoxRadioMark />} />
      </RadioSelectBoxRoot>
    </HStack>
  );
}
