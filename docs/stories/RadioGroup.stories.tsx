import type { Meta, StoryObj } from "@storybook/nextjs";

import { RadioGroup, RadioGroupItem } from "seed-design/ui/radio-group";

import { radioVariantMap } from "@seed-design/css/recipes/radio";
import { VariantTable } from "./components/variant-table";
import { SeedThemeDecorator } from "./components/decorator";
import { createStoryWithParameters } from "@/stories/utils/parameters";
import { HStack } from "@seed-design/react";

const meta = {
  component: RadioGroup,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof RadioGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

const RadioGroupWrapper = ({ ...props }) => {
  return (
    <HStack gap="x3" asChild>
      <RadioGroup defaultValue="option1">
        <RadioGroupItem value="option1" label="Option 1" {...props} />
        <RadioGroupItem value="option2" label="Option 2" {...props} />
        <RadioGroupItem value="option3" label="Option 3" {...props} />
      </RadioGroup>
    </HStack>
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

const CommonStoryTemplate: Story = {
  render: () => (
    <VariantTable
      Component={RadioGroupWrapper}
      variantMap={radioVariantMap}
      conditionMap={conditionMap}
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
