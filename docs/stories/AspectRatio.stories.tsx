import preview from "../.storybook/preview";
import { AspectRatio, Text } from "@seed-design/react";

import { createStoryParameters } from "@/stories/utils/parameters";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";

const AspectRatioPreview = ({ ratio = 4 / 3, label }: { ratio?: number; label?: string }) => (
  <AspectRatio ratio={ratio} width="160px" bg="palette.gray100">
    <Text color="palette.gray700" textStyle="t5Bold">
      {label}
    </Text>
  </AspectRatio>
);

const meta = preview.meta({
  component: AspectRatioPreview,
  decorators: [SeedThemeDecorator],
});
const conditionMap = {
  ratio: {
    "1 / 1": { ratio: 1, label: "1 / 1" },
    "4 / 3": { ratio: 4 / 3, label: "4 / 3" },
    "16 / 9": { ratio: 16 / 9, label: "16 / 9" },
    "3 / 4": { ratio: 3 / 4, label: "3 / 4" },
  },
};

const CommonStoryTemplate = meta.story({
  render: (args) => (
    <VariantTable
      Component={AspectRatioPreview}
      variantMap={{}}
      conditionMap={conditionMap}
      {...args}
    />
  ),
});

export const LightTheme = CommonStoryTemplate.extend({});

export const DarkTheme = CommonStoryTemplate.extend({
  parameters: createStoryParameters({ theme: "dark" }),
});

export const FontScalingExtraSmall = CommonStoryTemplate.extend({
  parameters: createStoryParameters({ fontScale: "Extra Small" }),
});

export const FontScalingExtraExtraExtraLarge = CommonStoryTemplate.extend({
  parameters: createStoryParameters({ fontScale: "Extra Extra Extra Large" }),
});
