import preview from "../.storybook/preview";

import { Box, HStack, Text } from "@seed-design/react";
import {
  ResponsiveDialogAction,
  ResponsiveDialogBody,
  ResponsiveDialogContent,
  ResponsiveDialogFooter,
  ResponsiveDialogRoot,
} from "seed-design/ui/responsive-dialog";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";
import { VISUAL_VIEWPORT_PARAMETERS } from "./utils/parameters";

const ResponsiveDialogPreview = ({
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
      .seed-content-dialog__positioner,
      .seed-bottom-sheet__positioner {
        position: relative !important;
        inset: unset !important;
      }
      .seed-content-dialog__backdrop,
      .seed-bottom-sheet__backdrop {
        display: none !important;
      }
      .seed-content-dialog__content,
      .seed-bottom-sheet__content {
        animation: none !important;
      }
      /* size별 너비는 Dialog story가 덮는다. 여기서는 뷰포트마다 폭이 흔들리지 않게
         고정해, 스냅샷 간 차이가 Dialog/BottomSheet 전환에서만 나오도록 한다. */
      .seed-content-dialog__content {
        width: 100% !important;
        max-width: 100% !important;
      }
      .seed-bottom-sheet__content::after {
        height: unset !important;
      }
    `}</style>
    <ResponsiveDialogRoot open>
      <ResponsiveDialogContent
        title="Responsive Dialog"
        description="md 이상에서는 Dialog, sm 이하에서는 Bottom Sheet로 렌더링됩니다."
        showCloseButton={showCloseButton}
        showHandle={showHandle}
      >
        <ResponsiveDialogBody minHeight="x16">
          <Text textStyle="articleBody">Body content area</Text>
        </ResponsiveDialogBody>
        {showFooter && (
          <ResponsiveDialogFooter>
            <HStack gap="x2" justify="flex-end">
              <ResponsiveDialogAction variant="neutralWeak">Cancel</ResponsiveDialogAction>
              <ResponsiveDialogAction variant="neutralSolid">Confirm</ResponsiveDialogAction>
            </HStack>
          </ResponsiveDialogFooter>
        )}
      </ResponsiveDialogContent>
    </ResponsiveDialogRoot>
  </Box>
);

const meta = preview.meta({
  component: ResponsiveDialogPreview,
  decorators: [SeedThemeDecorator],
});

const conditionMap = {
  showCloseButton: {
    true: { showCloseButton: true },
    false: { showCloseButton: false },
  },
  // Handle은 sm 이하(Bottom Sheet)에서만 렌더링되고, md 이상(Dialog)에서는 무시되어야 한다.
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
 * 테마/폰트 스케일은 분기되는 Dialog, BottomSheet 각 story가 이미 덮으므로,
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
