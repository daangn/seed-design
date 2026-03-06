import type { Meta, StoryObj } from "@storybook/nextjs";

import { ContentPlaceholder } from "seed-design/ui/content-placeholder";

import { createStoryWithParameters } from "@/stories/utils/parameters";
import { contentPlaceholderVariantMap } from "@seed-design/css/recipes/content-placeholder";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";
import { IconSparkle2Fill } from "@karrotmarket/react-monochrome-icon";

const meta = {
  component: ContentPlaceholder,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof ContentPlaceholder>;

export default meta;

type Story = StoryObj<typeof meta>;

const conditionMap = {
  type: {
    default: { type: "default" },
    coupon: { type: "coupon" },
    car: { type: "car" },
    realty: { type: "realty" },
    food: { type: "food" },
    image: { type: "image" },
    group: { type: "group" },
    post: { type: "post" },
    localProfile: { type: "localProfile" },
    buySell: { type: "buySell" },
    jobs: { type: "jobs" },
    custom: { children: <IconSparkle2Fill /> },
  },
};

const CommonStoryTemplate: Story = {
  args: {
    style: { width: 120, height: 90 },
  },
  render: (args) => (
    <VariantTable
      Component={meta.component}
      variantMap={contentPlaceholderVariantMap}
      conditionMap={conditionMap}
      {...args}
    />
  ),
};

export const LightTheme = CommonStoryTemplate;

export const DarkTheme = createStoryWithParameters<typeof meta>({
  ...CommonStoryTemplate,
  parameters: { theme: "dark" },
});

export const FontScalingExtraSmall = createStoryWithParameters<typeof meta>({
  ...CommonStoryTemplate,
  parameters: { fontScale: "Extra Small" },
});

export const FontScalingExtraExtraExtraLarge = createStoryWithParameters<typeof meta>({
  ...CommonStoryTemplate,
  parameters: { fontScale: "Extra Extra Extra Large" },
});
