import type { Meta, StoryObj } from "@storybook/nextjs";

import { FieldButton, FieldButtonPlaceholder, FieldButtonValue } from "seed-design/ui/field-button";
import { inputButtonVariantMap } from "@seed-design/css/recipes/input-button";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";
import { VIEWPORT_MODES, createStoryWithParameters } from "@/stories/utils/parameters";
import { IconPaperplaneLine } from "@karrotmarket/react-monochrome-icon";

const meta = {
  component: FieldButton,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof FieldButton>;

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
  children: {
    placeholder: {
      children: <FieldButtonPlaceholder>선택된 값이 없습니다.</FieldButtonPlaceholder>,
    },
    value: {
      children: <FieldButtonValue>선택된 값</FieldButtonValue>,
    },
    valueWithClear: {
      children: <FieldButtonValue>선택된 값</FieldButtonValue>,
      showClearButton: true,
      values: ["선택된 값"],
      onValuesChange: () => {},
    },
  },
};

const CommonStoryTemplate: Story = {
  args: {
    prefixIcon: <IconPaperplaneLine />,
    suffix: "Suffix",
    label: "Field Button",
    indicator: "필수",
    showRequiredIndicator: true,
    description: "선택해주세요.",
    errorMessage: "This is an error message.",
    buttonProps: {
      "aria-label": "버튼",
    },
  },
  render: (args) => (
    <VariantTable
      Component={meta.component}
      variantMap={inputButtonVariantMap}
      conditionMap={conditionMap}
      {...args}
    />
  ),
};

export const LightTheme: Story = {
  ...CommonStoryTemplate,
  parameters: {
    chromatic: { modes: VIEWPORT_MODES },
  },
};

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
