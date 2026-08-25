import preview from "../.storybook/preview";

import { Box, HStack, Text } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  ResponsiveSidePanelBody,
  ResponsiveSidePanelContent,
  ResponsiveSidePanelFooter,
  ResponsiveSidePanelRoot,
} from "seed-design/ui/responsive-side-panel";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";
import { VISUAL_VIEWPORT_PARAMETERS } from "./utils/parameters";

const ResponsiveSidePanelPreview = ({
  showCloseButton,
  showHandle,
  showFooter,
}: {
  showCloseButton?: boolean;
  showHandle?: boolean;
  showFooter?: boolean;
}) => (
  <Box width="400px" p="x4">
    <style>{`
      .seed-side-panel__positioner,
      .seed-bottom-sheet__positioner {
        position: relative !important;
        inset: unset !important;
      }
      .seed-bottom-sheet__positioner {
        display: block !important;
      }
      .seed-side-panel__backdrop,
      .seed-bottom-sheet__backdrop {
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
      .seed-bottom-sheet__content {
        animation: none !important;
        width: 100% !important;
        height: auto !important;
        flex: none !important;
      }
      .seed-bottom-sheet__content::after {
        height: unset !important;
      }
    `}</style>
    <ResponsiveSidePanelRoot open>
      <ResponsiveSidePanelContent
        title="Responsive Side Panel"
        description="md 이상에서는 Side Panel, sm 이하에서는 Bottom Sheet로 렌더링됩니다."
        showCloseButton={showCloseButton}
        showHandle={showHandle}
      >
        <ResponsiveSidePanelBody minHeight="x16">
          <Text textStyle="articleBody">Body content area</Text>
        </ResponsiveSidePanelBody>
        {showFooter && (
          <ResponsiveSidePanelFooter>
            <HStack gap="x2" justify="flex-end">
              <ActionButton variant="neutralWeak">Cancel</ActionButton>
              <ActionButton variant="neutralSolid">Confirm</ActionButton>
            </HStack>
          </ResponsiveSidePanelFooter>
        )}
      </ResponsiveSidePanelContent>
    </ResponsiveSidePanelRoot>
  </Box>
);

const meta = preview.meta({
  component: ResponsiveSidePanelPreview,
  decorators: [SeedThemeDecorator],
});

const conditionMap = {
  showCloseButton: {
    true: { showCloseButton: true },
    false: { showCloseButton: false },
  },
  // Handle은 sm 이하(Bottom Sheet)에서만 렌더링되고, md 이상(Side Panel)에서는 무시되어야 한다.
  showHandle: {
    true: { showHandle: true },
    false: { showHandle: false },
  },
  showFooter: {
    true: { showFooter: true },
    false: { showFooter: false },
  },
};

/**
 * 테마/폰트 스케일은 분기되는 SidePanel, BottomSheet 각 story가 이미 덮으므로,
 * 여기서는 브레이크포인트 전환만 뷰포트별로 스냅샷한다.
 */
export const LightTheme = meta.story({
  render: (args, { component }) => (
    <VariantTable Component={component!} variantMap={{}} conditionMap={conditionMap} {...args} />
  ),
  parameters: {
    ...VISUAL_VIEWPORT_PARAMETERS,
  },
});
