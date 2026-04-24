import type { Meta, StoryObj } from "@storybook/nextjs";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "seed-design/ui/accordion";

import { Box, Icon } from "@seed-design/react";
import { accordionVariantMap } from "@seed-design/css/recipes/accordion";
import { IconCalendarLine } from "@karrotmarket/react-monochrome-icon";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";
import { CHROMATIC_PARAMETERS, createStoryWithParameters } from "@/stories/utils/parameters";

const AccordionDemo = (props: React.ComponentProps<typeof Accordion>) => (
  <Accordion {...props} style={{ width: 360 }}>
    <AccordionItem value="item-1">
      <AccordionTrigger prefix={<Icon svg={<IconCalendarLine />} />} title="배송은 얼마나 걸리나요?" />
      <AccordionContent>
        <Box p="x4">
          주문 후 영업일 기준 2-3일 내에 배송됩니다. 지역에 따라 다소 차이가 있을 수 있습니다.
        </Box>
      </AccordionContent>
    </AccordionItem>
    <AccordionItem value="item-2">
      <AccordionTrigger
        title="반품 및 교환은 어떻게 하나요?"
        description="상품 수령 후 7일 이내"
      />
      <AccordionContent>
        <Box p="x4">
          상품 수령 후 7일 이내에 고객센터로 문의해 주세요. 단, 사용 흔적이 있거나 포장이 훼손된 경우
          반품이 제한될 수 있습니다.
        </Box>
      </AccordionContent>
    </AccordionItem>
    <AccordionItem value="item-3">
      <AccordionTrigger title="결제 수단은 어떤 것이 있나요?" />
      <AccordionContent>
        <Box p="x4">
          신용카드, 체크카드, 계좌이체, 간편결제(카카오페이, 네이버페이) 등 다양한 결제 수단을
          지원합니다.
        </Box>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
);

const meta = {
  component: Accordion,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof Accordion>;

export default meta;

type Story = StoryObj<typeof meta>;

const CommonStoryTemplate: Story = {
  args: {},
  render: (args) => (
    <VariantTable Component={AccordionDemo} variantMap={accordionVariantMap} {...args} />
  ),
};

export const LightTheme = CommonStoryTemplate;

export const DarkTheme = createStoryWithParameters<typeof meta>({
  ...CommonStoryTemplate,
  parameters: { theme: "dark" },
});

const AccordionOpenDemo = ({ variant, size }: React.ComponentProps<typeof Accordion>) => (
  <Accordion
    variant={variant}
    size={size}
    type="multiple"
    style={{ width: 360 }}
    defaultValues={["item-1"]}
  >
    <AccordionItem value="item-1">
      <AccordionTrigger prefix={<Icon svg={<IconCalendarLine />} />} title="배송은 얼마나 걸리나요?" />
      <AccordionContent>
        <Box p="x4">
          주문 후 영업일 기준 2-3일 내에 배송됩니다. 지역에 따라 다소 차이가 있을 수 있습니다.
        </Box>
      </AccordionContent>
    </AccordionItem>
    <AccordionItem value="item-2">
      <AccordionTrigger
        title="반품 및 교환은 어떻게 하나요?"
        description="상품 수령 후 7일 이내"
      />
      <AccordionContent>
        <Box p="x4">
          상품 수령 후 7일 이내에 고객센터로 문의해 주세요. 단, 사용 흔적이 있거나 포장이 훼손된 경우
          반품이 제한될 수 있습니다.
        </Box>
      </AccordionContent>
    </AccordionItem>
    <AccordionItem value="item-3">
      <AccordionTrigger title="결제 수단은 어떤 것이 있나요?" />
      <AccordionContent>
        <Box p="x4">
          신용카드, 체크카드, 계좌이체, 간편결제(카카오페이, 네이버페이) 등 다양한 결제 수단을
          지원합니다.
        </Box>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
);

const OpenStoryTemplate: Story = {
  args: {},
  render: (args) => (
    <VariantTable Component={AccordionOpenDemo} variantMap={accordionVariantMap} {...args} />
  ),
};

export const OpenLightTheme = createStoryWithParameters<typeof meta>({
  ...OpenStoryTemplate,
  parameters: {
    chromatic: { ...CHROMATIC_PARAMETERS.chromatic, delay: 500 },
  },
});

export const OpenDarkTheme = createStoryWithParameters<typeof meta>({
  ...OpenStoryTemplate,
  parameters: {
    theme: "dark",
    chromatic: { ...CHROMATIC_PARAMETERS.chromatic, delay: 500 },
  },
});
