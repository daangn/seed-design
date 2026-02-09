import { IconPersonCircleLine } from "@karrotmarket/react-monochrome-icon";
import { Text, HStack, Box } from "@seed-design/react";
import {
  CheckSelectBox,
  CheckSelectBoxCheckmark,
  CheckSelectBoxGroup,
  RadioSelectBoxItem,
  RadioSelectBoxRadiomark,
  RadioSelectBoxRoot,
} from "seed-design/ui/select-box";

export default function SelectBoxWithSuffix() {
  return (
    <HStack gap="x8">
      <CheckSelectBoxGroup aria-label="Suffix 예제">
        <CheckSelectBox label="체크마크" suffix={<CheckSelectBoxCheckmark />} />
        <CheckSelectBox
          label="텍스트 suffix"
          suffix={
            <Box flexShrink={0}>
              <Text textStyle="t4Medium" color="fg.neutral">
                +1,000원
              </Text>
            </Box>
          }
        />
        <CheckSelectBox
          label="suffix 없음"
          description="Commodo aliquip fugiat aute irure."
          prefixIcon={<IconPersonCircleLine />}
        />
      </CheckSelectBoxGroup>
      <RadioSelectBoxRoot defaultValue="radiomark" aria-label="Radiomark 예제">
        <RadioSelectBoxItem
          value="radiomark"
          label="라디오 마크"
          suffix={<RadioSelectBoxRadiomark />}
        />
        <RadioSelectBoxItem
          value="text"
          label="텍스트 suffix"
          description="Commodo aliquip fugiat aute irure."
          suffix={
            <Box flexShrink={0}>
              <Text textStyle="t4Medium" color="fg.neutral">
                +1,000원
              </Text>
            </Box>
          }
        />
        <RadioSelectBoxItem
          value="none"
          label="suffix 없음"
          suffix={undefined}
          prefixIcon={<IconPersonCircleLine />}
        />
      </RadioSelectBoxRoot>
    </HStack>
  );
}
