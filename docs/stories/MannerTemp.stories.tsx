import preview from "../.storybook/preview";
import { MannerTemp } from "seed-design/ui/manner-temp";

import { mannerTempVariantMap } from "@seed-design/css/recipes/manner-temp";
import { VariantTable } from "./components/variant-table";
import { SeedThemeDecorator } from "./components/decorator";
import { withChromaticParameters } from "@/stories/utils/parameters";

const meta = preview.meta({
  component: MannerTemp,
  decorators: [SeedThemeDecorator],
});
const conditionMap = {
  level: {
    l1: {
      temperature: 12.5,
    },
    l2: {
      temperature: 30,
    },
    l3: {
      temperature: 36,
    },
    l4: {
      temperature: 36.5,
    },
    l5: {
      temperature: 37,
    },
    l6: {
      temperature: 40,
    },
    l7: {
      temperature: 45,
    },
    l8: {
      temperature: 55,
    },
    l9: {
      temperature: 65,
    },
    l10: {
      temperature: 80,
    },
  },
};

const CommonStoryTemplate = meta.story({
  args: {
    temperature: 0, // intentionally ignored
  },
  render: (_, { component }) => (
    <VariantTable
      Component={component!}
      variantMap={mannerTempVariantMap}
      conditionMap={conditionMap}
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
