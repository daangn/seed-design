import type { Meta, StoryObj } from "@storybook/nextjs";

import { ResultSection } from "seed-design/ui/result-section";

import { createStoryWithParameters } from "@/stories/utils/parameters";
import { Box, Icon } from "@seed-design/react";
import { SeedThemeDecorator } from "./components/decorator";
import { IconDiamond } from "@karrotmarket/react-multicolor-icon";
import { VariantTable } from "@/stories/components/variant-table";

const meta = {
  component: ResultSection,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof ResultSection>;

export default meta;

type Story = StoryObj<typeof meta>;

const CommonStoryTemplate: Story = {
  render: (args) => (
    <VariantTable
      Component={meta.component}
      variantMap={{
        size: ["large", "medium"],
      }}
      conditionMap={{
        asset: {
          true: {
            asset: (
              <Box pb="x4">
                <Icon svg={<IconDiamond />} size="x10" />
              </Box>
            ),
          },
          false: {
            asset: undefined,
          },
        },
        title: {
          true: {
            title: "Officia cupidatat ex mollit.",
          },
          false: {
            title: undefined,
          },
        },
        description: {
          true: {
            description:
              "In laboris commodo elit aute quis elit exercitation proident culpa consectetur.",
          },
          false: {
            description: undefined,
          },
        },
        primaryActionProps: {
          true: {
            primaryActionProps: {
              children: "deserunt",
            },
          },
          false: {
            primaryActionProps: undefined,
          },
        },
        secondaryActionProps: {
          true: {
            secondaryActionProps: {
              children: "consequat quis",
            },
          },
          false: {
            secondaryActionProps: undefined,
          },
        },
      }}
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
