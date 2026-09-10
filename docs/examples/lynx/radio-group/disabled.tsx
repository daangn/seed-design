import "./styles";
import { root } from "@lynx-js/react";
import { RadioGroup, VStack, useSeedClassName } from "@seed-design/lynx-react";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <VStack className="radio-group-preview" gap="x8">
        <RadioGroup.Root defaultValue="option1" size="large" tone="neutral">
          <RadioGroup.Item value="option1">
            <RadioGroup.ItemControl>
              <RadioGroup.ItemIndicator />
            </RadioGroup.ItemControl>
            <RadioGroup.ItemLabel>활성 옵션</RadioGroup.ItemLabel>
          </RadioGroup.Item>
          <RadioGroup.Item value="option2" disabled>
            <RadioGroup.ItemControl>
              <RadioGroup.ItemIndicator />
            </RadioGroup.ItemControl>
            <RadioGroup.ItemLabel>비활성 옵션</RadioGroup.ItemLabel>
          </RadioGroup.Item>
        </RadioGroup.Root>
        <RadioGroup.Root defaultValue="all-disabled" size="large" tone="neutral" disabled>
          <RadioGroup.Item value="all-disabled">
            <RadioGroup.ItemControl>
              <RadioGroup.ItemIndicator />
            </RadioGroup.ItemControl>
            <RadioGroup.ItemLabel>그룹 전체 비활성</RadioGroup.ItemLabel>
          </RadioGroup.Item>
          <RadioGroup.Item value="unavailable">
            <RadioGroup.ItemControl>
              <RadioGroup.ItemIndicator />
            </RadioGroup.ItemControl>
            <RadioGroup.ItemLabel>선택할 수 없음</RadioGroup.ItemLabel>
          </RadioGroup.Item>
        </RadioGroup.Root>
      </VStack>
    </page>
  );
}

root.render(<Root />);
