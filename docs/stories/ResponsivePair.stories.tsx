import type { Meta, StoryObj } from "@storybook/nextjs";

import { Box, ResponsivePair } from "@seed-design/react";
import { VariantTable } from "./components/variant-table";
import { SeedThemeDecorator } from "./components/decorator";
import { VIEWPORT_MODES } from "./utils/parameters";

const meta = {
  component: ResponsivePair,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof ResponsivePair>;

export default meta;

type Story = StoryObj<typeof meta>;

const Swatch = ({ label }: { label?: string }) => (
  <Box
    padding="x3"
    bg="bg.informativeWeak"
    color="fg.informativeContrast"
    borderRadius="r2"
    minHeight="48px"
    display="flex"
    alignItems="center"
    justifyContent="center"
  >
    {label}
  </Box>
);

const children: [React.ReactNode, React.ReactNode] = [
  <Swatch key="a" label="AAAAAAAAAAAAAAAAAAAA" />,
  <Swatch key="b" label="BBBBBBBBBBBBBBBBBBBB" />,
];

const conditionMap = {
  wrap: {
    "wrap-reverse": { wrap: "wrap-reverse" as const },
    wrap: { wrap: "wrap" as const },
  },
  gap: {
    none: {},
    fixed: { gap: "x4" },
    responsive: { gap: { base: "x2", md: "x6" } },
  },
  constraint: {
    unconstrained: {},
    "200px": { width: "200px" },
  },
};

export const LightTheme: Story = {
  args: { children },
  render: (args) => (
    <VariantTable
      Component={meta.component}
      variantMap={{}}
      conditionMap={conditionMap}
      {...args}
    />
  ),
  parameters: {
    chromatic: { modes: VIEWPORT_MODES },
  },
};
