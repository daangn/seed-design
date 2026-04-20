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

// Playground for margin `auto` — exercises static, responsive, and multi-breakpoint
// combinations to verify the `var() fallback` pattern at runtime.
const AutoParent = ({
  label,
  description,
  children,
  minHeight,
  display,
}: {
  label: string;
  description: string;
  children: React.ReactNode;
  minHeight?: string;
  display?: "flex";
}) => (
  <Box bg="palette.gray50" p="x4" borderRadius="r2" mb="x3">
    <Box color="palette.gray800" mb="x1" style={{ fontSize: 14, fontWeight: 600 }}>
      {label}
    </Box>
    <Box color="palette.gray600" mb="x3" style={{ fontSize: 12 }}>
      {description}
    </Box>
    <Box
      p="x3"
      borderRadius="r1"
      borderWidth={1}
      borderColor="palette.yellow700"
      bg="palette.yellow100"
      minHeight={minHeight}
      display={display}
    >
      {children}
    </Box>
  </Box>
);

type AutoBoxProps = React.ComponentProps<typeof Box> & { label: string };
const AutoBox = ({ label, ...props }: AutoBoxProps) => (
  <Box
    {...props}
    bg="palette.blue600"
    color="palette.staticWhite"
    p="x3"
    borderRadius="r1"
    width="200px"
    style={{ fontSize: 12, fontFamily: "monospace", textAlign: "center" }}
  >
    {label}
  </Box>
);

export const MarginAutoPlayground: Story = {
  render: () => (
    <Box p="x4" bg="palette.gray25">
      <Box mb="x4" color="palette.gray800" style={{ fontSize: 16, fontWeight: 700 }}>
        Margin auto playground — resize the viewport
      </Box>

      <AutoParent label="1. mx='auto' — static centering" description="Centered at every viewport.">
        <AutoBox mx="auto" label='mx="auto"' />
      </AutoParent>

      <AutoParent label="2. ml='auto' — push to right" description="Flush right at every viewport.">
        <AutoBox ml="auto" label='ml="auto"' />
      </AutoParent>

      <AutoParent
        label="3. mx={{ base: 'auto', md: 0 }}"
        description="Centered below 768px, flush left from md up."
      >
        <AutoBox mx={{ base: "auto", md: 0 }} label="base: auto · md: 0" />
      </AutoParent>

      <AutoParent
        label="4. mx={{ base: 0, md: 'auto' }}"
        description="Flush left below 768px, centered from md up."
      >
        <AutoBox mx={{ base: 0, md: "auto" }} label="base: 0 · md: auto" />
      </AutoParent>

      <AutoParent
        label="5. mx={{ base: 'auto', md: '16px' }}"
        description="Auto and a dimension mixed across breakpoints."
      >
        <AutoBox mx={{ base: "auto", md: "16px" }} label="base: auto · md: 16px" />
      </AutoParent>

      <AutoParent
        label="6. ml={{ base: 'auto', md: 0 }} — asymmetric"
        description="Only left margin responds; right stays at 0."
      >
        <AutoBox ml={{ base: "auto", md: 0 }} label="base: ml=auto · md: ml=0" />
      </AutoParent>

      <AutoParent
        label="7. mx={{ base: 0, sm: '8px', md: 'auto', lg: '16px' }}"
        description="Four values across four breakpoints, auto in the middle."
      >
        <AutoBox
          mx={{ base: 0, sm: "8px", md: "auto", lg: "16px" }}
          label="base:0 · sm:8 · md:auto · lg:16"
        />
      </AutoParent>

      <AutoParent
        label="8. ml='auto' + bleedRight='x5' — cross-direction"
        description="Auto margin on one axis, bleed on the other. Directions disjoint, both apply."
      >
        <AutoBox ml="auto" bleedRight="x5" label='ml="auto" · bleedRight="x5"' />
      </AutoParent>

      <AutoParent
        label="9. my='auto' inside a tall flex parent"
        description="Vertical centering via flex + auto."
        minHeight="200px"
        display="flex"
      >
        <AutoBox my="auto" label='my="auto"' />
      </AutoParent>

      <AutoParent label="10. no margin (default)" description="Baseline regression check.">
        <AutoBox label="default" />
      </AutoParent>
    </Box>
  ),
  parameters: {
    chromatic: { modes: VIEWPORT_MODES },
  },
};
