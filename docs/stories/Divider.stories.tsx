import type { Meta, StoryObj } from "@storybook/nextjs";

import { Box, Divider, HStack, VStack } from "@seed-design/react";
import type { ComponentProps } from "react";

import { createStoryWithParameters } from "@/stories/utils/parameters";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";

const DividerPreview = ({
  orientation = "horizontal",
  inset,
  thickness,
}: Pick<ComponentProps<typeof Divider>, "orientation" | "inset" | "thickness">) => {
  if (orientation === "vertical") {
    return (
      <HStack height="x16" align="stretch" bg="bg.layerDefault">
        <Box bg="palette.blue400" width="x12" />
        <Divider orientation="vertical" inset={inset} thickness={thickness} />
        <Box bg="palette.blue400" width="x12" />
      </HStack>
    );
  }

  return (
    <VStack width="200px" bg="bg.layerDefault">
      <Box bg="palette.blue400" height="x8" />
      <Divider inset={inset} thickness={thickness} />
      <Box bg="palette.blue400" height="x8" />
    </VStack>
  );
};

const meta = {
  component: DividerPreview,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof DividerPreview>;

export default meta;

type Story = StoryObj<typeof meta>;

const conditionMap = {
  inset: {
    false: { inset: false },
    true: { inset: true },
  },
  thickness: {
    "1px": { thickness: 1 },
    "4px": { thickness: "4px" },
  },
};

const CommonStoryTemplate: Story = {
  render: (args) => (
    <VariantTable
      Component={meta.component}
      variantMap={{ orientation: ["horizontal", "vertical"] }}
      conditionMap={conditionMap}
      {...args}
    />
  ),
};

export const LightTheme = CommonStoryTemplate;

export const DarkTheme = createStoryWithParameters({
  ...CommonStoryTemplate,
  parameters: { theme: "dark" },
});

export const FontScalingExtraSmall = createStoryWithParameters({
  ...CommonStoryTemplate,
  parameters: { fontScale: "Extra Small" },
});

export const FontScalingExtraExtraExtraLarge = createStoryWithParameters({
  ...CommonStoryTemplate,
  parameters: { fontScale: "Extra Extra Extra Large" },
});
