import type { Meta, StoryObj } from "@storybook/nextjs";

import { PrefixIcon, SuffixIcon, TagGroup } from "@seed-design/react";

import { tagGroupVariantMap } from "@seed-design/css/recipes/tag-group";
import { tagGroupItemVariantMap } from "@seed-design/css/recipes/tag-group-item";

import { VariantTable } from "./components/variant-table";
import { SeedThemeDecorator } from "./components/decorator";
import { createStoryWithParameters } from "@/stories/utils/parameters";
import { IconCheckmarkCircleFill, IconMegaphoneFill } from "@karrotmarket/react-monochrome-icon";

const meta = {
  component: TagGroup.Root,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof TagGroup.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

const CommonStoryTemplate: Story = {
  args: {
    // this can't be done with Fragment because separators are needed between items
    children: [
      <TagGroup.Item key="1">
        태그 1
        <SuffixIcon svg={<IconMegaphoneFill />} />
      </TagGroup.Item>,
      <TagGroup.Item key="2">
        <PrefixIcon svg={<IconCheckmarkCircleFill />} />
        태그 2
      </TagGroup.Item>,
      <TagGroup.Item key="3">태그 3</TagGroup.Item>,
    ],
  },
  render: (args) => (
    <VariantTable
      Component={meta.component}
      variantMap={{
        ...tagGroupItemVariantMap,
        ...tagGroupVariantMap,
      }}
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
