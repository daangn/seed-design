import preview from "../.storybook/preview";
import { ResultSection } from "seed-design/ui/result-section";

import { withChromaticParameters } from "@/stories/utils/parameters";
import { Box, Icon } from "@seed-design/react";
import { SeedThemeDecorator } from "./components/decorator";
import { IconDiamond } from "@karrotmarket/react-multicolor-icon";
import { VariantTable } from "@/stories/components/variant-table";

const meta = preview.meta({
  component: ResultSection,
  decorators: [SeedThemeDecorator],
});
const CommonStoryTemplate = meta.story({
  render: (args, { component }) => (
    <VariantTable
      Component={component!}
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
});

export const LightTheme = CommonStoryTemplate.extend({});

export const DarkTheme = CommonStoryTemplate.extend({
  parameters: withChromaticParameters({ theme: "dark" }),
});

export const FontScalingExtraSmall = CommonStoryTemplate.extend({
  parameters: withChromaticParameters({ fontScale: "Extra Small" }),
});

export const FontScalingExtraExtraExtraLarge = CommonStoryTemplate.extend({
  parameters: withChromaticParameters({ fontScale: "Extra Extra Extra Large" }),
});
