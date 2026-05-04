import type { Meta, StoryObj } from "@storybook/nextjs";

import { Layout, Box } from "@seed-design/react";
import { layoutVariantMap } from "@seed-design/css/recipes/layout";
import { VariantTable } from "./components/variant-table";
import { SeedThemeDecorator } from "./components/decorator";
import { VIEWPORT_MODES } from "./utils/parameters";

const meta = {
  component: Layout.Root,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof Layout.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

const Placeholder = ({ label, height }: { label: string; height?: string }) => (
  <Box
    bg="bg.informativeWeak"
    color="fg.informativeContrast"
    display="flex"
    alignItems="center"
    justifyContent="center"
    borderRadius="r2"
    width="full"
    minHeight={height ?? "x8"}
    padding="x4"
  >
    {label}
  </Box>
);

const children = (
  <Layout.Content>
    <Box display="flex" flexDirection="column" gap="x4">
      <Placeholder label="Header" height="x10" />
      <Placeholder label="Content" height="200px" />
      <Placeholder label="Footer" height="x10" />
    </Box>
  </Layout.Content>
);

export const LightTheme: Story = {
  args: {
    children,
    style: { width: "100%", height: "400px", border: "1px solid var(--seed-color-stroke-neutralWeak)" },
  },
  render: (args) => (
    <VariantTable Component={meta.component} variantMap={layoutVariantMap} {...args} />
  ),
  parameters: {
    chromatic: { modes: VIEWPORT_MODES },
  },
};
