import type { Meta, StoryObj } from "@storybook/nextjs";

import { FooterLinkText, SuffixIcon } from "@seed-design/react";

import { createStoryWithParameters } from "@/stories/utils/parameters";
import { IconArrowUpRightLine } from "@karrotmarket/react-monochrome-icon";
import { footerVariantMap } from "@seed-design/css/recipes/footer";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";

const meta = {
  component: FooterLinkText,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof FooterLinkText>;

export default meta;

type Story = StoryObj<typeof meta>;

const CommonStoryTemplate: Story = {
  args: {
    children: (
      <>
        이용약관
        <SuffixIcon svg={<IconArrowUpRightLine />} />
      </>
    ),
  },
  render: (args) => (
    <VariantTable Component={meta.component} variantMap={footerVariantMap} {...args} />
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
