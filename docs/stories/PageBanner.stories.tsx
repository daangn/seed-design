import type { Meta, StoryObj } from "@storybook/nextjs";

import { PageBanner, PageBannerButton } from "seed-design/ui/page-banner";

import { pageBannerVariantMap } from "@ride-developer/css/recipes/page-banner";
import { VariantTable } from "./components/variant-table";
import { IconBellFill } from "@karrotmarket/react-monochrome-icon";
import { SeedThemeDecorator } from "./components/decorator";
import { createStoryWithParameters } from "@/stories/utils/parameters";

const meta = {
  component: PageBanner,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof PageBanner>;

export default meta;

type Story = StoryObj<typeof meta>;

const CommonStoryTemplate: Story = {
  args: {
    title: "enim consectetur",
    description:
      "Ex do aliqua est non ea adipisicing nostrud. Exercitation ea mollit sunt magna quis quis exercitation.",
    prefixIcon: <IconBellFill />,
    suffix: <PageBannerButton>자세히 보기</PageBannerButton>,
  },
  render: (args) => (
    <VariantTable Component={meta.component} variantMap={pageBannerVariantMap} {...args} />
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
