import type { Meta, StoryObj } from "@storybook/nextjs";

import { Box } from "@seed-design/react";
import { VariantTable } from "./components/variant-table";
import { SeedThemeDecorator } from "./components/decorator";

const meta = {
  component: Box,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof Box>;

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

const conditionMap = {
  condition: {
    bare: {},
    // not tested here: inset(t/r/b/l), position, display, zIndex
    "padding": { padding: "x4" },
    "px/py": { px: "x6", py: "x2" },
    "width/height": { width: "200px", height: "80px" },
    "width full": { width: "full", borderWidth: 1, borderColor: "palette.gray900" },
    "minHeight": { minHeight: "300px", borderWidth: 1, borderColor: "palette.gray900" },
    "minWidth": { minWidth: "100px", borderWidth: 1, borderColor: "palette.gray900" },
    "maxHeight": { maxHeight: "x5", borderWidth: 1, borderColor: "palette.gray900" },
    "maxWidth": { maxWidth: "x5", borderWidth: 1, borderColor: "palette.gray900" },
    "bg": { bg: "palette.gray600" },
    "bgGradient": { bgGradient: "highlightMagic", bgGradientDirection: "to right" },
    "border": {
      borderWidth: 4,
      borderColor: "palette.red600",
      borderRadius: "r4",
      borderRightWidth: 16,
      borderBottomRightRadius: "r2",
    },
    "shadow": { boxShadow: "s3" },
    "overflow hidden": {
      width: "x5",
      height: "x5",
      overflowX: "hidden",
      overflowY: "hidden",
    },
    "bleedX": { bleedX: "x4" },
    "color": { color: "fg.brand" },
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
};
