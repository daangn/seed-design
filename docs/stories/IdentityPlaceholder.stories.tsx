import type { Meta, StoryObj } from "@storybook/nextjs";

import { IdentityPlaceholder } from "seed-design/ui/identity-placeholder";

import { identityPlaceholderVariantMap } from "@seed-design/css/recipes/identity-placeholder";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";
import { createStoryWithParameters } from "@/stories/utils/parameters";

const meta = {
  component: IdentityPlaceholder,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof IdentityPlaceholder>;

export default meta;

type Story = StoryObj<typeof meta>;

const CommonStoryTemplate: Story = {
  render: (args) => (
    <VariantTable Component={meta.component} variantMap={identityPlaceholderVariantMap} {...args} />
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
