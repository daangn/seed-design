import preview from "../.storybook/preview";
import { TabsRoot, TabsRootProps, TabsTrigger, TabsList } from "seed-design/ui/tabs";

import { tabsVariantMap } from "@seed-design/css/recipes/tabs";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";
import { createStoryParameters } from "@/stories/utils/parameters";

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

const meta = preview.meta({
  component: TabsRoot,
  decorators: [SeedThemeDecorator],
});
const CommonStoryTemplate = meta.story({
  args: {
    defaultValue: "1",
  },
  render: function Render(args) {
    return <VariantTable Component={Component} variantMap={tabsVariantMap} {...args} />;
  },
});

export const LightTheme = CommonStoryTemplate.extend({});

export const DarkTheme = CommonStoryTemplate.extend({
  parameters: createStoryParameters({ theme: "dark" }),
});

export const FontScalingExtraSmall = CommonStoryTemplate.extend({
  parameters: createStoryParameters({ fontScale: "Extra Small" }),
});

export const FontScalingExtraExtraExtraLarge = CommonStoryTemplate.extend({
  parameters: createStoryParameters({ fontScale: "Extra Extra Extra Large" }),
});
