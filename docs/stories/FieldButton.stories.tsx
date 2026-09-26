import preview from "../.storybook/preview";
import { FieldButton, FieldButtonPlaceholder, FieldButtonValue } from "seed-design/ui/field-button";
import { inputButtonVariantMap } from "@seed-design/css/recipes/input-button";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";
import { VISUAL_VIEWPORT_PARAMETERS, withVisualTestParameters } from "@/stories/utils/parameters";
import { IconPaperplaneLine } from "@karrotmarket/react-monochrome-icon";

const meta = preview.meta({
  component: FieldButton,
  decorators: [SeedThemeDecorator],
});
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

const CommonStoryTemplate = meta.story({
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
  render: (args, { component }) => (
    <VariantTable
      Component={component!}
      variantMap={inputButtonVariantMap}
      conditionMap={conditionMap}
      {...args}
    />
  ),
});

export const LightTheme = CommonStoryTemplate.extend({
  parameters: {
    ...VISUAL_VIEWPORT_PARAMETERS,
  },
});

export const DarkTheme = CommonStoryTemplate.extend({
  parameters: withVisualTestParameters({ theme: "dark" }),
});

export const FontScalingExtraSmall = CommonStoryTemplate.extend({
  parameters: withVisualTestParameters({ fontScale: "Extra Small" }),
});

export const FontScalingExtraExtraExtraLarge = CommonStoryTemplate.extend({
  parameters: withVisualTestParameters({ fontScale: "Extra Extra Extra Large" }),
});
