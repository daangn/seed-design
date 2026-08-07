import preview from "../.storybook/preview";
import { ContextualFloatingButton } from "seed-design/ui/contextual-floating-button";
import { Icon } from "@seed-design/react";

import { createStoryParameters } from "@/stories/utils/parameters";
import { IconBellFill } from "@karrotmarket/react-monochrome-icon";
import { contextualFloatingButtonVariantMap } from "@seed-design/css/recipes/contextual-floating-button";
import { PrefixIcon } from "@seed-design/react";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";

const meta = preview.meta({
  component: ContextualFloatingButton,
  decorators: [SeedThemeDecorator],
});
const conditionMap = {
  disabled: {
    false: { disabled: false },
    true: { disabled: true },
  },
  loading: {
    false: { loading: false },
    true: { loading: true },
  },
  layout: {
    textOnly: { layout: "withText", children: "알림 설정" },
    iconFirst: {
      layout: "withText",
      children: (
        <>
          <PrefixIcon svg={<IconBellFill />} />
          알림 설정
        </>
      ),
    },
    iconOnly: { layout: "iconOnly", children: <Icon svg={<IconBellFill />} /> },
  },
};

const CommonStoryTemplate = meta.story({
  render: (args) => (
    <VariantTable
      Component={ContextualFloatingButton}
      variantMap={contextualFloatingButtonVariantMap}
      conditionMap={conditionMap}
      {...args}
    />
  ),
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
