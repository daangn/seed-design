import type { Meta, StoryObj } from "@storybook/nextjs";

import { createStoryWithParameters } from "@/stories/utils/parameters";
import { dialogVariantMap } from "@seed-design/css/recipes/dialog";
import { Box, ResponsivePair } from "@seed-design/react";
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
    description: { description: "Description text can be written here" },
    titleDescription: { title: "Title", description: "Description text can be written here" },
  },
  actions: {
    2: {
      footer: (
        <ResponsivePair gap="x2">
          <AlertDialogAction variant="neutralWeak">Cancel</AlertDialogAction>
          <AlertDialogAction variant="neutralSolid">Confirm</AlertDialogAction>
        </ResponsivePair>
      ),
    },
    1: { footer: <AlertDialogAction variant="neutralSolid">Confirm</AlertDialogAction> },
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
