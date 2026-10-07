import { helpBubble, type HelpBubbleVariantProps } from "@seed-design/lynx-css/recipes/help-bubble";
import * as React from "@lynx-js/react";
import {
  PopoverAnchor,
  PopoverArrow,
  PopoverContent,
  PopoverPositioner,
  PopoverProvider,
  PopoverTrigger,
  usePopover,
  usePopoverCloseButton,
  usePopoverContext,
  type PopoverPositionerProps,
  type UsePopoverProps,
} from "@seed-design/lynx-react-popover";
import clsx from "clsx";

import type { LynxHostProps, LynxTextRef, LynxViewProps, LynxViewRef } from "../../types";
import { createSlotRecipeContext } from "../../utils/create-slot-recipe-context";
import { mergeProps } from "../../utils/merge-props";
import { useStyleProps, type StyleProps } from "../../utils/styled";

const { ClassNamesProvider, useClassNames } = createSlotRecipeContext(helpBubble);

type HelpBubblePublicVariantProps = Omit<
  HelpBubbleVariantProps,
  "open" | "positioned" | "side" | "pressed"
>;
type HelpBubbleSide = NonNullable<HelpBubbleVariantProps["side"]>;
type NativeTransitionHandler = NonNullable<LynxViewProps["bindtransitionend"]>;

// help-bubble recipe의 arrow(12×12)와 arrowTip이 콘텐츠 밖으로 튀어나온 길이(8)입니다.
const ARROW_SIZE = 12;
const ARROW_TIP_HEIGHT = 8;
const BASE_Z_INDEX = 99;

function hasExitTransition(event: Parameters<NativeTransitionHandler>[0]): boolean {
  if (event.target.uid !== event.currentTarget.uid) return false;
  return (
    event.params.animation_type === "transition-opacity" ||
    event.params.animation_name === "opacity"
  );
}

////////////////////////////////////////////////////////////////////////////////////

export interface HelpBubbleRootProps
  extends HelpBubblePublicVariantProps,
    LynxHostProps<"view">,
    UsePopoverProps {
  /** @default "top" */
  placement?: UsePopoverProps["placement"];
  /** @default 4 */
  gutter?: number;
  /** @default 16 */
  overflowPadding?: number;
  /** @default 14 */
  arrowPadding?: number;
}

/**
 * @platform Lynx
 *
 * `@seed-design/lynx-react-popover`에 help-bubble recipe를 적용합니다. Root는 자식을 native `view`로 감쌉니다.
 * DOM portal 대신 Positioner의 `container`로 native overlay 레이어를 선택합니다.
 * 바깥 탭 닫기는 탭을 가로채지 않으므로 다른 native 요소와 독립적으로 열린 HelpBubble을 계속 탭할 수
 * 있습니다.
 */
export const HelpBubbleRoot = React.forwardRef<unknown, HelpBubbleRootProps>((props, ref) => {
  const {
    children,
    className,
    style,
    open,
    defaultOpen,
    onOpenChange,
    placement = "top",
    gutter = 4,
    overflowPadding = 16,
    arrowPadding = 14,
    flip,
    closeOnInteractOutside,
    ...nativeProps
  } = props;
  const api = usePopover({
    open,
    defaultOpen,
    onOpenChange,
    placement,
    gutter,
    overflowPadding,
    arrowPadding,
    flip,
    closeOnInteractOutside,
  });
  const classes = helpBubble({
    open: api.open,
    positioned: api.positioned,
    side: api.position?.placement.split("-")[0] as HelpBubbleSide | undefined,
    pressed: false,
  });

  return (
    <PopoverProvider value={api}>
      <ClassNamesProvider value={classes}>
        <view
          {...mergeProps(ref ? { ref: ref as LynxViewRef } : {}, nativeProps)}
          className={className}
          style={style}
        >
          {children}
        </view>
      </ClassNamesProvider>
    </PopoverProvider>
  );
});
HelpBubbleRoot.displayName = "HelpBubbleRoot";

////////////////////////////////////////////////////////////////////////////////////

export interface HelpBubbleAnchorProps extends LynxHostProps<"view"> {}

export const HelpBubbleAnchor: React.ForwardRefExoticComponent<
  HelpBubbleAnchorProps & React.RefAttributes<unknown>
> = PopoverAnchor;

////////////////////////////////////////////////////////////////////////////////////

export interface HelpBubbleTriggerProps extends LynxHostProps<"view"> {}

export const HelpBubbleTrigger: React.ForwardRefExoticComponent<
  HelpBubbleTriggerProps & React.RefAttributes<unknown>
> = PopoverTrigger;

////////////////////////////////////////////////////////////////////////////////////

export interface HelpBubblePositionerProps
  extends LynxHostProps<"view">,
    Pick<PopoverPositionerProps, "container" | "overlayLevel" | "overlayViewProps"> {
  /**
   * Positioner의 기본 z-index `99`에 더합니다. `container`가 없을 때 같은 화면의 형제 요소와의 순서를
   * 정합니다. `container`를 지정하면 native overlay 사이의 순서는 `overlayLevel`과 표시 순서가 정합니다.
   * @default 0
   */
  zIndexOffset?: number;
}

export const HelpBubblePositioner = React.forwardRef<unknown, HelpBubblePositionerProps>(
  (props, ref) => {
    const { className, style, zIndexOffset = 0, ...positionerProps } = props;
    const classNames = useClassNames();

    return (
      <PopoverPositioner
        {...(ref ? { ref } : {})}
        {...positionerProps}
        className={clsx(classNames.positioner, className)}
        style={{ zIndex: BASE_Z_INDEX + zIndexOffset, ...style }}
      />
    );
  },
);
HelpBubblePositioner.displayName = "HelpBubblePositioner";

////////////////////////////////////////////////////////////////////////////////////

export interface HelpBubbleContentProps
  extends Pick<StyleProps, "maxWidth">,
    LynxHostProps<"view"> {}

export const HelpBubbleContent = React.forwardRef<unknown, HelpBubbleContentProps>((props, ref) => {
  const { style, restProps } = useStyleProps(props);
  const { children, className, ...nativeProps } = restProps;
  const { open, finishClose } = usePopoverContext();
  const classNames = useClassNames();
  const handleTransitionEnd = React.useCallback<NativeTransitionHandler>(
    (event) => {
      "background only";
      if (!open && hasExitTransition(event)) finishClose();
    },
    [finishClose, open],
  );

  return (
    <view className={classNames.motion} bindtransitionend={handleTransitionEnd}>
      <PopoverContent
        {...(ref ? { ref } : {})}
        {...nativeProps}
        className={clsx(classNames.content, className)}
        style={style}
      >
        {children}
      </PopoverContent>
    </view>
  );
});
HelpBubbleContent.displayName = "HelpBubbleContent";

////////////////////////////////////////////////////////////////////////////////////

export interface HelpBubbleArrowProps extends LynxHostProps<"view"> {}

export const HelpBubbleArrow = React.forwardRef<unknown, HelpBubbleArrowProps>((props, ref) => {
  const { className, ...arrowProps } = props;

  return (
    <PopoverArrow
      {...(ref ? { ref } : {})}
      {...arrowProps}
      size={ARROW_SIZE}
      tipHeight={ARROW_TIP_HEIGHT}
      className={clsx(useClassNames().arrow, className)}
    />
  );
});
HelpBubbleArrow.displayName = "HelpBubbleArrow";

export interface HelpBubbleArrowTipProps extends LynxHostProps<"view"> {}

export const HelpBubbleArrowTip = React.forwardRef<unknown, HelpBubbleArrowTipProps>(
  (props, ref) => {
    const { children, className, style, ...nativeProps } = props;
    return (
      <view
        {...mergeProps(
          { "accessibility-elements-hidden": true },
          nativeProps,
          ref ? { ref: ref as LynxViewRef } : {},
        )}
        className={clsx(useClassNames().arrowTip, className)}
        style={style}
      >
        {children}
      </view>
    );
  },
);
HelpBubbleArrowTip.displayName = "HelpBubbleArrowTip";

////////////////////////////////////////////////////////////////////////////////////

export interface HelpBubbleBodyProps extends LynxHostProps<"view"> {}

export const HelpBubbleBody = React.forwardRef<unknown, HelpBubbleBodyProps>((props, ref) => {
  const { children, className, style, ...nativeProps } = props;
  return (
    <view
      {...mergeProps(ref ? { ref: ref as LynxViewRef } : {}, nativeProps)}
      className={clsx(useClassNames().body, className)}
      style={style}
    >
      {children}
    </view>
  );
});
HelpBubbleBody.displayName = "HelpBubbleBody";

export interface HelpBubbleTitleProps extends LynxHostProps<"text"> {}

export const HelpBubbleTitle = React.forwardRef<unknown, HelpBubbleTitleProps>((props, ref) => {
  const { children, className, style, ...nativeProps } = props;
  return (
    <text
      {...mergeProps(ref ? { ref: ref as LynxTextRef } : {}, nativeProps)}
      className={clsx(useClassNames().title, className)}
      style={style}
    >
      {children}
    </text>
  );
});
HelpBubbleTitle.displayName = "HelpBubbleTitle";

export interface HelpBubbleDescriptionProps extends LynxHostProps<"text"> {}

export const HelpBubbleDescription = React.forwardRef<unknown, HelpBubbleDescriptionProps>(
  (props, ref) => {
    const { children, className, style, ...nativeProps } = props;
    return (
      <text
        {...mergeProps(ref ? { ref: ref as LynxTextRef } : {}, nativeProps)}
        className={clsx(useClassNames().description, className)}
        style={style}
      >
        {children}
      </text>
    );
  },
);
HelpBubbleDescription.displayName = "HelpBubbleDescription";

////////////////////////////////////////////////////////////////////////////////////

export interface HelpBubbleCloseButtonProps extends LynxHostProps<"view"> {}

export const HelpBubbleCloseButton = React.forwardRef<unknown, HelpBubbleCloseButtonProps>(
  (props, ref) => {
    const {
      children,
      className,
      style,
      bindtap,
      "main-thread:bindtap": mainThreadBindtap,
      "accessibility-element": accessibilityElement,
      "accessibility-label": accessibilityLabel,
      "accessibility-traits": accessibilityTraits,
      ...nativeProps
    } = props;
    const { pressed, closeButtonProps } = usePopoverCloseButton({
      bindtap,
      "main-thread:bindtap": mainThreadBindtap,
      "accessibility-element": accessibilityElement,
      "accessibility-label": accessibilityLabel,
      "accessibility-traits": accessibilityTraits,
    });
    const { open, positioned, side } = usePopoverContext();
    const closeButtonClassNames = helpBubble({ open, positioned, side, pressed });

    return (
      <view
        {...mergeProps(
          { flatten: false },
          closeButtonProps,
          nativeProps,
          ref ? { ref: ref as LynxViewRef } : {},
        )}
        className={clsx(closeButtonClassNames.closeButton, className)}
        style={style}
      >
        {children}
      </view>
    );
  },
);
HelpBubbleCloseButton.displayName = "HelpBubbleCloseButton";
