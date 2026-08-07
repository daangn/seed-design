import preview from "../.storybook/preview";
import { IdentityPlaceholder } from "seed-design/ui/identity-placeholder";

import { identityPlaceholderVariantMap } from "@seed-design/css/recipes/identity-placeholder";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";
import { createStoryParameters } from "@/stories/utils/parameters";

const meta = preview.meta({
  component: IdentityPlaceholder,
  decorators: [SeedThemeDecorator],
});
const CommonStoryTemplate = meta.story({
  render: (args) => (
    <VariantTable
      Component={IdentityPlaceholder}
      variantMap={identityPlaceholderVariantMap}
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
