import preview from "../.storybook/preview";

import { Box, ResponsivePair } from "@seed-design/react";
import { VariantTable } from "./components/variant-table";
import { SeedThemeDecorator } from "./components/decorator";
import { VISUAL_VIEWPORT_PARAMETERS } from "./utils/parameters";

const meta = preview.meta({
  component: ResponsivePair,
  decorators: [SeedThemeDecorator],
});

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

export const LightTheme = meta.story({
  args: { children },
  render: (args, { component }) => (
    <VariantTable Component={component!} variantMap={{}} conditionMap={conditionMap} {...args} />
  ),
  parameters: {
    ...VISUAL_VIEWPORT_PARAMETERS,
  },
});
