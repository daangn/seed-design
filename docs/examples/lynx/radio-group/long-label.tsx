import "./styles";
import { root } from "@lynx-js/react";
import { RadioGroup, VStack, useSeedClassName } from "@seed-design/lynx-react";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <VStack className="radio-group-preview">
        <RadioGroup.Root defaultValue="medium" size="medium" tone="neutral">
          <RadioGroup.Item value="medium">
            <RadioGroup.ItemControl>
              <RadioGroup.ItemIndicator />
            </RadioGroup.ItemControl>
            <RadioGroup.ItemLabel>
              긴 라벨도 여러 줄로 자연스럽게 표시되어 선택 항목의 내용을 모두 확인할 수 있습니다.
            </RadioGroup.ItemLabel>
          </RadioGroup.Item>
          <RadioGroup.Item value="large">
            <RadioGroup.ItemControl>
              <RadioGroup.ItemIndicator />
            </RadioGroup.ItemControl>
            <RadioGroup.ItemLabel>
              화면 너비가 좁아져도 라디오 마크와 라벨의 정렬을 유지합니다.
            </RadioGroup.ItemLabel>
          </RadioGroup.Item>
        </RadioGroup.Root>
      </VStack>
    </page>
  );
}

root.render(<Root />);
