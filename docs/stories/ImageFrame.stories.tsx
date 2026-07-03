import type { Meta, StoryObj } from "@storybook/nextjs";

import { IconCarrotFill } from "@karrotmarket/react-monochrome-icon";
import {
  Flex,
  ImageFrame,
  ImageFrameBadge,
  ImageFrameFloater,
  ImageFrameIcon,
  ImageFrameIndicator,
  ImageFrameReactionButton,
  Text,
  VStack,
} from "@seed-design/react";
import { useState } from "react";

import { imageFrameVariantMap } from "@seed-design/css/recipes/image-frame";
import { createStoryWithParameters } from "@/stories/utils/parameters";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";

const SAMPLE_IMAGE = `data:image/svg+xml,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#6ba6ff'/><stop offset='1' stop-color='#b06bff'/></linearGradient></defs><rect width='200' height='200' fill='url(#g)'/></svg>",
)}`;

const BRIGHT_IMAGE = `data:image/svg+xml,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><rect width='240' height='240' fill='#ffffff'/><circle cx='48' cy='52' r='32' fill='#f4f6f8'/><circle cx='186' cy='76' r='44' fill='#f8fafb'/><rect x='28' y='150' width='184' height='48' rx='24' fill='#f1f3f5'/><path d='M20 122C72 84 112 166 166 118C194 94 212 98 230 114' fill='none' stroke='#e8ebee' stroke-width='10' stroke-linecap='round'/></svg>",
)}`;

const meta = {
  component: ImageFrame,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof ImageFrame>;

export default meta;

type Story = StoryObj<typeof meta>;

const conditionMap = {
  ratio: {
    "1": { ratio: 1, style: { width: "96px" } },
    "4/3": { ratio: 4 / 3, style: { width: "120px" } },
    "16/9": { ratio: 16 / 9, style: { width: "160px" } },
  },
  borderRadius: {
    "not-set": {},
    0: { borderRadius: "0" },
    r4: { borderRadius: "r4" },
    full: { borderRadius: "full" },
  },
};

const CommonStoryTemplate: Story = {
  args: {
    src: SAMPLE_IMAGE,
    alt: "ImageFrame placeholder",
  },
  render: (args) => (
    <VariantTable
      Component={meta.component}
      variantMap={imageFrameVariantMap}
      conditionMap={conditionMap}
      {...args}
    />
  ),
};

const OverlayExamples = () => {
  const [liked, setLiked] = useState(false);

  return (
    <Flex gap="x3" wrap="wrap" align="flex-end">
      <VStack gap="x2" alignItems="center">
        <ImageFrame
          ratio={1}
          borderRadius="r2"
          stroke
          src={BRIGHT_IMAGE}
          alt="Bright image with badge overlay"
          style={{ width: 120 }}
        >
          <ImageFrameFloater placement="bottom-end">
            <ImageFrameBadge tone="brand" variant="solid">
              NEW
            </ImageFrameBadge>
          </ImageFrameFloater>
        </ImageFrame>
        <Text color="palette.gray700" textStyle="t1Regular">
          Badge
        </Text>
      </VStack>

      <VStack gap="x2" alignItems="center">
        <ImageFrame
          ratio={1}
          borderRadius="r2"
          stroke
          src={BRIGHT_IMAGE}
          alt="Bright image with icon overlay"
          style={{ width: 120 }}
        >
          <ImageFrameFloater placement="bottom-end">
            <ImageFrameIcon svg={<IconCarrotFill />} />
          </ImageFrameFloater>
        </ImageFrame>
        <Text color="palette.gray700" textStyle="t1Regular">
          Icon
        </Text>
      </VStack>

      <VStack gap="x2" alignItems="center">
        <ImageFrame
          ratio={1}
          borderRadius="r2"
          stroke
          src={BRIGHT_IMAGE}
          alt="Bright image with indicator overlay"
          style={{ width: 120 }}
        >
          <ImageFrameFloater placement="bottom-end">
            <ImageFrameIndicator>+9</ImageFrameIndicator>
          </ImageFrameFloater>
        </ImageFrame>
        <Text color="palette.gray700" textStyle="t1Regular">
          Indicator
        </Text>
      </VStack>

      <VStack gap="x2" alignItems="center">
        <ImageFrame
          ratio={1}
          borderRadius="r2"
          stroke
          src={BRIGHT_IMAGE}
          alt="Bright image with reaction button overlay"
          style={{ width: 120 }}
        >
          <ImageFrameFloater placement="bottom-end">
            <ImageFrameReactionButton
              pressed={liked}
              onPressedChange={setLiked}
              aria-label="Like"
            />
          </ImageFrameFloater>
        </ImageFrame>
        <Text color="palette.gray700" textStyle="t1Regular">
          ReactionButton
        </Text>
      </VStack>
    </Flex>
  );
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

export const Overlay = {
  args: {
    src: BRIGHT_IMAGE, // intentionally ignored, OverlayExamples renders its own frames
    alt: "",
  },
  render: () => <OverlayExamples />,
} satisfies Story;
