import type { Meta, StoryObj } from "@storybook/react";

import { LinkContent } from "@seed-design/react";

import { createStoryWithParameters } from "@/stories/utils/parameters";
import { IconChevronRightLine } from "@daangn/react-monochrome-icon";
import { linkContentVariantMap } from "@seed-design/css/recipes/link-content";
import { SuffixIcon } from "@seed-design/react";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";

const meta = {
  component: LinkContent,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof LinkContent>;

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
      <LinkContent>
        더보기
        <SuffixIcon svg={<IconChevronRightLine />} />
      </LinkContent>
    ),
  },
  render: (args) => (
    <VariantTable
      Component={meta.component}
      variantMap={linkContentVariantMap}
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
