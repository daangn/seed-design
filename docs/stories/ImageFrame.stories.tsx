import type { Meta, StoryObj } from "@storybook/nextjs";

import { ImageFrame } from "@seed-design/react";

import { imageFrameVariantMap } from "@seed-design/css/recipes/image-frame";
import { createStoryWithParameters } from "@/stories/utils/parameters";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";

const meta = {
  component: ImageFrame,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof ImageFrame>;

export default meta;

type Story = StoryObj<typeof meta>;

type ImageFrameCase = {
  caseLabel: string;
  src: string;
  width: string;
  ratio: number;
  height?: string;
};

type ImageFrameCaseProps = ImageFrameCase & {
  rounded?: boolean;
  stroke?: boolean;
};

const IMAGE_CASES: ImageFrameCase[] = [
  {
    caseLabel: "ratio=1, width=96",
    src: "https://placehold.co/320x180/ff7a00/ffffff?text=16:9",
    width: "96px",
    ratio: 1,
  },
  {
    caseLabel: "ratio=4/3, width=120",
    src: "https://placehold.co/180x320/4c6fff/ffffff?text=9:16",
    width: "120px",
    ratio: 4 / 3,
  },
  {
    caseLabel: "ratio=16/9, width=160",
    src: "https://placehold.co/240x240/00b894/ffffff?text=1:1",
    width: "160px",
    ratio: 16 / 9,
  },
  {
    caseLabel: "ratio=4/3, width=160, height=120",
    src: "https://placehold.co/320x180/ffb300/ffffff?text=16:9",
    width: "160px",
    height: "120px",
    ratio: 4 / 3,
  },
  {
    caseLabel: "ratio=1, width=120, height=80",
    src: "https://placehold.co/320x180/8e44ad/ffffff?text=16:9",
    width: "120px",
    height: "80px",
    ratio: 1,
  },
  {
    caseLabel: "ratio=3/4, width=120",
    src: "https://placehold.co/180x320/2d3436/ffffff?text=9:16",
    width: "120px",
    ratio: 3 / 4,
  },
];

const conditionMap = {
  caseLabel: IMAGE_CASES.reduce(
    (acc, item) => {
      acc[item.caseLabel] = {
        caseLabel: item.caseLabel,
        src: item.src,
        width: item.width,
        height: item.height,
        ratio: item.ratio,
      };

      return acc;
    },
    {} as Record<string, ImageFrameCase>,
  ),
};

const ImageFrameCase = ({
  caseLabel,
  src,
  width,
  height,
  ratio,
  rounded,
  stroke,
}: ImageFrameCaseProps) => {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <ImageFrame
        src={src}
        alt={caseLabel}
        ratio={ratio}
        width={width}
        height={height}
        rounded={rounded}
        stroke={stroke}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <span style={{ fontSize: "12px", color: "var(--seed-color-fg-placeholder)" }}>
          {caseLabel}
        </span>
        <code style={{ fontSize: "12px", fontFamily: "Courier", wordBreak: "break-all" }}>
          src: {src}
        </code>
        <code style={{ fontSize: "12px", fontFamily: "Courier" }}>width: {width}</code>
        <code style={{ fontSize: "12px", fontFamily: "Courier" }}>ratio: {ratio}</code>
        <code style={{ fontSize: "12px", fontFamily: "Courier" }}>height: {height ?? "-"}</code>
      </div>
    </div>
  );
};

const CommonStoryTemplate: Story = {
  args: {
    src: "https://placehold.co/1x1/000000/ffffff",
    alt: "ImageFrame placeholder",
  },
  render: (args) => (
    <VariantTable
      Component={ImageFrameCase}
      variantMap={imageFrameVariantMap}
      conditionMap={conditionMap}
      {...args}
    />
  ),
};

export const LightTheme = CommonStoryTemplate;

export const DarkTheme = createStoryWithParameters({
  ...CommonStoryTemplate,
  parameters: { theme: "dark" },
});

export const FontScalingExtraSmall = createStoryWithParameters({
  ...CommonStoryTemplate,
  parameters: { fontScale: "Extra Small" },
});

export const FontScalingExtraExtraExtraLarge = createStoryWithParameters({
  ...CommonStoryTemplate,
  parameters: { fontScale: "Extra Extra Extra Large" },
});
