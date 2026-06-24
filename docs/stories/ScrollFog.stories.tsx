import type { Meta, StoryObj } from "@storybook/nextjs";

import { Box, HStack, ScrollFog, VStack } from "@seed-design/react";

import { createStoryWithParameters } from "@/stories/utils/parameters";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";

type Placement = "top" | "bottom" | "left" | "right";

const Stripes = ({ count, vertical }: { count: number; vertical: boolean }) =>
  Array.from({ length: count }, (_, i) => (
    <Box
      key={i}
      {...(vertical ? { height: "x6", width: "full" } : { width: "x12" })}
      bg={i % 2 === 0 ? "palette.blue400" : "palette.blue300"}
    />
  ));

const ScrollFogPreview = ({
  placement = ["top", "bottom"],
  size,
}: {
  placement?: Placement[];
  size?: number;
}) => {
  const hasX = placement.some((p) => p === "left" || p === "right");
  const hasY = placement.some((p) => p === "top" || p === "bottom");

  return (
    <Box
      width="240px"
      height="160px"
      bg="bg.layerDefault"
      borderRadius="r2"
      overflowX="hidden"
      overflowY="hidden"
    >
      <ScrollFog placement={placement} size={size} hideScrollBar>
        {hasX && hasY ? (
          <Box
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(8, 48px)",
              width: "max-content",
            }}
          >
            {Array.from({ length: 64 }, (_, i) => (
              <Box
                key={i}
                height="x12"
                bg={(Math.floor(i / 8) + i) % 2 === 0 ? "palette.blue400" : "palette.blue300"}
              />
            ))}
          </Box>
        ) : hasX ? (
          <HStack gap="0" height="full" width="max-content">
            <Stripes count={16} vertical={false} />
          </HStack>
        ) : (
          <VStack gap="0" width="full">
            <Stripes count={16} vertical />
          </VStack>
        )}
      </ScrollFog>
    </Box>
  );
};

const meta = {
  component: ScrollFogPreview,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof ScrollFogPreview>;

export default meta;

type Story = StoryObj<typeof meta>;

const conditionMap = {
  placement: {
    "top, bottom": { placement: ["top", "bottom"] },
    "left, right": { placement: ["left", "right"] },
    all: { placement: ["top", "bottom", "left", "right"] },
  },
  size: {
    "20": { size: 20 },
    "40": { size: 40 },
  },
};

const CommonStoryTemplate: Story = {
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
