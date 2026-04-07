import type { Meta, StoryObj } from "@storybook/nextjs";

import { createStoryWithParameters } from "@/stories/utils/parameters";
import {
  bottomSheetVariantMap,
  type BottomSheetVariantProps,
} from "@ride-developer/css/recipes/bottom-sheet";
import { Box, Text } from "@ride-developer/react";
import type { ReactNode } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
} from "seed-design/ui/bottom-sheet";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";

const BottomSheetPreview = ({
  headerAlign,
  title,
  description,
  showHandle,
  showCloseButton,
  showFooter,
}: Pick<BottomSheetVariantProps, "headerAlign"> & {
  title?: ReactNode;
  description?: ReactNode;
  showHandle?: boolean;
  showCloseButton?: boolean;
  showFooter?: boolean;
}) => {
  return (
    <Box width="400px" p="x4">
      <style>{`
        .seed-bottom-sheet__positioner {
          position: relative !important;
          inset: unset !important;
        }
        .seed-bottom-sheet__backdrop {
          display: none !important;
        }
        .seed-bottom-sheet__content {
          animation: none !important;
        }
        .seed-bottom-sheet__content::after {
          height: unset !important;
        }
      `}</style>
      <BottomSheetRoot open headerAlign={headerAlign}>
        <BottomSheetContent
          title={title}
          description={description}
          showHandle={showHandle}
          showCloseButton={showCloseButton}
        >
          <BottomSheetBody minHeight="x16">
            <Text>Body content area</Text>
          </BottomSheetBody>
          {showFooter && (
            <BottomSheetFooter>
              <ActionButton variant="neutralSolid">Confirm</ActionButton>
            </BottomSheetFooter>
          )}
        </BottomSheetContent>
      </BottomSheetRoot>
    </Box>
  );
};

const meta = {
  component: BottomSheetPreview,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof BottomSheetPreview>;

export default meta;

type Story = StoryObj<typeof meta>;

const { skipAnimation: _skipAnimation, ...restVariantMap } = bottomSheetVariantMap;

const conditionMap = {
  showHandle: {
    true: { showHandle: true },
    false: { showHandle: false },
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
      variantMap={restVariantMap}
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
