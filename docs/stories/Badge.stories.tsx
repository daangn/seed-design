import preview from "../.storybook/preview";
import { IconHeartFill } from "@karrotmarket/react-monochrome-icon";
import { Badge } from "seed-design/ui/badge";
import { badgeVariantMap } from "@seed-design/css/recipes/badge";
import { VariantTable } from "./components/variant-table";
import { SeedThemeDecorator } from "./components/decorator";
import { withChromaticParameters } from "@/stories/utils/parameters";

const meta = preview.meta({
  component: Badge,
  decorators: [SeedThemeDecorator],
});
const CommonStoryTemplate = meta.story({
  args: {
    children: "판매 완료",
  },
  render: (args) => <VariantTable Component={Badge} variantMap={badgeVariantMap} {...args} />,
});

export const LightTheme = CommonStoryTemplate.extend({});

export const DarkTheme = CommonStoryTemplate.extend({
  parameters: withChromaticParameters({ theme: "dark" }),
});

export const FontScalingExtraSmall = CommonStoryTemplate.extend({
  parameters: withChromaticParameters({ fontScale: "Extra Small" }),
});

export const FontScalingExtraExtraExtraLarge = CommonStoryTemplate.extend({
  parameters: withChromaticParameters({ fontScale: "Extra Extra Extra Large" }),
});

export const WithPrefix = meta.story({
  render: () => <Badge prefix={<IconHeartFill />}>관심 등록</Badge>,
});

export const WithAction = meta.story({
  render: () => <Badge action={{ "aria-label": "도움말" }}>판매 완료</Badge>,
});
