import type { Meta, StoryObj } from "@storybook/react";

import { TextField, TextFieldInput } from "seed-design/ui/text-field";

import { IconPaperplaneLine } from "@karrotmarket/react-monochrome-icon";
import { fieldVariantMap } from "@seed-design/css/recipes/field";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";
import { createStoryWithParameters } from "@/stories/utils/parameters";
import { PrefixIcon } from "@seed-design/react";

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

const CommonStoryTemplate: Story = {
  args: {
    label: "Label",
    description:
      "Sint pariatur labore et elit dolore sunt velit incididunt nisi laboris cillum et dolore ad ullamco.",
    errorMessage: "Error message",
    maxGraphemeCount: 10,
    children: (
      <>
        <PrefixIcon svg={<IconPaperplaneLine />} />
        <TextFieldInput placeholder="Placeholder" />
        <span>Suffix</span>
      </>
    ),
  },
  render: (args) => (
    <VariantTable
      Component={meta.component}
      variantMap={fieldVariantMap}
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
