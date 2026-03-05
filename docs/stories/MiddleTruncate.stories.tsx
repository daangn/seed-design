import type { Meta, StoryObj } from "@storybook/nextjs";

import { MiddleTruncate } from "@seed-design/react-middle-truncate";
import { SeedThemeDecorator } from "./components/decorator";
import { createStoryWithParameters } from "@/stories/utils/parameters";
import { VariantTable } from "./components/variant-table";

interface MiddleTruncateStoryProps {
  text: string;
  end: number;
  maxLines: number;
  ellipsis: string;
  width: number;
}

const MiddleTruncateForStory = ({
  text,
  end,
  maxLines,
  ellipsis,
  width,
  ...rest
}: MiddleTruncateStoryProps) => (
  <MiddleTruncate.Root
    end={end}
    maxLines={maxLines}
    ellipsis={ellipsis}
    style={{ width }}
    {...rest}
  >
    <MiddleTruncate.Content>{text}</MiddleTruncate.Content>
  </MiddleTruncate.Root>
);

const meta = {
  component: MiddleTruncateForStory,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof MiddleTruncateForStory>;

export default meta;

type Story = StoryObj<typeof meta>;

const conditionMap = {
  width: {
    "100px": { width: 100 },
    "200px": { width: 200 },
    "300px": { width: 300 },
    unset: { width: "unset" },
  },
  text: {
    cjk: {
      text: "법인사업자등록증 2024년도 갱신본 법인사업자등록증 2024년도 갱신본 법인사업자등록증 2024년도 갱신본",
    },
    latin: {
      text: "summer vacation photo of the year 2024 final version culpa qui sint exercitation et mollit et voluptate consequat",
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
  // all ignored
  args: {
    text: "",
    end: 4,
    maxLines: 2,
    ellipsis: "…",
    width: 120,
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
