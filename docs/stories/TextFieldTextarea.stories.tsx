import type { Meta, StoryObj } from "@storybook/nextjs";

import { TextField, TextFieldTextarea } from "seed-design/ui/text-field";

import { textInputVariantMap } from "@seed-design/css/recipes/text-input";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";
import { createStoryWithParameters } from "@/stories/utils/parameters";

const meta = {
  component: TextField,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof TextField>;

export default meta;

type Story = StoryObj<typeof meta>;

const conditionMap = {
  disabled: {
    false: {
      disabled: false,
    },
    true: {
      disabled: true,
    },
  },
  readOnly: {
    false: {
      readOnly: false,
    },
    true: {
      readOnly: true,
    },
  },
  invalid: {
    false: {
      invalid: false,
    },
    true: {
      invalid: true,
    },
  },
  hasValue: {
    false: {
      value: "",
    },
    true: {
      value: "Value",
    },
  },
};

// variant is unused in textarea
const { variant: __variant, ...variantMap } = textInputVariantMap;

const CommonStoryTemplate: Story = {
  args: {
    children: <TextFieldTextarea placeholder="Placeholder" />,
  },
  render: (args) => (
    <VariantTable
      Component={meta.component}
      variantMap={variantMap}
      conditionMap={conditionMap}
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
