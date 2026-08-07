import preview from "../.storybook/preview";
import { Chip } from "seed-design/ui/chip";

import { createStoryParameters } from "@/stories/utils/parameters";
import { IconHeartFill } from "@karrotmarket/react-monochrome-icon";
import { chipVariantMap } from "@seed-design/css/recipes/chip";
import { Icon } from "@seed-design/react";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";

const meta = preview.meta({
  component: Chip.Toggle,
  decorators: [SeedThemeDecorator],
});
const conditionMap = {
  disabled: {
    false: { disabled: false },
    true: { disabled: true },
  },
  checked: {
    false: { checked: false },
    true: { checked: true },
  },
  layout: {
    withText: {
      layout: "withText",
      children: (
        <>
          <Chip.PrefixIcon>
            <Icon svg={<IconHeartFill />} />
          </Chip.PrefixIcon>
          <Chip.Label>With Text Toggle</Chip.Label>
        </>
      ),
    },
  },
};

const CommonStoryTemplate = meta.story({
  args: {},
  render: (args) => (
    <VariantTable
      Component={Chip.Toggle}
      variantMap={chipVariantMap}
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
