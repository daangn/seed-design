import preview from "../.storybook/preview";
import { ProgressCircle } from "seed-design/ui/progress-circle";

import { progressCircleVariantMap } from "@seed-design/css/recipes/progress-circle";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";
import { withVisualTestParameters } from "@/stories/utils/parameters";

const meta = preview.meta({
  component: ProgressCircle,
  decorators: [SeedThemeDecorator],
});
const IndeterminateTemplate = meta.story({
  args: {},
  render: (args, { component }) => (
    <VariantTable Component={component!} variantMap={progressCircleVariantMap} {...args} />
  ),
});

const Determinate0Template = meta.story({
  args: {
    value: 0,
  },
  render: (args, { component }) => (
    <VariantTable Component={component!} variantMap={progressCircleVariantMap} {...args} />
  ),
});

const Determinate50Template = meta.story({
  args: {
    value: 50,
  },
  render: (args, { component }) => (
    <VariantTable Component={component!} variantMap={progressCircleVariantMap} {...args} />
  ),
});

const Determinate100Template = meta.story({
  args: {
    value: 100,
  },
  render: (args, { component }) => (
    <VariantTable Component={component!} variantMap={progressCircleVariantMap} {...args} />
  ),
});

export const IndeterminateLightTheme = IndeterminateTemplate.extend({});

export const IndeterminateDarkTheme = IndeterminateTemplate.extend({
  parameters: withVisualTestParameters({ theme: "dark" }),
});

export const Determinate0LightTheme = Determinate0Template.extend({});

export const Determinate0DarkTheme = Determinate0Template.extend({
  parameters: withVisualTestParameters({ theme: "dark" }),
});

export const Determinate50LightTheme = Determinate50Template.extend({});

export const Determinate50DarkTheme = Determinate50Template.extend({
  parameters: withVisualTestParameters({ theme: "dark" }),
});

export const Determinate100LightTheme = Determinate100Template.extend({});

export const Determinate100DarkTheme = Determinate100Template.extend({
  parameters: withVisualTestParameters({ theme: "dark" }),
});
