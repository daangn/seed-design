import type { Meta, StoryObj } from "@storybook/nextjs";

import { createStoryWithParameters } from "@/stories/utils/parameters";
import {
  sidePanelVariantMap,
  type SidePanelVariantProps,
} from "@seed-design/css/recipes/side-panel";
import { Box, Text } from "@seed-design/react";
import type { ReactNode } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  SidePanelBody,
  SidePanelContent,
  SidePanelFooter,
  SidePanelRoot,
} from "seed-design/ui/side-panel";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";

const SidePanelPreview = ({
  size,
  title,
  description,
  showCloseButton,
  showFooter,
}: Pick<SidePanelVariantProps, "size"> & {
  title?: ReactNode;
  description?: ReactNode;
  showCloseButton?: boolean;
  showFooter?: boolean;
}) => {
  return (
    <Box width="400px" p="x4">
      <style>{`
        .seed-side-panel__positioner {
          position: relative !important;
          inset: unset !important;
        }
        .seed-side-panel__backdrop {
          display: none !important;
        }
        .seed-side-panel__content {
          position: relative !important;
          inset: unset !important;
          animation: none !important;
          height: auto !important;
          width: 100% !important;
          max-width: 100% !important;
        }
        .seed-side-panel__content::after {
          display: none !important;
        }
      `}</style>
      <SidePanelRoot open direction="right" size={size}>
        <SidePanelContent title={title} description={description} showCloseButton={showCloseButton}>
          <SidePanelBody minHeight="x16">
            <Text>Body content area</Text>
          </SidePanelBody>
          {showFooter && (
            <SidePanelFooter>
              <ActionButton variant="neutralSolid">Confirm</ActionButton>
            </SidePanelFooter>
          )}
        </SidePanelContent>
      </SidePanelRoot>
    </Box>
  );
};

const meta = {
  component: SidePanelPreview,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof SidePanelPreview>;

export default meta;

type Story = StoryObj<typeof meta>;

const conditionMap = {
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
      variantMap={sidePanelVariantMap}
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
