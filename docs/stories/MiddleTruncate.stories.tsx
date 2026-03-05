import type { Meta, StoryObj } from "@storybook/nextjs";

import { MiddleTruncate, type MiddleTruncateProps } from "@seed-design/react-middle-truncate";
import { SeedThemeDecorator } from "./components/decorator";
import { createStoryWithParameters } from "@/stories/utils/parameters";
import { VariantTable } from "./components/variant-table";

const MiddleTruncateForStory = ({
  rootProps,
  ...props
}: MiddleTruncateProps & {
  rootProps?: React.HTMLAttributes<HTMLDivElement>;
}) => (
  <div {...rootProps}>
    <MiddleTruncate {...props} />
  </div>
);

const meta = {
  component: MiddleTruncateForStory,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof MiddleTruncateForStory>;

export default meta;

type Story = StoryObj<typeof meta>;

const conditionMap = {
  width: {
    "100px": { rootProps: { style: { width: 100 } } },
    "200px": { rootProps: { style: { width: 200 } } },
    "300px": { rootProps: { style: { width: 300 } } },
    grow: { rootProps: { style: { flexGrow: 1 } } },
  },
  text: {
    cjk: {
      children:
        "법인사업자등록증 2024년도 갱신본 법인사업자등록증 2024년도 갱신본 법인사업자등록증 2024년도 갱신본",
    },
    latin: {
      children:
        "summer vacation photo of the year 2024 final version culpa qui sint exercitation et mollit et voluptate consequat",
    },
  },
  maxLines: {
    "1": { maxLines: 1 },
    "2": { maxLines: 2 },
    "3": { maxLines: 3 },
  },
  end: {
    "0": { end: 0 },
    "3": { end: 3 },
    "5": { end: 5 },
    "15": { end: 15 },
  },
};

const CommonStoryTemplate: Story = {
  args: {
    // ignored
    children: "",
  },
  render: (args) => (
    <VariantTable
      Component={meta.component}
      variantMap={{}}
      conditionMap={conditionMap}
      {...args}
    />
  ),
};

export const LightTheme = CommonStoryTemplate;

export const FontScalingExtraSmall = createStoryWithParameters({
  ...CommonStoryTemplate,
  parameters: { fontScale: "Extra Small" },
});

export const FontScalingExtraExtraExtraLarge = createStoryWithParameters({
  ...CommonStoryTemplate,
  parameters: { fontScale: "Extra Extra Extra Large" },
});
