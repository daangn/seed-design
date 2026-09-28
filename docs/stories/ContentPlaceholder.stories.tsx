import preview from "../.storybook/preview";
import { ContentPlaceholder } from "seed-design/ui/content-placeholder";

import { withVisualTestParameters } from "@/stories/utils/parameters";
import { contentPlaceholderVariantMap } from "@seed-design/css/recipes/content-placeholder";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";
import {
  IconBuilding2Fill,
  IconCupHeatwaveFill,
  IconSparkle2Fill,
} from "@karrotmarket/react-monochrome-icon";

const meta = preview.meta({
  component: ContentPlaceholder,
  decorators: [SeedThemeDecorator],
});
const { type: _type, ...variantMap } = contentPlaceholderVariantMap;

const conditionMap = {
  size: {
    square: {
      style: {
        width: "120px",
        height: "120px",
      },
    },
    horizontal: {
      style: {
        width: "200px",
        height: "150px",
      },
    },
    vertical: {
      style: {
        width: "100px",
        height: "133px",
      },
    },
    wide: {
      style: {
        width: "320px",
        height: "200px",
      },
    },
    extraWide: {
      style: {
        width: "480px",
        height: "240px",
      },
    },
  },
  type: {
    ...Object.fromEntries(
      contentPlaceholderVariantMap.type.map((value) => [value, { type: value }]),
    ),
    custom: { children: <IconSparkle2Fill /> },
    cafe: { children: <IconCupHeatwaveFill style={{ stroke: "none" }} /> },
    apartment: { children: <IconBuilding2Fill style={{ stroke: "none" }} /> },
  },
};

const CommonStoryTemplate = meta.story({
  args: {},
  render: (args, { component }) => (
    <VariantTable
      Component={component!}
      variantMap={variantMap}
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
