import preview from "../.storybook/preview";
import { quantityPickerVariantMap } from "@seed-design/css/recipes/quantity-picker";
import { HStack, ImageFrame, Text, VStack } from "@seed-design/react";

import { ContentPlaceholder } from "seed-design/ui/content-placeholder";
import { QuantityPicker } from "seed-design/ui/quantity-picker";

import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";
import { createStoryParameters } from "./utils/parameters";

const meta = preview.meta({
  component: QuantityPicker,
  decorators: [SeedThemeDecorator],
});
const defaultProps = {
  "aria-label": "수량",
  min: 1,
  max: 99,
};

const conditionMap = {
  state: {
    default: { ...defaultProps, defaultValue: 1 },
    min: { ...defaultProps, defaultValue: 1 },
    max: { ...defaultProps, defaultValue: 99 },
    removable: { ...defaultProps, defaultValue: 1, removable: true },
    loading: { ...defaultProps, defaultValue: 3, loading: { increment: true } },
    disabled: { ...defaultProps, defaultValue: 3, disabled: true },
    readOnly: { ...defaultProps, defaultValue: 3, readOnly: true },
  },
};

const maxConditionMap = {
  max: {
    "99": { ...defaultProps, defaultValue: 99 },
    "999": { ...defaultProps, max: 999, defaultValue: 999 },
  },
};

const Template = meta.story({
  args: defaultProps,
  render: () => (
    <VariantTable
      Component={QuantityPicker}
      conditionMap={conditionMap}
      variantMap={quantityPickerVariantMap}
    />
  ),
});

const MaxValuesTemplate = meta.story({
  args: defaultProps,
  render: () => (
    <VariantTable
      Component={QuantityPicker}
      conditionMap={maxConditionMap}
      variantMap={quantityPickerVariantMap}
    />
  ),
});

export const LightTheme = Template.extend({ parameters: createStoryParameters() });
export const DarkTheme = Template.extend({
  parameters: createStoryParameters({ theme: "dark" }),
});
export const FontScalingExtraSmall = Template.extend({
  parameters: createStoryParameters({ fontScale: "Extra Small" }),
});
export const FontScalingExtraExtraExtraLarge = Template.extend({
  parameters: createStoryParameters({ fontScale: "Extra Extra Extra Large" }),
});
export const MaxValues = MaxValuesTemplate.extend({ parameters: createStoryParameters() });

export const MaxValuesFontScalingExtraSmall = MaxValuesTemplate.extend({
  parameters: createStoryParameters({ fontScale: "Extra Small" }),
});

export const MaxValuesFontScalingExtraExtraExtraLarge = MaxValuesTemplate.extend({
  parameters: createStoryParameters({ fontScale: "Extra Extra Extra Large" }),
});

export const LayoutFill = meta.story({
  args: { ...defaultProps, defaultValue: 1, layout: "fill" },
  render: (args) => (
    <VStack width="360px" gap="x3" align="stretch">
      <ImageFrame
        src="https://invalid-url"
        alt="상품 이미지"
        ratio={1}
        borderRadius="r3"
        style={{ width: "100%" }}
        fallback={<ContentPlaceholder type="commerce" />}
      />
      <HStack width="full">
        <QuantityPicker {...args} />
      </HStack>
      <VStack gap="x1">
        <Text color="fg.neutral">새청무 쌀 500g</Text>
        <Text color="fg.neutral" textStyle="t5Bold">
          4,000원
        </Text>
      </VStack>
    </VStack>
  ),
});
