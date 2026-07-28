import type { Meta, StoryObj } from "@storybook/nextjs";

import { createStoryWithParameters } from "@/stories/utils/parameters";
import {
  contentDialogVariantMap,
  type ContentDialogVariantProps,
} from "@seed-design/css/recipes/content-dialog";
import { Box, HStack, Text, VStack } from "@seed-design/react";
import type { ReactNode } from "react";
import {
  DialogAction,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogRoot,
} from "seed-design/ui/dialog";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";

const BODY_LINES = Array.from(
  { length: 8 },
  (_, index) => `${index + 1}. Body가 넘치면 하단에 fade 마스크와 padding-bottom이 적용됩니다.`,
);

const DialogPreview = ({
  size,
  title,
  description,
  showCloseButton,
  overflow,
  showFooter,
}: Pick<ContentDialogVariantProps, "size"> & {
  title?: ReactNode;
  description?: ReactNode;
  showCloseButton?: boolean;
  overflow?: boolean;
  showFooter?: boolean;
}) => (
  <Box p="x4">
    <style>{`
      .seed-content-dialog__positioner {
        position: relative !important;
        inset: unset !important;
      }
      .seed-content-dialog__backdrop {
        display: none !important;
      }
      .seed-content-dialog__content {
        animation: none !important;
      }
    `}</style>
    <DialogRoot open size={size}>
      <DialogContent title={title} description={description} showCloseButton={showCloseButton}>
        {/* Body의 기본 스크롤 캡은 뷰포트 높이 기준이라 스냅샷이 캔버스 높이에 좌우된다.
            maxHeight를 고정하고 본문 길이로만 overflow 여부를 만들어 결정적으로 찍히게 한다. */}
        <DialogBody maxHeight="200px">
          <VStack gap="x4" align="stretch">
            {BODY_LINES.slice(0, overflow ? BODY_LINES.length : 1).map((line) => (
              <Text key={line} textStyle="articleBody">
                {line}
              </Text>
            ))}
          </VStack>
        </DialogBody>
        {showFooter && (
          <DialogFooter>
            <HStack gap="x2" justify="flex-end">
              <DialogAction variant="neutralWeak">Cancel</DialogAction>
              <DialogAction variant="neutralSolid">Confirm</DialogAction>
            </HStack>
          </DialogFooter>
        )}
      </DialogContent>
    </DialogRoot>
  </Box>
);

const meta = {
  component: DialogPreview,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof DialogPreview>;

export default meta;

type Story = StoryObj<typeof meta>;

const conditionMap = {
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
  showCloseButton: {
    true: { showCloseButton: true },
    false: { showCloseButton: false },
  },
  overflow: {
    true: { overflow: true },
    false: { overflow: false },
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
      variantMap={contentDialogVariantMap}
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
