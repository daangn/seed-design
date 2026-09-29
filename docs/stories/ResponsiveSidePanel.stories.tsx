import preview from "../.storybook/preview";

import { HStack, Text } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  ResponsiveSidePanelBody,
  ResponsiveSidePanelContent,
  ResponsiveSidePanelFooter,
  ResponsiveSidePanelRoot,
  ResponsiveSidePanelTrigger,
} from "seed-design/ui/responsive-side-panel";
import { SeedThemeDecorator } from "./components/decorator";
import { verifyModalInteraction } from "./components/modal-interaction";
import { ModalVisualPreview } from "./components/modal-visual-preview";
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
  <ModalVisualPreview width="400px">
    <ResponsiveSidePanelRoot
      open
      sidePanelRootProps={{ modal: false, autoFocus: false }}
      bottomSheetRootProps={{ modal: false, autoFocus: false }}
    >
      <ResponsiveSidePanelContent
        title="Responsive Side Panel"
        description="md 이상에서는 Side Panel, sm 이하에서는 Bottom Sheet로 렌더링됩니다."
        showCloseButton={showCloseButton}
        showHandle={showHandle}
      >
        <ResponsiveSidePanelBody>
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
  </ModalVisualPreview>
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

export const ModalInteraction = meta.story({
  render: () => (
    <div style={{ minHeight: "150vh" }}>
      <ResponsiveSidePanelRoot>
        <ResponsiveSidePanelTrigger asChild>
          <button type="button">Open modal</button>
        </ResponsiveSidePanelTrigger>
        <ResponsiveSidePanelContent
          title="Modal interaction"
          description="Focus, scroll lock, Escape and focus restoration"
          showCloseButton
        >
          <ResponsiveSidePanelBody>
            <button type="button">Inside modal</button>
          </ResponsiveSidePanelBody>
        </ResponsiveSidePanelContent>
      </ResponsiveSidePanelRoot>
    </div>
  ),
  parameters: {
    ...VISUAL_VIEWPORT_PARAMETERS,
    kapture: { ...VISUAL_VIEWPORT_PARAMETERS.kapture, captureArea: "viewport" },
  },
  play: verifyModalInteraction,
});
