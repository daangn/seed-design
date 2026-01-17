import type { Meta, StoryObj } from "@storybook/nextjs";

import { tagGroupVariantMap } from "@seed-design/css/recipes/tag-group";
import { tagGroupItemVariantMap } from "@seed-design/css/recipes/tag-group-item";

import { VariantTable } from "./components/variant-table";
import { SeedThemeDecorator } from "./components/decorator";
import { createStoryWithParameters } from "@/stories/utils/parameters";
import { IconCheckmarkCircleFill, IconMegaphoneFill } from "@karrotmarket/react-monochrome-icon";
import { TagGroupRoot, TagGroupItem } from "seed-design/ui/tag-group";

const meta = {
  component: TagGroupRoot,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof TagGroupRoot>;

export default meta;

type Story = StoryObj<typeof meta>;

const conditionMap = {
  nowrap: {
    false: { nowrap: false },
    true: { nowrap: true, style: { width: "250px" } },
  },
  flexShrink: {
    none: {},
    all: {
      children: [
        <TagGroupItem
          key="1"
          flexShrink
          label="부산광역시 해운대구"
          suffixIcon={<IconMegaphoneFill />}
        />,
        <TagGroupItem
          key="2"
          flexShrink
          prefixIcon={<IconCheckmarkCircleFill />}
          label="123 456 789 012 345"
        />,
        <TagGroupItem key="3" flexShrink label="Ut minim laboris enim" />,
      ],
    },
    mixed: {
      children: [
        <TagGroupItem
          key="1"
          flexShrink={1}
          label="부산광역시 해운대구"
          suffixIcon={<IconMegaphoneFill />}
        />,
        <TagGroupItem
          key="2"
          flexShrink={100}
          prefixIcon={<IconCheckmarkCircleFill />}
          label="123 456 789 012 345"
        />,
        <TagGroupItem key="3" flexShrink={100} label="Ut minim laboris enim" />,
      ],
    },
  },
};

const CommonStoryTemplate: Story = {
  args: {
    // this can't be done with Fragment because separators are needed between items
    children: [
      <TagGroupItem key="1" label="부산광역시 해운대구" suffixIcon={<IconMegaphoneFill />} />,
      <TagGroupItem key="2" prefixIcon={<IconCheckmarkCircleFill />} label="123 456 789 012 345" />,
      <TagGroupItem key="3" label="Ut minim laboris enim" />,
    ],
  },
  render: (args) => (
    <VariantTable
      Component={meta.component}
      variantMap={{
        ...tagGroupItemVariantMap,
        ...tagGroupVariantMap,
      }}
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
