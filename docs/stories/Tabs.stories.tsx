import type { Meta, StoryObj } from "@storybook/nextjs";

import { TabsRoot, TabsRootProps, TabsTrigger, TabsList } from "seed-design/ui/tabs";

import { tabsVariantMap } from "@ride-developer/css/recipes/tabs";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";
import { createStoryWithParameters } from "@/stories/utils/parameters";

const Component = (props: TabsRootProps) => {
  return (
    <div style={{ width: "100%" }}>
      <TabsRoot {...props}>
        <TabsList>
          <TabsTrigger value="1">Tab 1</TabsTrigger>
          <TabsTrigger value="2">Tab 2</TabsTrigger>
          <TabsTrigger value="3">Tab 3</TabsTrigger>
        </TabsList>
      </TabsRoot>
    </div>
  );
};

const meta = {
  component: TabsRoot,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof TabsRoot>;

export default meta;

type Story = StoryObj<typeof meta>;

const CommonStoryTemplate: Story = {
  args: {
    defaultValue: "1",
  },
  render: function Render(args) {
    return <VariantTable Component={Component} variantMap={tabsVariantMap} {...args} />;
  },
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
