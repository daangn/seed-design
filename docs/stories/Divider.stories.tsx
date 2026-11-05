import preview from "../.storybook/preview";
import { Box, Divider, HStack, VStack } from "@seed-design/react";
import type { ComponentProps } from "react";

import { withVisualTestParameters } from "@/stories/utils/parameters";
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

const meta = preview.meta({
  component: DividerPreview,
  decorators: [SeedThemeDecorator],
});
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

const CommonStoryTemplate = meta.story({
  render: (args, { component }) => (
    <VariantTable
      Component={component!}
      variantMap={{ orientation: ["horizontal", "vertical"] }}
      conditionMap={conditionMap}
      {...args}
    />
  ),
});

export const LightTheme = CommonStoryTemplate.extend({});

export const DarkTheme = CommonStoryTemplate.extend({
  parameters: withVisualTestParameters({ theme: "dark" }),
});

export const FontScalingExtraSmall = CommonStoryTemplate.extend({
  parameters: withVisualTestParameters({ fontScale: "Extra Small" }),
});

export const FontScalingExtraExtraExtraLarge = CommonStoryTemplate.extend({
  parameters: withVisualTestParameters({ fontScale: "Extra Extra Extra Large" }),
});
