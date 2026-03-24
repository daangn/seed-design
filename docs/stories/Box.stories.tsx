import type { Meta, StoryObj } from "@storybook/nextjs";

import { Box } from "@seed-design/react";
import { VariantTable } from "./components/variant-table";
import { SeedThemeDecorator } from "./components/decorator";
import { VIEWPORT_MODES } from "./utils/parameters";

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
    padding: { padding: "x4" },
    "px/py": { px: "x6", py: "x2" },
    "width/height": { width: "200px", height: "80px" },
    "width full": { width: "full", borderWidth: 1, borderColor: "palette.gray900" },
    minHeight: { minHeight: "300px", borderWidth: 1, borderColor: "palette.gray900" },
    minWidth: { minWidth: "100px", borderWidth: 1, borderColor: "palette.gray900" },
    maxHeight: { maxHeight: "x5", borderWidth: 1, borderColor: "palette.gray900" },
    maxWidth: { maxWidth: "x5", borderWidth: 1, borderColor: "palette.gray900" },
    bg: { bg: "palette.gray600" },
    bgGradient: { bgGradient: "highlightMagic", bgGradientDirection: "to right" },
    border: {
      borderWidth: 4,
      borderColor: "palette.red600",
      borderRadius: "r4",
      borderRightWidth: 16,
      borderBottomRightRadius: "r2",
    },
    shadow: { boxShadow: "s3" },
    "overflow hidden": {
      width: "x5",
      height: "x5",
      overflowX: "hidden",
      overflowY: "hidden",
    },
    bleedX: { bleedX: "x4" },
    color: { color: "fg.brand" },
    "responsive padding": { padding: { base: "x2", md: "x6" } },
    "responsive display": { display: { base: "none", md: "block" } },
    "hideFrom md": { hideFrom: "md" },
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

const Placeholder = ({ label }: { label: string }) => (
  <Box
    bg="bg.informativeWeak"
    color="fg.informativeContrast"
    display="flex"
    alignItems="center"
    justifyContent="center"
    borderRadius="r2"
    width="full"
    minWidth="x8"
    height="full"
    minHeight="x8"
  >
    {label}
  </Box>
);

const nestedConditionMap = {
  condition: {
    layout: {
      display: "flex",
      flexDirection: "row",
      gap: "x6",
      width: "full",
      height: "200px",
      children: (
        <>
          <Box width="200px" height="full">
            <Placeholder label="200px" />
          </Box>
          <Box flexGrow>
            <Placeholder label="grow" />
          </Box>
        </>
      ),
    },
    "nested stacks": {
      display: "flex",
      flexDirection: "column",
      gap: "x8",
      children: (
        <>
          <Box display="flex" flexDirection="row" gap="x4">
            <Placeholder label="A1" />
            <Placeholder label="A2" />
            <Placeholder label="A3" />
          </Box>
          <Box display="flex" flexDirection="row" gap="x4">
            <Placeholder label="B1" />
            <Placeholder label="B2" />
          </Box>
        </>
      ),
    },
    "layout (responsive)": {
      display: "flex",
      flexDirection: { base: "column", md: "row" },
      gap: { base: "x3", md: "x6" },
      width: "full",
      height: "200px",
      children: (
        <>
          <Box width={{ base: "full", md: "200px" }} height={{ base: "40px", md: "full" }}>
            <Placeholder label="200px on md" />
          </Box>
          <Box flexGrow>
            <Placeholder label="grow" />
          </Box>
        </>
      ),
    },
    "nested stacks (responsive)": {
      display: "flex",
      flexDirection: "column",
      gap: { base: "x2", md: "x8" },
      children: (
        <>
          <Box display="flex" flexDirection="row" gap={{ base: "x1", md: "x4" }}>
            <Placeholder label="A1" />
            <Placeholder label="A2" />
            <Placeholder label="A3" />
          </Box>
          <Box display="flex" flexDirection="row" gap={{ base: "x1", md: "x4" }}>
            <Placeholder label="B1" />
            <Placeholder label="B2" />
          </Box>
        </>
      ),
    },
  },
};

export const Nested: Story = {
  render: (args) => (
    <VariantTable
      Component={meta.component}
      variantMap={{}}
      conditionMap={nestedConditionMap}
      {...args}
    />
  ),
  parameters: {
    chromatic: { modes: VIEWPORT_MODES },
  },
};
