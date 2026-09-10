import "./styles";

import { useState } from "@lynx-js/react";
import { useSeedClassName, VStack } from "@seed-design/lynx-react";
import {
  FieldButton,
  FieldButtonPlaceholder,
  FieldButtonValue,
} from "@/components/ui/field-button";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [value, setValue] = useState("판교동");

  function selectValue() {
    "background only";
    setValue("정자동");
  }

  function clearValue() {
    "background only";
    setValue("");
  }

  return (
    <view className={`${seedClassName} docs-lynx-input-button-root`}>
      <VStack className="input-button-preview">
        <VStack className="input-button-preview__content">
          <FieldButton
            label="동네"
            showClearButton={value !== ""}
            buttonProps={{
              bindtap: selectValue,
              "accessibility-label": `동네 선택.${value ? ` 현재 동네는 ${value}입니다.` : ""}`,
            }}
            clearButtonProps={{ bindtap: clearValue }}
          >
            {value ? (
              <FieldButtonValue>{value}</FieldButtonValue>
            ) : (
              <FieldButtonPlaceholder>동네를 선택해주세요</FieldButtonPlaceholder>
            )}
          </FieldButton>
        </VStack>
      </VStack>
    </view>
  );
}
