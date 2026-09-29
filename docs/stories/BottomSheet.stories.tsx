import preview from "../.storybook/preview";
import { withVisualTestParameters } from "@/stories/utils/parameters";
import {
  bottomSheetVariantMap,
  type BottomSheetVariantProps,
} from "@seed-design/css/recipes/bottom-sheet";
import { Text } from "@seed-design/react";
import type { ReactNode } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
  BottomSheetTrigger,
} from "seed-design/ui/bottom-sheet";
import { SeedThemeDecorator } from "./components/decorator";
import { verifyModalInteraction } from "./components/modal-interaction";
import { ModalVisualPreview } from "./components/modal-visual-preview";
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
    <ModalVisualPreview width="400px">
      <BottomSheetRoot open modal={false} autoFocus={false} headerAlign={headerAlign}>
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
    </ModalVisualPreview>
  );
};

const meta = preview.meta({
  component: BottomSheetPreview,
  decorators: [SeedThemeDecorator],
});
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

const CommonStoryTemplate = meta.story({
  render: (args, { component }) => (
    <VariantTable
      Component={component!}
      variantMap={restVariantMap}
      conditionMap={conditionMap}
      {...args}
    />
  ),
});

export const LightTheme = CommonStoryTemplate.extend({});

export const DarkTheme = CommonStoryTemplate.extend({
  parameters: withVisualTestParameters({ theme: "dark" }),
});

export const FontScalingExtraSmall = CommonStoryTemplate.extend({
  parameters: withVisualTestParameters({ fontScale: "Extra Small" }),
});

export const FontScalingExtraExtraExtraLarge = CommonStoryTemplate.extend({
  parameters: withVisualTestParameters({ fontScale: "Extra Extra Extra Large" }),
});

export const ModalInteraction = meta.story({
  render: () => (
    <div style={{ minHeight: "150vh" }}>
      <BottomSheetRoot>
        <BottomSheetTrigger asChild>
          <button type="button">Open modal</button>
        </BottomSheetTrigger>
        <BottomSheetContent
          title="Modal interaction"
          description="Focus, scroll lock, Escape and focus restoration"
          showCloseButton
        >
          <BottomSheetBody>
            <button type="button">Inside modal</button>
          </BottomSheetBody>
        </BottomSheetContent>
      </BottomSheetRoot>
    </div>
  ),
  parameters: { kapture: { captureArea: "viewport" } },
  play: verifyModalInteraction,
});
