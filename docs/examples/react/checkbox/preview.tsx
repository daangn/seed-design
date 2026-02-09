import { VStack } from "@seed-design/react";
import { Checkbox, CheckboxGroup } from "seed-design/ui/checkbox";

export default function CheckboxPreview() {
  return (
    <VStack p="x6">
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
  );
}
