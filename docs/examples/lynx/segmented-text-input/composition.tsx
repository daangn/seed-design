import "./styles";

import { Field, SegmentedTextInput } from "@seed-design/lynx-react";

export default function Example() {
  return (
    <view className="segmented-text-input-preview">
      <Field.Root>
        <Field.Header>
          <Field.Label>사업자등록번호</Field.Label>
        </Field.Header>
        <SegmentedTextInput.Root>
          <SegmentedTextInput.Segment
            accessibility-label="사업자등록번호 앞 3자리"
            placeholder="000"
            length={3}
          />
          <SegmentedTextInput.Separator> - </SegmentedTextInput.Separator>
          <SegmentedTextInput.Segment
            accessibility-label="사업자등록번호 가운데 2자리"
            placeholder="00"
            length={2}
          />
          <SegmentedTextInput.Separator> - </SegmentedTextInput.Separator>
          <SegmentedTextInput.Segment
            accessibility-label="사업자등록번호 뒤 5자리"
            placeholder="00000"
            length={5}
          />
        </SegmentedTextInput.Root>
      </Field.Root>
    </view>
  );
}
