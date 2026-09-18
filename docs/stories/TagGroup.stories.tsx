import preview from "../.storybook/preview";
import { tagGroupVariantMap } from "@seed-design/css/recipes/tag-group";
import { tagGroupItemVariantMap } from "@seed-design/css/recipes/tag-group-item";

import { VariantTable } from "./components/variant-table";
import { SeedThemeDecorator } from "./components/decorator";
import { withVisualTestParameters } from "@/stories/utils/parameters";
import { IconCheckmarkCircleFill, IconMegaphoneFill } from "@karrotmarket/react-monochrome-icon";
import { TagGroupRoot, TagGroupItem } from "seed-design/ui/tag-group";

const meta = preview.meta({
  component: TagGroupRoot,
  decorators: [SeedThemeDecorator],
});
const truncateStyle = { width: "250px" };

const conditionMap = {
  truncate: {
    "false (wrap)": { truncate: false },
    "true (default)": { truncate: true, style: truncateStyle },
    "true (keep first)": {
      truncate: true,
      style: truncateStyle,
      children: [
        <TagGroupItem
          key="1"
          flexShrink={0}
          prefixIcon={<IconCheckmarkCircleFill />}
          label="부산광역시 해운대구"
          suffixIcon={<IconMegaphoneFill />}
        />,
        <TagGroupItem
          key="2"
          prefixIcon={<IconCheckmarkCircleFill />}
          label="123 456 789 012 345"
        />,
        <TagGroupItem key="3" label="Ut minim laboris enim" />,
      ],
    },
    "true (mixed ratios)": {
      truncate: true,
      style: truncateStyle,
      children: [
        <TagGroupItem
          key="1"
          flexShrink={1}
          prefixIcon={<IconCheckmarkCircleFill />}
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

const CommonStoryTemplate = meta.story({
  args: {
    // this can't be done with Fragment because separators are needed between items
    children: [
      <TagGroupItem
        key="1"
        prefixIcon={<IconCheckmarkCircleFill />}
        label="부산광역시 해운대구"
        suffixIcon={<IconMegaphoneFill />}
      />,
      <TagGroupItem key="2" prefixIcon={<IconCheckmarkCircleFill />} label="123 456 789 012 345" />,
      <TagGroupItem key="3" label="Ut minim laboris enim" />,
    ],
  },
  render: (args, { component }) => (
    <VariantTable
      Component={component!}
      variantMap={{
        ...tagGroupItemVariantMap,
        ...tagGroupVariantMap,
      }}
      conditionMap={conditionMap}
      {...args}
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
