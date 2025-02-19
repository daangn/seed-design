import type { Meta, StoryObj } from "@storybook/react";

import { LinkWithIcon } from "@seed-design/react";

import { linkWithIconVariantMap } from "@seed-design/css/recipes/link-with-icon";
import { VariantTable } from "./components/variant-table";
import { IconChevronRightLine } from "@daangn/react-monochrome-icon";
import { SeedThemeDecorator } from "./components/decorator";
import { createStoryWithParameters } from "@/stories/utils/parameters";
import { SuffixIcon } from "@seed-design/react";

const meta = {
  component: LinkWithIcon,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof LinkWithIcon>;

export default meta;

type Story = StoryObj<typeof meta>;

const conditionMap = {
  disabled: {
    false: { disabled: false },
    true: { disabled: true },
  },
};

const CommonStoryTemplate: Story = {
  args: {
    children: (
      <>
        더보기
        <SuffixIcon svg={<IconChevronRightLine />} />
      </>
    ),
  },
  render: (args) => (
    <VariantTable
      Component={meta.component}
      variantMap={linkWithIconVariantMap}
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
