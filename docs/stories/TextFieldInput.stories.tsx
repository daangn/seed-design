import preview from "../.storybook/preview";
import { TextField, TextFieldInput } from "seed-design/ui/text-field";

import { IconPaperplaneLine } from "@karrotmarket/react-monochrome-icon";
import { textInputVariantMap } from "@seed-design/css/recipes/text-input";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";
import { VISUAL_VIEWPORT_PARAMETERS, withVisualTestParameters } from "@/stories/utils/parameters";

const meta = preview.meta({
  component: TextField,
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
  hasValue: {
    false: {
      value: "",
    },
    true: {
      value: "Value",
    },
  },
};

const CommonStoryTemplate = meta.story({
  args: {
    prefixIcon: <IconPaperplaneLine />,
    suffix: "Suffix",
    children: <TextFieldInput placeholder="Placeholder" />,
  },
  render: (args, { component }) => (
    <VariantTable
      Component={component!}
      variantMap={textInputVariantMap}
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
