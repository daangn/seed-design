import { VStack } from "@seed-design/react";
import {
  CheckSelectBox,
  CheckSelectBoxCheckmark,
  CheckSelectBoxGroup,
  RadioSelectBoxItem,
  RadioSelectBoxRadioMark,
  RadioSelectBoxRoot,
} from "seed-design/ui/select-box";

export default function SelectBoxCustomizingColumns() {
  return (
    <VStack gap="x6">
      {/* span으로 여러 열 차지 */}
      <CheckSelectBoxGroup columns={2}>
        <CheckSelectBox label="옵션 1" suffix={<CheckSelectBoxCheckmark />} />
        <CheckSelectBox label="옵션 2" suffix={<CheckSelectBoxCheckmark />} />
        <CheckSelectBox label="전체 선택" span={2} suffix={<CheckSelectBoxCheckmark />} />
      </CheckSelectBoxGroup>

      <RadioSelectBoxRoot columns={2} defaultValue="option1" aria-label="Span 예제">
        <RadioSelectBoxItem value="option1" label="옵션 1" suffix={<RadioSelectBoxRadioMark />} />
        <RadioSelectBoxItem value="option2" label="옵션 2" suffix={<RadioSelectBoxRadioMark />} />
        <RadioSelectBoxItem
          value="other"
          label="기타"
          span={2}
          suffix={<RadioSelectBoxRadioMark />}
        />
      </RadioSelectBoxRoot>

      {/* layout을 horizontal로 오버라이드 */}
      <CheckSelectBoxGroup columns={2}>
        <CheckSelectBox
          label="horizontal 유지"
          layout="horizontal"
          suffix={<CheckSelectBoxCheckmark />}
        />
        <CheckSelectBox
          label="horizontal 유지"
          layout="horizontal"
          suffix={<CheckSelectBoxCheckmark />}
        />
      </CheckSelectBoxGroup>
    </VStack>
  );
}
