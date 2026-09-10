import "./styles";

import { VStack, useSeedClassName } from "@seed-design/lynx-react";
import { Checkbox, CheckboxGroup } from "@/components/ui/checkbox";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-checkbox-root`}>
      <VStack className="checkbox-preview">
        <CheckboxGroup
          label="관심 분야"
          description="관심 있는 분야를 모두 선택해 주세요."
          indicator="선택"
        >
          <Checkbox label="디자인" tone="neutral" size="large" />
          <Checkbox label="개발" tone="neutral" size="large" defaultChecked />
          <Checkbox label="마케팅" tone="neutral" size="large" />
        </CheckboxGroup>
      </VStack>
    </view>
  );
}
