import { VStack } from "@seed-design/react";
import {
  CheckSelectBox,
  CheckSelectBoxCheckmark,
  CheckSelectBoxGroup,
  RadioSelectBoxItem,
  RadioSelectBoxRadioMark,
  RadioSelectBoxRoot,
} from "seed-design/ui/select-box";
import { IconForkSpoonLine } from "@karrotmarket/react-monochrome-icon";

export default function SelectBoxCustomizingColumns() {
  return (
    <VStack gap="x6">
      {/* span으로 여러 열 차지 */}
      <CheckSelectBoxGroup columns={2}>
        {/* layout을 horizontal로 오버라이드 */}
        <CheckSelectBox
          prefixIcon={<IconForkSpoonLine />}
          label="옵션 1"
          span={2}
          layout="horizontal"
          suffix={<CheckSelectBoxCheckmark />}
        />
        <CheckSelectBox
          prefixIcon={<IconForkSpoonLine />}
          label="옵션 2"
          suffix={<CheckSelectBoxCheckmark />}
        />
        <CheckSelectBox
          prefixIcon={<IconForkSpoonLine />}
          label="옵션 3"
          suffix={<CheckSelectBoxCheckmark />}
        />
      </CheckSelectBoxGroup>

      <RadioSelectBoxRoot columns={2} defaultValue="option1" aria-label="Span 예제">
        <RadioSelectBoxItem
          value="option1"
          label="옵션 1"
          span={2}
          layout="horizontal"
          suffix={<RadioSelectBoxRadioMark />}
        />
        <RadioSelectBoxItem value="option2" label="옵션 2" suffix={<RadioSelectBoxRadioMark />} />
        <RadioSelectBoxItem value="option3" label="옵션 3" suffix={<RadioSelectBoxRadioMark />} />
      </RadioSelectBoxRoot>
    </VStack>
  );
}
