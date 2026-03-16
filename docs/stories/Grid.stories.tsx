import type { Meta, StoryObj } from "@storybook/nextjs";

import { Grid, GridItem } from "@seed-design/react";
import { VariantTable } from "./components/variant-table";
import { SeedThemeDecorator } from "./components/decorator";

const meta = {
  component: Grid,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof Grid>;

export default meta;

type Story = StoryObj<typeof meta>;

const Swatch = ({ label }: { label?: string }) => (
  <div
    style={{
      minWidth: 48,
      minHeight: 48,
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
    <Swatch label="1" />
    <Swatch label="2" />
    <Swatch label="3" />
    <Swatch label="4" />
    <Swatch label="5" />
    <Swatch label="6" />
  </>
);

const conditionMap = {
  condition: {
    bare: {},
    // not tested here: alignItems, justifyItems, autoFlow
    "columns number": { columns: 3 },
    "columns string": { columns: "1fr 2fr" },
    "rows number": { rows: 2 },
    "rows string": { rows: "100px auto" },
    gap: { columns: 3, gap: "x4" },
    autoRows: { columns: 3, autoRows: "80px" },
    autoColumns: { autoFlow: "column", autoColumns: "120px" },
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
};

/** GridItem: colSpan, rowSpan, colStart/colEnd */
export const GridItemSpan: Story = {
  render: () => (
    <Grid columns={3} gap="8px" width="400px">
      <GridItem colSpan={2}>
        <Swatch label="col×2" />
      </GridItem>
      <Swatch label="1" />
      <GridItem colSpan="full">
        <Swatch label="full" />
      </GridItem>
      <GridItem colStart={2} colEnd={4}>
        <Swatch label="2→4" />
      </GridItem>
      <GridItem rowSpan={2}>
        <Swatch label="row×2" />
      </GridItem>
      <Swatch label="1" />
      <Swatch label="1" />
      <Swatch label="1" />
    </Grid>
  ),
};
