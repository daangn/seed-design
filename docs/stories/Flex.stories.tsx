import type { Meta, StoryObj } from "@storybook/nextjs";

import { Flex } from "@ride-developer/react";
import { VariantTable } from "./components/variant-table";
import { SeedThemeDecorator } from "./components/decorator";
import { VIEWPORT_MODES } from "./utils/parameters";

const meta = {
  component: Flex,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof Flex>;

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

const manyChildren = (
  <>
    {Array.from({ length: 8 }, (_, i) => (
      <Swatch key={i} label={`${i + 1}`} />
    ))}
  </>
);

const conditionMap = {
  condition: {
    bare: {},
    // not tested here: alignSelf, justifySelf, flexGrow, flexShrink
    "direction row": { direction: "row" },
    "direction column": { direction: "column" },
    gap: { gap: "x4" },
    "align center": { align: "center", height: "200px" },
    "align flex-end": { align: "flex-end", height: "200px" },
    "justify center": { justify: "center", width: "500px" },
    "justify space-between": { justify: "space-between", width: "500px" },
    wrap: { wrap: "wrap", children: manyChildren, width: "200px" },
    "display none": { display: "none" },
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
