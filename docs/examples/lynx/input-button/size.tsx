import "./styles";

import { useSeedClassName, VStack } from "@seed-design/lynx-react";
import { FieldButton, FieldButtonPlaceholder } from "@/components/ui/field-button";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-input-button-root`}>
      <VStack className="input-button-preview">
        <VStack className="input-button-preview__content" gap="spacingY.componentDefault">
          <FieldButton
            label="라벨"
            description="size=large (default)"
            size="large"
            buttonProps={{ "accessibility-label": "큰 크기 선택 화면 열기" }}
          >
            <FieldButtonPlaceholder>플레이스홀더</FieldButtonPlaceholder>
          </FieldButton>
          <FieldButton
            label="라벨"
            description="size=medium"
            size="medium"
            buttonProps={{ "accessibility-label": "중간 크기 선택 화면 열기" }}
          >
            <FieldButtonPlaceholder>플레이스홀더</FieldButtonPlaceholder>
          </FieldButton>
        </VStack>
      </VStack>
    </view>
  );
}
