import { Box, HStack, Text } from "@seed-design/react";
import {
  CheckSelectBox,
  CheckSelectBoxCheckmark,
  CheckSelectBoxGroup,
  RadioSelectBoxItem,
  RadioSelectBoxRadioMark,
  RadioSelectBoxRoot,
} from "seed-design/ui/select-box";

export default function SelectBoxCollapsibleFooter() {
  return (
    <HStack gap="x6" align="flex-start">
      <CheckSelectBoxGroup>
        <CheckSelectBox
          label="항상 표시"
          description="footerVisibility를 'always'로 설정하면 항상 보입니다."
          suffix={<CheckSelectBoxCheckmark />}
          footerVisibility="always"
          footer={
            <Box px="x5" pb="x5">
              <Text textStyle="t3StaticMedium">추가 콘텐츠가 여기에 표시됩니다.</Text>
            </Box>
          }
        />
        <CheckSelectBox
          label="선택 시에만 표시 (기본값)"
          description="기본적으로 선택 시에만 footer가 보입니다."
          suffix={<CheckSelectBoxCheckmark />}
          footer={
            <Box px="x5" pb="x5">
              <Text textStyle="t3StaticMedium">이 항목이 선택되었을 때만 보입니다.</Text>
            </Box>
          }
        />
      </CheckSelectBoxGroup>

      <RadioSelectBoxRoot defaultValue="always" aria-label="Footer 예제">
        <RadioSelectBoxItem
          value="always"
          label="항상 표시"
          description="footerVisibility를 'always'로 설정하면 항상 보입니다."
          suffix={<RadioSelectBoxRadioMark />}
          footerVisibility="always"
          footer={
            <Box px="x5" pb="x5">
              <Text textStyle="t3StaticMedium">추가 콘텐츠가 여기에 표시됩니다.</Text>
            </Box>
          }
        />
        <RadioSelectBoxItem
          value="collapsible"
          label="선택 시에만 표시 (기본값)"
          description="기본적으로 선택 시에만 footer가 보입니다."
          suffix={<RadioSelectBoxRadioMark />}
          footer={
            <Box px="x5" pb="x5">
              <Text textStyle="t3StaticMedium">이 항목이 선택되었을 때만 보입니다.</Text>
            </Box>
          }
        />
      </RadioSelectBoxRoot>
    </HStack>
  );
}
