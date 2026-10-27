import "./styles";

import { ResidentNumberField } from "@/components/ui/resident-number-field";

export default function Example() {
  return (
    <view className="segmented-text-input-preview">
      <ResidentNumberField label="주민등록번호" />
    </view>
  );
}
