import type { Meta, StoryObj } from "@storybook/nextjs";

import { createStoryWithParameters } from "@/stories/utils/parameters";
import { dialogVariantMap } from "@ride-developer/css/recipes/dialog";
import { Box, ResponsivePair, VStack } from "@ride-developer/react";
import {
  AlertDialogRoot,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "seed-design/ui/alert-dialog";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";
import type { ReactNode } from "react";

const AlertDialogPreview = ({
  title,
  description,
  footer,
}: {
  title?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
}) => {
  return (
    <Box width="400px" p="x4">
      <style>{`
        .seed-dialog__positioner {
          position: relative !important;
          inset: unset !important;
        }
        .seed-dialog__backdrop {
          display: none !important;
        }
        .seed-dialog__content {
          animation: none !important;
        }
      `}</style>
      <AlertDialogRoot open>
        <AlertDialogContent>
          <AlertDialogHeader>
            {title && <AlertDialogTitle>{title}</AlertDialogTitle>}
            {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
          </AlertDialogHeader>
          <AlertDialogFooter>{footer}</AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogRoot>
    </Box>
  );
};

const meta = {
  component: AlertDialogPreview,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof AlertDialogPreview>;

export default meta;

type Story = StoryObj<typeof meta>;

const { skipAnimation: _skipAnimation, ...restVariantMap } = dialogVariantMap;

const conditionMap = {
  body: {
    description: {
      description:
        "이것은 매우 긴 설명 텍스트입니다. 여러 줄에 걸쳐 표시될 수 있으며, 텍스트가 어떻게 줄바꿈되고 레이아웃에 영향을 주는지 확인할 수 있습니다. This is a very long description.",
    },
    titleDescription: {
      title: "이것은 매우 긴 제목 텍스트입니다. 여러 줄에 걸쳐 표시될 수 있습니다.",
      description:
        "이것은 매우 긴 설명 텍스트입니다. 여러 줄에 걸쳐 표시될 수 있으며, 텍스트가 어떻게 줄바꿈되고 레이아웃에 영향을 주는지 확인할 수 있습니다. This is a very long description.",
    },
  },
  actions: {
    single: { footer: <AlertDialogAction variant="neutralSolid">Confirm</AlertDialogAction> },
    neutral: {
      footer: (
        <ResponsivePair gap="x2">
          <AlertDialogAction variant="neutralWeak">Cancel</AlertDialogAction>
          <AlertDialogAction variant="neutralSolid">Confirm</AlertDialogAction>
        </ResponsivePair>
      ),
    },
    critical: {
      footer: (
        <ResponsivePair gap="x2">
          <AlertDialogAction variant="neutralWeak">Cancel</AlertDialogAction>
          <AlertDialogAction variant="criticalSolid">Delete</AlertDialogAction>
        </ResponsivePair>
      ),
    },
    nonpreferred: {
      footer: (
        <VStack gap="x4" alignSelf="stretch">
          <AlertDialogAction size="medium" variant="neutralSolid" layout="withText">
            Confirm
          </AlertDialogAction>
          <AlertDialogAction
            size="medium"
            variant="ghost"
            layout="withText"
            color="fg.neutralMuted"
            fontWeight="bold"
            bleedY="asPadding"
          >
            Cancel
          </AlertDialogAction>
        </VStack>
      ),
    },
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
