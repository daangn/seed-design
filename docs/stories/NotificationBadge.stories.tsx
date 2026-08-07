import preview from "../.storybook/preview";
import {
  Box,
  Icon,
  NotificationBadge,
  NotificationBadgePositioner,
  Text,
} from "@seed-design/react";

import type { NotificationBadgePositionerVariantProps } from "@seed-design/css/recipes/notification-badge-positioner";
import { createStoryParameters } from "@/stories/utils/parameters";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";
import { IconBellLine } from "@karrotmarket/react-monochrome-icon";

const meta = preview.meta({
  component: NotificationBadge,
  decorators: [SeedThemeDecorator],
});

interface Case {
  attach: NonNullable<NotificationBadgePositionerVariantProps["attach"]>;
  size: NonNullable<NotificationBadgePositionerVariantProps["size"]>;
  label?: string;
}

const conditionMap = {
  case: {
    "icon / small (dot)": { attach: "icon", size: "small" },
    "icon / large (1 digit)": { attach: "icon", size: "large", label: "1" },
    "icon / large (2 digits)": { attach: "icon", size: "large", label: "12" },
    "icon / large (overflow)": { attach: "icon", size: "large", label: "99+" },
    "text / small (dot)": { attach: "text", size: "small" },
  },
};

const IconAnchor = () => <Icon svg={<IconBellLine />} color="fg.neutral" />;

const TextAnchor = () => <Text color="fg.neutral">Inbox</Text>;

const NotificationBadgeCase = ({ attach, size, label }: Case) => (
  <Box as="span" display="inline-flex" position="relative">
    {attach === "text" ? <TextAnchor /> : <IconAnchor />}
    <NotificationBadgePositioner attach={attach} size={size}>
      {size === "large" ? <NotificationBadge>{label}</NotificationBadge> : <NotificationBadge />}
    </NotificationBadgePositioner>
  </Box>
);

const CommonStoryTemplate = meta.story({
  render: (args) => (
    <VariantTable
      Component={NotificationBadgeCase}
      variantMap={{}}
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
