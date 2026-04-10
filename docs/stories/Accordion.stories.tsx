import type { Meta, StoryObj } from "@storybook/nextjs";

import { AccordionRoot } from "seed-design/ui/accordion";
import { Accordion } from "seed-design/ui/accordion";

import { accordionVariantMap } from "@seed-design/css/recipes/accordion";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";

const AccordionDemo = (props: React.ComponentProps<typeof AccordionRoot>) => (
  <Accordion {...props} style={{ width: 360 }}>
    <Accordion.Item value="item-1">
      <Accordion.Trigger>
        <Accordion.Title>배송은 얼마나 걸리나요?</Accordion.Title>
      </Accordion.Trigger>
      <Accordion.Content>
        주문 후 영업일 기준 2-3일 내에 배송됩니다. 지역에 따라 다소 차이가 있을 수 있습니다.
      </Accordion.Content>
    </Accordion.Item>
    <Accordion.Item value="item-2">
      <Accordion.Trigger>
        <Accordion.Title>반품 및 교환은 어떻게 하나요?</Accordion.Title>
        <Accordion.Description>상품 수령 후 7일 이내</Accordion.Description>
      </Accordion.Trigger>
      <Accordion.Content>
        상품 수령 후 7일 이내에 고객센터로 문의해 주세요. 단, 사용 흔적이 있거나 포장이 훼손된 경우
        반품이 제한될 수 있습니다.
      </Accordion.Content>
    </Accordion.Item>
    <Accordion.Item value="item-3">
      <Accordion.Trigger>
        <Accordion.Title>결제 수단은 어떤 것이 있나요?</Accordion.Title>
      </Accordion.Trigger>
      <Accordion.Content>
        신용카드, 체크카드, 계좌이체, 간편결제(카카오페이, 네이버페이) 등 다양한 결제 수단을
        지원합니다.
      </Accordion.Content>
    </Accordion.Item>
  </Accordion>
);

const meta = {
  component: AccordionRoot,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof AccordionRoot>;

export default meta;

type Story = StoryObj<typeof meta>;

const CommonStoryTemplate: Story = {
  args: {},
  render: (args) => (
    <VariantTable Component={AccordionDemo} variantMap={accordionVariantMap} {...args} />
  ),
};

export const LightTheme = CommonStoryTemplate;

export const DarkTheme: Story = {
  ...CommonStoryTemplate,
  parameters: { theme: "dark" },
};

const AccordionOpenDemo = ({ variant, size }: React.ComponentProps<typeof AccordionRoot>) => (
  <Accordion
    variant={variant}
    size={size}
    type="multiple"
    style={{ width: 360 }}
    defaultValue={["item-1"]}
  >
    <Accordion.Item value="item-1">
      <Accordion.Trigger>
        <Accordion.Title>배송은 얼마나 걸리나요?</Accordion.Title>
      </Accordion.Trigger>
      <Accordion.Content>
        주문 후 영업일 기준 2-3일 내에 배송됩니다. 지역에 따라 다소 차이가 있을 수 있습니다.
      </Accordion.Content>
    </Accordion.Item>
    <Accordion.Item value="item-2">
      <Accordion.Trigger>
        <Accordion.Title>반품 및 교환은 어떻게 하나요?</Accordion.Title>
        <Accordion.Description>상품 수령 후 7일 이내</Accordion.Description>
      </Accordion.Trigger>
      <Accordion.Content>
        상품 수령 후 7일 이내에 고객센터로 문의해 주세요. 단, 사용 흔적이 있거나 포장이 훼손된 경우
        반품이 제한될 수 있습니다.
      </Accordion.Content>
    </Accordion.Item>
    <Accordion.Item value="item-3">
      <Accordion.Trigger>
        <Accordion.Title>결제 수단은 어떤 것이 있나요?</Accordion.Title>
      </Accordion.Trigger>
      <Accordion.Content>
        신용카드, 체크카드, 계좌이체, 간편결제(카카오페이, 네이버페이) 등 다양한 결제 수단을
        지원합니다.
      </Accordion.Content>
    </Accordion.Item>
  </Accordion>
);

const OpenStoryTemplate: Story = {
  args: {},
  render: (args) => (
    <VariantTable Component={AccordionOpenDemo} variantMap={accordionVariantMap} {...args} />
  ),
};

export const OpenLightTheme: Story = {
  ...OpenStoryTemplate,
  parameters: {
    chromatic: { delay: 500, pauseAnimationAtEnd: true },
  },
};

export const OpenDarkTheme: Story = {
  ...OpenStoryTemplate,
  parameters: {
    theme: "dark",
    chromatic: { delay: 500, pauseAnimationAtEnd: true },
  },
};
