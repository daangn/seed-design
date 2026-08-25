import preview from "../.storybook/preview";
import { RadioGroup, RadioGroupItem } from "seed-design/ui/radio-group";

import { radioVariantMap } from "@seed-design/css/recipes/radio";
import { VariantTable } from "./components/variant-table";
import { SeedThemeDecorator } from "./components/decorator";
import { withVisualTestParameters } from "@/stories/utils/parameters";

const meta = preview.meta({
  component: RadioGroup,
  decorators: [SeedThemeDecorator],
});
const RadioGroupWrapper = ({ ...props }) => {
  return (
    <RadioGroup defaultValue="option1" aria-label="Options">
      <RadioGroupItem value="option1" label="Option 1" {...props} />
      <RadioGroupItem value="option2" label="Option 2" {...props} />
      <RadioGroupItem value="option3" label="Option 3" {...props} />
    </RadioGroup>
  );
};

const conditionMap = {
  disabled: {
    false: {
      disabled: false,
    },
    true: {
      disabled: true,
    },
  },
};

const CommonStoryTemplate = meta.story({
  render: () => (
    <VariantTable
      Component={RadioGroupWrapper}
      variantMap={radioVariantMap}
      conditionMap={conditionMap}
    />
  ),
});

export const LightTheme = CommonStoryTemplate.extend({});

export const DarkTheme = CommonStoryTemplate.extend({
  parameters: withVisualTestParameters({ theme: "dark" }),
});

export const FontScalingExtraSmall = CommonStoryTemplate.extend({
  parameters: withVisualTestParameters({ fontScale: "Extra Small" }),
});

export const FontScalingExtraExtraExtraLarge = CommonStoryTemplate.extend({
  parameters: withVisualTestParameters({ fontScale: "Extra Extra Extra Large" }),
});
