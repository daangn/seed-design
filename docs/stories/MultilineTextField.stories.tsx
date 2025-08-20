import type { Meta, StoryObj } from "@storybook/nextjs";

import { TextField, TextFieldTextarea } from "seed-design/ui/text-field";

import { textFieldVariantMap } from "@seed-design/css/recipes/text-field";
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

const CommonStoryTemplate: Story = {
  args: {
    label:
      "Officia ad consectetur mollit incididunt tempor tempor in mollit exercitation velit veniam laborum.",
    indicator:
      "Officia nostrud aute minim consectetur mollit incididunt tempor tempor cupidatat nostrud est.",
    description:
      "Sunt enim deserunt culpa exercitation cupidatat cillum. Eiusmod adipisicing voluptate laboris pariatur cillum sunt aliqua tempor.",
    errorMessage:
      "Do occaecat qui nulla sit pariatur. Occaecat est ex sit ad nulla pariatur mollit eu reprehenderit exercitation est commodo officia id Lorem.",
    children: <TextFieldTextarea placeholder="Placeholder" />,
  },
  render: (args) => (
    <VariantTable
      Component={meta.component}
      variantMap={textFieldVariantMap}
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
