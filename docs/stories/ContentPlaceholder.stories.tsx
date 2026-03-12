import type { Meta, StoryObj } from "@storybook/nextjs";
import type * as React from "react";

import { ContentPlaceholder } from "seed-design/ui/content-placeholder";

import { createStoryWithParameters } from "@/stories/utils/parameters";
import { contentPlaceholderVariantMap } from "@seed-design/css/recipes/content-placeholder";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";

const meta = {
  component: ContentPlaceholder,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof ContentPlaceholder>;

export default meta;

type Story = StoryObj<typeof meta>;
type ContentPlaceholderProps = React.ComponentProps<typeof ContentPlaceholder>;

const contentPlaceholderTypes = [
  "default",
  "coupon",
  "car",
  "realty",
  "food",
  "image",
  "group",
  "post",
  "localProfile",
  "buySell",
  "jobs",
] as const;

const CommonStoryTemplate: Story = {
  args: {
    style: { width: 120, height: 90 },
  },
  render: (args) => (
    <VariantTable Component={meta.component} variantMap={contentPlaceholderVariantMap} {...args} />
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

export const PresetTypes: Story = {
  args: {
    style: { width: 120, height: 90 },
  },
  render: (args) => {
    const { type: _type, svg: _svg, ...rootProps } = args as Partial<ContentPlaceholderProps>;

    return (
      <div
        style={{
          display: "grid",
          gap: 16,
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        }}
      >
        {contentPlaceholderTypes.map((type) => (
          <div key={type} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <code
              style={{
                fontSize: 13,
                fontFamily: "Courier",
                color: "var(--seed-color-fg-neutral)",
              }}
            >
              {type}
            </code>
            <ContentPlaceholder {...rootProps} type={type} />
          </div>
        ))}
      </div>
    );
  },
};
