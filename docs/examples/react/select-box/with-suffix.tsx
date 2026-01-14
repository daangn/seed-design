import { IconPersonCircleLine, IconStarFill } from "@karrotmarket/react-monochrome-icon";
import { Box, Text, VStack } from "@seed-design/react";
import {
  CheckSelectBox,
  CheckSelectBoxCheckmark,
  CheckSelectBoxGroup,
  RadioSelectBoxItem,
  RadioSelectBoxRadioMark,
  RadioSelectBoxRoot,
} from "seed-design/ui/select-box";

export default function SelectBoxWithSuffix() {
  return (
    <VStack gap="x6">
      {/* suffix 없음 */}
      <CheckSelectBoxGroup>
        <CheckSelectBox label="suffix 없음" />
        <CheckSelectBox label="suffix 없음" description="기본 스타일" />
      </CheckSelectBoxGroup>

      {/* CheckSelectBoxCheckmark / RadioSelectBoxRadioMark 사용 */}
      <CheckSelectBoxGroup>
        <CheckSelectBox label="체크마크" suffix={<CheckSelectBoxCheckmark />} />
        <CheckSelectBox
          label="아이콘과 함께"
          description="prefixIcon과 suffix를 함께 사용"
          prefixIcon={<IconPersonCircleLine />}
          suffix={<CheckSelectBoxCheckmark />}
        />
      </CheckSelectBoxGroup>

      <RadioSelectBoxRoot defaultValue="radio1" aria-label="RadioMark 예제">
        <RadioSelectBoxItem
          value="radio1"
          label="라디오 마크"
          suffix={<RadioSelectBoxRadioMark />}
        />
        <RadioSelectBoxItem
          value="radio2"
          label="아이콘과 함께"
          description="prefixIcon과 suffix를 함께 사용"
          prefixIcon={<IconPersonCircleLine />}
          suffix={<RadioSelectBoxRadioMark />}
        />
      </RadioSelectBoxRoot>

      {/* 커스텀 suffix */}
      <CheckSelectBoxGroup>
        <CheckSelectBox
          label="커스텀 suffix"
          description="아이콘이나 텍스트 등 자유롭게 사용 가능"
          suffix={<IconStarFill width={20} height={20} color="var(--seed-color-fg-brand)" />}
        />
        <CheckSelectBox
          label="텍스트 suffix"
          suffix={
            <Box pr="x2">
              <Text textStyle="t4Medium" color="fg.neutral">
                +1,000원
              </Text>
            </Box>
          }
        />
      </CheckSelectBoxGroup>
    </VStack>
  );
}
