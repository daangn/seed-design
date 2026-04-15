import type { Meta, StoryObj } from "@storybook/nextjs";

import { createStoryWithParameters } from "@/stories/utils/parameters";
import { Box, Text } from "@seed-design/react";
import type { ReactNode } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import { DrawerBody, DrawerContent, DrawerFooter, DrawerRoot } from "seed-design/ui/drawer";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";

const DrawerPreview = ({
  size,
  title,
  description,
  showCloseButton,
  showFooter,
}: {
  size?: "small" | "medium" | "large";
  title?: ReactNode;
  description?: ReactNode;
  showCloseButton?: boolean;
  showFooter?: boolean;
}) => {
  return (
    <Box width="400px" p="x4">
      <style>{`
        .seed-drawer__positioner {
          position: relative !important;
          inset: unset !important;
        }
        .seed-drawer__backdrop {
          display: none !important;
        }
        .seed-drawer__content {
          animation: none !important;
          height: auto !important;
          width: 100% !important;
        }
      `}</style>
      <DrawerRoot open direction="right" size={size}>
        <DrawerContent title={title} description={description} showCloseButton={showCloseButton}>
          <DrawerBody minHeight="x16">
            <Text>Body content area</Text>
          </DrawerBody>
          {showFooter && (
            <DrawerFooter>
              <ActionButton variant="neutralSolid">Confirm</ActionButton>
            </DrawerFooter>
          )}
        </DrawerContent>
      </DrawerRoot>
    </Box>
  );
};

const meta = {
  component: DrawerPreview,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof DrawerPreview>;

export default meta;

type Story = StoryObj<typeof meta>;

const conditionMap = {
  size: {
    small: { size: "small" as const },
    medium: { size: "medium" as const },
    large: { size: "large" as const },
  },
  showCloseButton: {
    true: { showCloseButton: true },
    false: { showCloseButton: false },
  },
  title: {
    true: {
      title: "이것은 매우 긴 제목 텍스트입니다. 여러 줄에 걸쳐 표시될 수 있습니다.",
    },
    false: { title: undefined },
  },
  description: {
    true: {
      description:
        "이것은 매우 긴 설명 텍스트입니다. Deserunt id enim quis nisi est tempor officia.",
    },
    false: { description: undefined },
  },
  showFooter: {
    true: { showFooter: true },
    false: { showFooter: false },
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
