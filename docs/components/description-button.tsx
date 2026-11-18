import IconILowercaseSerifCircleLine from "@karrotmarket/react-monochrome-icon/IconILowercaseSerifCircleLine";
import { helpBubble } from "@seed-design/css/recipes/help-bubble";
import { Icon } from "@seed-design/react";
import { type CSSProperties, useId } from "react";
import { ActionButton } from "seed-design/ui/action-button";

const classNames = helpBubble();

/** SEED `HelpBubbleArrowTip`이 12×8 tip, `tipRadius` 2로 그리는 path(`getHelpBubbleArrowTipPath`). */
const ARROW_TIP_PATH = "M0,0 H12 L8,6 Q6,8 4,6 Z";

/**
 * 슬롯·속성 설명 버튼. SEED `HelpBubbleTrigger`(placement top)의 서버 HTML과 같은 DOM·recipe class를 닫힌 상태로
 * 정적으로 그린다(닫힌 trigger에는 `aria-controls`가 없다). 열고 닫기·focus·위치는 `help-bubble` widget
 * (`src/mdx/widgets.ts`)이 맡는다.
 */
export function DescriptionButton({ description }: { description: string }) {
  const id = useId();
  const contentId = `${id}help-bubble`;
  const titleId = `${id}help-bubble-title`;

  return (
    <span data-widget="help-bubble" className="contents">
      <ActionButton
        size="xsmall"
        variant="ghost"
        layout="iconOnly"
        aria-label="설명 보기"
        aria-haspopup="dialog"
        aria-expanded={false}
        data-side="top"
        bleedX="asPadding"
        bleedY="asPadding"
      >
        <Icon svg={<IconILowercaseSerifCircleLine />} />
      </ActionButton>
      <div
        data-side="top"
        className={classNames.positioner}
        style={
          {
            "--seed-safe-area-top": "env(safe-area-inset-top)",
            "--seed-safe-area-right": "env(safe-area-inset-right)",
            "--seed-safe-area-bottom": "env(safe-area-inset-bottom)",
            "--seed-safe-area-left": "env(safe-area-inset-left)",
            position: "fixed",
            left: "var(--help-bubble-x, 0px)",
            top: "var(--help-bubble-y, 0px)",
          } as CSSProperties
        }
      >
        <div
          id={contentId}
          role="dialog"
          // biome-ignore lint/a11y/noNoninteractiveTabindex: SEED PopoverContent makes the content the Tab stop after the trigger.
          tabIndex={0}
          aria-labelledby={titleId}
          data-side="top"
          hidden
          className={classNames.content}
          style={{ "--seed-popover-transform-origin": "center bottom" } as CSSProperties}
        >
          <div
            data-side="top"
            className={`${classNames.arrow} top-full data-[side=bottom]:top-auto data-[side=bottom]:bottom-full data-[side=bottom]:rotate-180`}
            style={{ position: "absolute", left: "var(--help-bubble-arrow-x, 0px)" }}
          >
            <svg aria-hidden="true" viewBox="0 0 12 8" className={classNames.arrowTip}>
              <path stroke="none" d={ARROW_TIP_PATH} />
            </svg>
          </div>
          <div data-side="top" className={classNames.body}>
            <span id={titleId} data-side="top" className={classNames.title}>
              {description}
            </span>
          </div>
        </div>
      </div>
    </span>
  );
}
