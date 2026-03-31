import type { Meta, StoryObj } from "@storybook/nextjs";

import { VStack, HStack } from "@seed-design/react";
import { VariantTable } from "./components/variant-table";
import { SeedThemeDecorator } from "./components/decorator";
import { VIEWPORT_MODES } from "./utils/parameters";

const meta = {
  component: VStack,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof VStack>;

export default meta;

type Story = StoryObj<typeof meta>;

const Swatch = ({ label }: { label?: string }) => (
  <div
    style={{
      width: 48,
      height: 48,
      background: "skyblue",
      borderRadius: 9999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "blue",
      fontSize: 12,
    }}
  >
    {label}
  </div>
);

const children = (
  <>
    <Swatch label="A" />
    <Swatch label="B" />
    <Swatch label="C" />
    <span>test</span>
  </>
);

const vstackConditionMap = {
  condition: {
    bare: {},
    gap: { gap: "x4" },
    "align center": { align: "center", height: "200px" },
    "align flex-end": { align: "flex-end", height: "200px" },
    "justify center": { justify: "center", width: "500px" },
    "justify space-between": { justify: "space-between", width: "500px" },
    wrap: { wrap: "wrap", height: "120px" },
  },
};

export const VStackLightTheme: Story = {
  args: { children },
  render: (args) => (
    <VariantTable Component={VStack} variantMap={{}} conditionMap={vstackConditionMap} {...args} />
  ),
  parameters: {
    chromatic: { modes: VIEWPORT_MODES },
  },
};

const hstackConditionMap = {
  condition: {
    bare: {},
    gap: { gap: "x4" },
    "align center": { align: "center", height: "120px" },
    "align stretch": { align: "stretch", height: "120px" },
    "justify center": { justify: "center", width: "500px" },
    "justify space-between": { justify: "space-between", width: "500px" },
    wrap: { wrap: "wrap", width: "120px" },
  },
};

export const HStackLightTheme: Story = {
  args: { children },
  render: (args) => (
    <VariantTable Component={HStack} variantMap={{}} conditionMap={hstackConditionMap} {...args} />
  ),
  parameters: {
    chromatic: { modes: VIEWPORT_MODES },
  },
};
