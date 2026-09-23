import preview from "../.storybook/preview";
import { withChromaticParameters } from "@/stories/utils/parameters";
import { popoverVariantMap } from "@seed-design/css/recipes/popover";
import { type ReactNode, useCallback, useRef, useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import { PopoverBody, PopoverContent, PopoverFooter, PopoverRoot } from "seed-design/ui/popover";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";
import { VIEWPORT_MODES } from "./utils/parameters";

const BODY_LINES = Array.from(
  { length: 8 },
  (_, index) => `${index + 1}. Body가 넘치면 하단에 scroll fog와 padding-bottom이 적용됩니다.`,
);

function PopoverPreview({
  title,
  description,
  showCloseButton,
  overflow,
  showFooter,
}: {
  title?: ReactNode;
  description?: ReactNode;
  showCloseButton?: boolean;
  overflow?: boolean;
  showFooter?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);

  const setRef = useCallback((node: HTMLDivElement | null) => {
    containerRef.current = node;
    setMounted(!!node);
  }, []);

  return (
    <div ref={setRef}>
      {/* The positioner portals into containerRef, which is still null on the first render. */}
      {mounted && (
        <PopoverRoot open>
          <PopoverContent
            title={title}
            description={description}
            showCloseButton={showCloseButton}
            positionerContainer={containerRef}
          >
            {/* The default cap follows the viewport, so pin it and let the line count alone
                decide whether the body overflows. */}
            <PopoverBody maxHeight="120px">
              {BODY_LINES.slice(0, overflow ? BODY_LINES.length : 1).map((line) => (
                <p key={line} style={{ margin: 0 }}>
                  {line}
                </p>
              ))}
            </PopoverBody>
            {showFooter && (
              <PopoverFooter>
                <ActionButton variant="neutralSolid">확인</ActionButton>
              </PopoverFooter>
            )}
          </PopoverContent>
        </PopoverRoot>
      )}
    </div>
  );
}

const meta = preview.meta({
  component: PopoverPreview,
  decorators: [
    // floating-ui places the positioner absolutely; pull it back into the table cell and drop
    // the enter animation for a stable snapshot.
    (Story) => (
      <>
        <style>{`
          .seed-popover__positioner {
            position: relative !important;
            inset: unset !important;
            transform: none !important;
          }
          .seed-popover__content {
            animation: none !important;
          }
        `}</style>
        <Story />
      </>
    ),
    SeedThemeDecorator,
  ],
});

const TITLE = "이것은 매우 긴 제목 텍스트입니다. 여러 줄에 걸쳐 표시될 수 있습니다.";
const DESCRIPTION =
  "이것은 매우 긴 설명 텍스트입니다. Deserunt id enim quis nisi est tempor officia.";

const conditionMap = {
  header: {
    title: { title: TITLE, description: undefined },
    titleDescription: { title: TITLE, description: DESCRIPTION },
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

const CommonStoryTemplate = meta.story({
  render: (args, { component }) => (
    <VariantTable
      Component={component!}
      variantMap={popoverVariantMap}
      conditionMap={conditionMap}
      {...args}
    />
  ),
});

export const LightTheme = CommonStoryTemplate.extend({
  parameters: {
    chromatic: { modes: VIEWPORT_MODES },
  },
});

export const DarkTheme = CommonStoryTemplate.extend({
  parameters: withChromaticParameters({ theme: "dark" }),
});

export const FontScalingExtraSmall = CommonStoryTemplate.extend({
  parameters: withChromaticParameters({ fontScale: "Extra Small" }),
});

export const FontScalingExtraExtraExtraLarge = CommonStoryTemplate.extend({
  parameters: withChromaticParameters({ fontScale: "Extra Extra Extra Large" }),
});
