import "./styles";

import { useCallback, useState } from "@lynx-js/react";
import { VStack, useSeedClassName } from "@seed-design/lynx-react";
import {
  FieldButton,
  FieldButtonPlaceholder,
  FieldButtonValue,
} from "@/components/ui/field-button";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [value, setValue] = useState<string | null>(null);
  const selectValue = useCallback(() => {
    "background only";
    setValue("판교동");
  }, []);
  const changeValues = useCallback(([nextValue]: string[]) => {
    "background only";
    setValue(nextValue ?? null);
  }, []);

  return (
    <view className={`${seedClassName} docs-lynx-field-button-root`}>
      <VStack className="field-button-preview">
        <VStack className="field-button-preview__content">
          <FieldButton
            label="동네"
            description="거래할 동네를 선택해 주세요."
            values={value == null ? [] : [value]}
            onValuesChange={changeValues}
            showClearButton={value != null}
            buttonProps={{
              "accessibility-label": value ? `동네 변경. 현재: ${value}` : "동네 선택",
              bindtap: selectValue,
            }}
          >
            {value == null ? (
              <FieldButtonPlaceholder>동네를 선택해 주세요</FieldButtonPlaceholder>
            ) : (
              <FieldButtonValue>{value}</FieldButtonValue>
            )}
          </FieldButton>
        </VStack>
      </VStack>
    </view>
  );
}
