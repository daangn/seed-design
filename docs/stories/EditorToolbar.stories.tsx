import type { Meta, StoryObj } from "@storybook/nextjs";

import { EditorToolbar } from "@seed-design/react";
import { editorToolbarVariantMap } from "@seed-design/css/recipes/editor-toolbar";

import { createStoryWithParameters } from "@/stories/utils/parameters";
import {
  IconAUppercaseALowercaseFill,
  IconAppleFill,
  IconBUppercaseFill,
  IconILowercaseSerifCircleFill,
  IconSunFill,
} from "@karrotmarket/react-monochrome-icon";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";

const meta = {
  component: EditorToolbar.Root,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof EditorToolbar.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

const conditionMap = {
  layout: {
    iconWithText: {
      layout: "iconWithText",
      children: (
        <>
          <EditorToolbar.Item>
            <EditorToolbar.PrefixIcon svg={<IconBUppercaseFill />} />
            <EditorToolbar.Label>굵게</EditorToolbar.Label>
          </EditorToolbar.Item>
          <EditorToolbar.Item>
            <EditorToolbar.PrefixIcon svg={<IconILowercaseSerifCircleFill />} />
            <EditorToolbar.Label>기울임</EditorToolbar.Label>
          </EditorToolbar.Item>
          <EditorToolbar.Item>
            <EditorToolbar.PrefixIcon svg={<IconSunFill />} />
            <EditorToolbar.Label>밑줄</EditorToolbar.Label>
          </EditorToolbar.Item>
          <EditorToolbar.Item>
            <EditorToolbar.PrefixIcon svg={<IconAUppercaseALowercaseFill />} />
            <EditorToolbar.Label>취소선</EditorToolbar.Label>
          </EditorToolbar.Item>
          <EditorToolbar.Item>
            <EditorToolbar.PrefixIcon svg={<IconAppleFill />} />
            <EditorToolbar.Label>대소문자</EditorToolbar.Label>
          </EditorToolbar.Item>
        </>
      ),
    },
    iconOnly: {
      layout: "iconOnly",
      children: (
        <>
          <EditorToolbar.Item layout="iconOnly" aria-label="굵게">
            <EditorToolbar.Icon svg={<IconBUppercaseFill />} />
          </EditorToolbar.Item>
          <EditorToolbar.Item layout="iconOnly" aria-label="기울임">
            <EditorToolbar.Icon svg={<IconILowercaseSerifCircleFill />} />
          </EditorToolbar.Item>
          <EditorToolbar.Item layout="iconOnly" aria-label="밑줄">
            <EditorToolbar.Icon svg={<IconSunFill />} />
          </EditorToolbar.Item>
          <EditorToolbar.Item layout="iconOnly" aria-label="취소선">
            <EditorToolbar.Icon svg={<IconAUppercaseALowercaseFill />} />
          </EditorToolbar.Item>
          <EditorToolbar.Item layout="iconOnly" aria-label="링크">
            <EditorToolbar.Icon svg={<IconAppleFill />} />
          </EditorToolbar.Item>
          <EditorToolbar.Item layout="iconOnly" aria-label="목록">
            <EditorToolbar.Icon svg={<IconAUppercaseALowercaseFill />} />
          </EditorToolbar.Item>
          <EditorToolbar.Item layout="iconOnly" aria-label="번호">
            <EditorToolbar.Icon svg={<IconAUppercaseALowercaseFill />} />
          </EditorToolbar.Item>
          <EditorToolbar.Item layout="iconOnly" aria-label="왼쪽 정렬">
            <EditorToolbar.Icon svg={<IconBUppercaseFill />} />
          </EditorToolbar.Item>
          <EditorToolbar.Item layout="iconOnly" aria-label="가운데 정렬">
            <EditorToolbar.Icon svg={<IconILowercaseSerifCircleFill />} />
          </EditorToolbar.Item>
          <EditorToolbar.Item layout="iconOnly" aria-label="오른쪽 정렬">
            <EditorToolbar.Icon svg={<IconSunFill />} />
          </EditorToolbar.Item>
        </>
      ),
    },
  },
  selected: {
    none: {
      children: (
        <>
          <EditorToolbar.Item>
            <EditorToolbar.PrefixIcon svg={<IconBUppercaseFill />} />
            <EditorToolbar.Label>굵게</EditorToolbar.Label>
          </EditorToolbar.Item>
          <EditorToolbar.Item>
            <EditorToolbar.PrefixIcon svg={<IconILowercaseSerifCircleFill />} />
            <EditorToolbar.Label>기울임</EditorToolbar.Label>
          </EditorToolbar.Item>
          <EditorToolbar.Item>
            <EditorToolbar.PrefixIcon svg={<IconSunFill />} />
            <EditorToolbar.Label>밑줄</EditorToolbar.Label>
          </EditorToolbar.Item>
        </>
      ),
    },
    selected: {
      children: (
        <>
          <EditorToolbar.Item selected>
            <EditorToolbar.PrefixIcon svg={<IconBUppercaseFill />} />
            <EditorToolbar.Label>굵게</EditorToolbar.Label>
          </EditorToolbar.Item>
          <EditorToolbar.Item>
            <EditorToolbar.PrefixIcon svg={<IconILowercaseSerifCircleFill />} />
            <EditorToolbar.Label>기울임</EditorToolbar.Label>
          </EditorToolbar.Item>
          <EditorToolbar.Item selected>
            <EditorToolbar.PrefixIcon svg={<IconSunFill />} />
            <EditorToolbar.Label>밑줄</EditorToolbar.Label>
          </EditorToolbar.Item>
        </>
      ),
    },
  },
};

const Template: Story = {
  render: (args) => (
    <VariantTable
      Component={meta.component}
      variantMap={editorToolbarVariantMap}
      conditionMap={conditionMap}
      {...args}
    />
  ),
};

export const LightTheme = Template;
export const DarkTheme = createStoryWithParameters({
  ...Template,
  parameters: { theme: "dark" },
});
export const FontScalingExtraSmall = createStoryWithParameters({
  ...Template,
  parameters: { fontScale: "Extra Small" },
});
export const FontScalingExtraExtraExtraLarge = createStoryWithParameters({
  ...Template,
  parameters: { fontScale: "Extra Extra Extra Large" },
});
