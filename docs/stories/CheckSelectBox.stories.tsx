import type { Meta, StoryObj } from "@storybook/nextjs";

import {
  CheckSelectBox,
  CheckSelectBoxCheckmark,
  CheckSelectBoxGroup,
} from "seed-design/ui/select-box";
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
  component: CheckSelectBox,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof CheckSelectBox>;

export default meta;

type Story = StoryObj<typeof meta>;

const CheckSelectBoxWrapper = ({ columns, ...props }: { columns?: number }) => {
  return (
    <CheckSelectBoxGroup columns={columns}>
      <CheckSelectBox label="" {...props} />
      <CheckSelectBox label="" description="보조 설명 텍스트입니다." {...props} />
      <CheckSelectBox label="" prefixIcon={<IconPersonCircleLine />} {...props} />
      <CheckSelectBox
        label=""
        description="보조 설명 텍스트입니다."
        prefixIcon={<IconPersonCircleLine />}
        {...props}
      />
    </CheckSelectBoxGroup>
  );
};

const conditionMap = {
  columns: {
    1: { columns: 1 },
    2: { columns: 2 },
    3: { columns: 3 },
  },
  defaultChecked: {
    false: {
      defaultChecked: false,
    },
    true: {
      defaultChecked: true,
    },
  },
  suffix: {
    checkmark: {
      suffix: <CheckSelectBoxCheckmark />,
    },
    none: {
      suffix: undefined,
    },
  },
};

const CommonStoryTemplate: Story = {
  args: {
    label: "Aliqua veniam ut nisi dolore velit deserunt excepteur adipisicing",
  },
  render: (args) => (
    <VariantTable
      Component={CheckSelectBoxWrapper}
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
    <CheckSelectBoxGroup columns={1}>
      <CheckSelectBox
        prefixIcon={<IconPersonCircleLine />}
        label="선택 시에만 표시 (기본값)"
        description="기본적으로 선택 시에만 footer가 보입니다."
        suffix={<CheckSelectBoxCheckmark />}
        defaultChecked
        footer={
          <Box px="x5" pb="x5">
            <Text textStyle="t3StaticMedium">이 항목이 선택되었을 때만 보입니다.</Text>
          </Box>
        }
      />
      <CheckSelectBox
        prefixIcon={<IconPersonCircleLine />}
        label="항상 표시"
        description="footerVisibility를 'always'로 설정하면 항상 보입니다."
        suffix={<CheckSelectBoxCheckmark />}
        footerVisibility="always"
        footer={
          <Box px="x5" pb="x5">
            <Text textStyle="t3StaticMedium">이 영역을 클릭해도 항목이 선택됩니다.</Text>
          </Box>
        }
      />
      <CheckSelectBox
        prefixIcon={<IconPersonCircleLine />}
        label="긴 내용"
        description="footer에 긴 내용을 넣어도 잘 동작하는지 확인합니다."
        suffix={<CheckSelectBoxCheckmark />}
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
    </CheckSelectBoxGroup>
  ),
};
