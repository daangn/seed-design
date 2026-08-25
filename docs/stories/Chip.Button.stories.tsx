import preview from "../.storybook/preview";
import { Chip } from "seed-design/ui/chip";

import { withChromaticParameters } from "@/stories/utils/parameters";
import { IconHeartFill } from "@karrotmarket/react-monochrome-icon";
import { chipVariantMap } from "@seed-design/css/recipes/chip";
import { Icon } from "@seed-design/react";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";

const meta = preview.meta({
  component: Chip.Button,
  decorators: [SeedThemeDecorator],
});
const conditionMap = {
  disabled: {
    false: { disabled: false },
    true: { disabled: true },
  },
  layout: {
    withText: {
      children: (
        <>
          <Chip.PrefixIcon>
            <Icon svg={<IconHeartFill />} />
          </Chip.PrefixIcon>
          <Chip.Label>With Icon Button</Chip.Label>
        </>
      ),
    },
  },
};

const CommonStoryTemplate = meta.story({
  args: {},
  render: (args, { component }) => (
    <VariantTable
      Component={component!}
      variantMap={chipVariantMap}
      conditionMap={conditionMap}
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
