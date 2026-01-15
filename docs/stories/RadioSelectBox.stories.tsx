import type { Meta, StoryObj } from "@storybook/nextjs";

import { RadioSelectBoxItem, RadioSelectBoxRoot } from "seed-design/ui/select-box";
import {
  IconBarchartSquareLine,
  IconCheckmarkCircleLine,
  IconPersonCircleLine,
  IconPhoneXmarkLine,
} from "@karrotmarket/react-monochrome-icon";
import { Box, Divider, HStack, Icon, Text, VStack } from "@seed-design/react";

import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";
import { createStoryWithParameters } from "@/stories/utils/parameters";
import { IdentityPlaceholder } from "seed-design/ui/identity-placeholder";

const meta = {
  component: RadioSelectBoxRoot,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof RadioSelectBoxRoot>;

export default meta;

type Story = StoryObj<typeof meta>;

const RadioSelectBoxWrapper = ({ columns, ...props }: { columns?: number }) => {
  return (
    <RadioSelectBoxRoot columns={columns} defaultValue="item1" aria-label="선택 상자 예시">
      <RadioSelectBoxItem value="item1" label="" {...props} />
      <RadioSelectBoxItem value="item2" label="" description="보조 설명 텍스트입니다." {...props} />
      <RadioSelectBoxItem value="item3" label="" prefixIcon={<IconPersonCircleLine />} {...props} />
      <RadioSelectBoxItem
        value="item4"
        label=""
        description="보조 설명 텍스트입니다."
        prefixIcon={<IconPersonCircleLine />}
        {...props}
      />
    </RadioSelectBoxRoot>
  );
};

const conditionMap = {
  columns: {
    1: { columns: 1 },
    2: { columns: 2 },
    3: { columns: 3 },
  },
  disabled: {
    false: {
      disabled: false,
    },
    true: {
      disabled: true,
    },
  },
};

const CommonStoryTemplate: Story = {
  args: {
    label: "Aliqua veniam ut nisi dolore velit deserunt excepteur adipisicing",
  },
  render: (args) => (
    <VariantTable
      Component={RadioSelectBoxWrapper}
      variantMap={{}}
      conditionMap={conditionMap}
      {...args}
    />
  ),
};

export const LightTheme = CommonStoryTemplate;

export const DarkTheme = createStoryWithParameters({
  ...CommonStoryTemplate,
  parameters: { theme: "dark" },
});

export const FontScalingExtraSmall = createStoryWithParameters({
  ...CommonStoryTemplate,
  parameters: { fontScale: "Extra Small" },
});

export const FontScalingExtraExtraExtraLarge = createStoryWithParameters({
  ...CommonStoryTemplate,
  parameters: { fontScale: "Extra Extra Extra Large" },
});

export const CollapsibleFooter: Story = {
  args: {
    label: "Footer 테스트",
  },
  render: () => (
    <RadioSelectBoxRoot columns={1} defaultValue="item1" aria-label="Footer 테스트">
      <RadioSelectBoxItem
        prefixIcon={<IconPersonCircleLine />}
        value="item1"
        label="선택 시에만 표시 (기본값)"
        description="기본적으로 선택 시에만 footer가 보입니다."
        footer={
          <Box px="x5" pb="x5">
            <Text textStyle="t3StaticMedium">이 항목이 선택되었을 때만 보입니다.</Text>
          </Box>
        }
      />
      <RadioSelectBoxItem
        prefixIcon={<IconPersonCircleLine />}
        value="item2"
        label="항상 표시"
        description="footerVisibility를 'always'로 설정하면 항상 보입니다."
        footerVisibility="always"
        footer={
          <Box px="x5" pb="x5">
            <Text textStyle="t3StaticMedium">이 영역을 클릭해도 항목이 선택됩니다.</Text>
          </Box>
        }
      />
      <RadioSelectBoxItem
        prefixIcon={<IconPersonCircleLine />}
        value="item3"
        label="긴 내용"
        description="footer에 긴 내용을 넣어도 잘 동작하는지 확인합니다."
        footer={
          <VStack gap="x3" pb="x5" px="x5">
            <Divider color="stroke.neutralMuted" as="div" />
            <HStack align="center" gap="x1_5">
              <Icon svg={<IconBarchartSquareLine />} size="x5" />
              <Text textStyle="t5Bold">견적 예시</Text>
            </HStack>
            <VStack gap="x2">
              <HStack align="center" gap="x1_5">
                <HStack
                  width="x8"
                  height="x8"
                  borderRadius="full"
                  overflowX="hidden"
                  overflowY="hidden"
                >
                  <IdentityPlaceholder identity="person" />
                </HStack>
                <VStack flexGrow>
                  <HStack justify="space-between" align="center">
                    <Text textStyle="t5Bold">1,640만원</Text>
                    <Text textStyle="t4Medium" color="fg.neutralMuted">
                      개인
                    </Text>
                  </HStack>
                </VStack>
              </HStack>
              <HStack align="center" gap="x1_5">
                <HStack
                  width="x8"
                  height="x8"
                  borderRadius="full"
                  overflowX="hidden"
                  overflowY="hidden"
                >
                  <IdentityPlaceholder identity="person" />
                </HStack>
                <VStack flexGrow>
                  <HStack justify="space-between" align="center">
                    <Text textStyle="t5Bold">1,540만원</Text>
                    <Text textStyle="t4Medium" color="fg.neutralMuted">
                      딜러
                    </Text>
                  </HStack>
                </VStack>
              </HStack>
              <HStack align="center" gap="x1_5">
                <HStack
                  width="x8"
                  height="x8"
                  borderRadius="full"
                  overflowX="hidden"
                  overflowY="hidden"
                >
                  <IdentityPlaceholder identity="person" />
                </HStack>
                <VStack flexGrow>
                  <HStack justify="space-between" align="center">
                    <Text textStyle="t5Bold">1,540만원</Text>
                    <Text textStyle="t4Medium" color="fg.neutralMuted">
                      개인
                    </Text>
                  </HStack>
                </VStack>
              </HStack>
            </VStack>
            <VStack gap="x2">
              <HStack align="center" gap="x1">
                <Icon svg={<IconPhoneXmarkLine />} size="x4" color="fg.neutralMuted" />
                <Text textStyle="t3Medium" color="fg.neutralMuted">
                  딜러와 연락 없이 가격만 받아볼 수 있어요.
                </Text>
              </HStack>
              <HStack align="center" gap="x1">
                <Icon svg={<IconCheckmarkCircleLine />} size="x4" color="fg.neutralMuted" />
                <Text textStyle="t3Medium" color="fg.neutralMuted">
                  원할 때 원하는 사람에게 판매하면 돼요.
                </Text>
              </HStack>
            </VStack>
          </VStack>
        }
      />
    </RadioSelectBoxRoot>
  ),
};
