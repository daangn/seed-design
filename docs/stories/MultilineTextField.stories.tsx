import type { Meta, StoryObj } from "@storybook/nextjs";

import { TextFieldTextarea } from "seed-design/ui/text-field";

import { textFieldVariantMap } from "@seed-design/css/recipes/text-field";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";
import { createStoryWithParameters } from "@/stories/utils/parameters";

const meta = {
  component: TextFieldTextarea,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof TextFieldTextarea>;

export default meta;

type Story = StoryObj<typeof meta>;

const CommonStoryTemplate: Story = {
  args: {
    textareaProps: {
      placeholder: "Placeholder",
    },
    children: <TextFieldTextarea />,
  },
  render: (args) => (
    <VariantTable Component={meta.component} variantMap={textFieldVariantMap} {...args} />
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
