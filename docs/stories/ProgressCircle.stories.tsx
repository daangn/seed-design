import type { Meta, StoryObj } from "@storybook/nextjs";

import { ProgressCircle } from "seed-design/ui/progress-circle";

import { progressCircleVariantMap } from "@seed-design/css/recipes/progress-circle";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";
import { createStoryWithParameters } from "@/stories/utils/parameters";

const meta = {
  component: ProgressCircle,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof ProgressCircle>;

export default meta;

type Story = StoryObj<typeof meta>;

const IndeterminateTemplate: Story = {
  args: {},
  render: (args) => (
    <VariantTable Component={meta.component} variantMap={progressCircleVariantMap} {...args} />
  ),
};

const Determinate0Template: Story = {
  args: {
    value: 0,
  },
  render: (args) => (
    <VariantTable Component={meta.component} variantMap={progressCircleVariantMap} {...args} />
  ),
};

const Determinate50Template: Story = {
  args: {
    value: 50,
  },
  render: (args) => (
    <VariantTable Component={meta.component} variantMap={progressCircleVariantMap} {...args} />
  ),
};

const Determinate100Template: Story = {
  args: {
    value: 100,
  },
  render: (args) => (
    <VariantTable Component={meta.component} variantMap={progressCircleVariantMap} {...args} />
  ),
};

export const IndeterminateLightTheme = IndeterminateTemplate;

export const IndeterminateDarkTheme = createStoryWithParameters({
  ...IndeterminateTemplate,
  parameters: { theme: "dark" },
});

export const Determinate0LightTheme = Determinate0Template;

export const Determinate0DarkTheme = createStoryWithParameters({
  ...Determinate0Template,
  parameters: { theme: "dark" },
});

export const Determinate50LightTheme = Determinate50Template;

export const Determinate50DarkTheme = createStoryWithParameters({
  ...Determinate50Template,
  parameters: { theme: "dark" },
});

export const Determinate100LightTheme = Determinate100Template;

export const Determinate100DarkTheme = createStoryWithParameters({
  ...Determinate100Template,
  parameters: { theme: "dark" },
});
