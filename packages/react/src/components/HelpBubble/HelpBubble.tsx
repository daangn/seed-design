import {
  ToggleTip as ToggleTipPrimitive,
  useToggleTipContext,
} from "@seed-design/react-toggle-tip";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { helpBubble, type HelpBubbleVariantProps } from "@seed-design/css/recipes/help-bubble";
import { forwardRef } from "react";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { withScaleFeedback } from "../../utils/withScaleFeedback";
import { createWithStateProps } from "../../utils/createWithStateProps";
import { withStyleProps, type StyleProps } from "../../utils/styled";
import { getHelpBubbleArrowTipPath } from "../../utils/getHelpBubbleArrowTipPath";
import { composeRefs } from "@radix-ui/react-compose-refs";
import clsx from "clsx";

const { withRootProvider, withContext, useClassNames } = createSlotRecipeContext(helpBubble);
const withStateProps = createWithStateProps([useToggleTipContext]);

////////////////////////////////////////////////////////////////////////////////////

export interface HelpBubbleRootProps extends HelpBubbleVariantProps, ToggleTipPrimitive.RootProps {
  /**
   * @default "top"
   */
  placement?: ToggleTipPrimitive.RootProps["placement"];
  /**
   * @default 4
   */
  gutter?: ToggleTipPrimitive.RootProps["gutter"];
  /**
   * @default 16
   */
  overflowPadding?: ToggleTipPrimitive.RootProps["overflowPadding"];
  /**
   * @default 14
   */
  arrowPadding?: ToggleTipPrimitive.RootProps["arrowPadding"];
}

export const HelpBubbleRoot = withRootProvider<HelpBubbleRootProps>(ToggleTipPrimitive.Root, {
  defaultProps: {
    placement: "top",
    gutter: 4, // TODO: get value from rootage spec
    overflowPadding: 16, // TODO: get value from rootage spec
    arrowPadding: 14,
  },
});

////////////////////////////////////////////////////////////////////////////////////

export interface HelpBubbleAnchorProps extends ToggleTipPrimitive.AnchorProps {}

export const HelpBubbleAnchor = ToggleTipPrimitive.Anchor;

////////////////////////////////////////////////////////////////////////////////////

export interface HelpBubbleTriggerProps extends ToggleTipPrimitive.TriggerProps {}

export const HelpBubbleTrigger = ToggleTipPrimitive.Trigger;

////////////////////////////////////////////////////////////////////////////////////

export interface HelpBubblePositionerProps extends ToggleTipPrimitive.PositionerProps {}

export const HelpBubblePositioner = withContext<HTMLDivElement, HelpBubblePositionerProps>(
  ToggleTipPrimitive.Positioner,
  "positioner",
);

export interface HelpBubblePositionerPortalProps extends ToggleTipPrimitive.PositionerPortalProps {}

export const HelpBubblePositionerPortal = withContext<
  HTMLDivElement,
  HelpBubblePositionerPortalProps
>(ToggleTipPrimitive.PositionerPortal, "positioner");

////////////////////////////////////////////////////////////////////////////////////

export interface HelpBubbleContentProps
  extends PrimitiveProps,
    Pick<StyleProps, "maxWidth">,
    React.HTMLAttributes<HTMLDivElement> {}

export const HelpBubbleContent = withContext<HTMLDivElement, HelpBubbleContentProps>(
  withStyleProps(withStateProps(Primitive.div)),
  "content",
);

////////////////////////////////////////////////////////////////////////////////////

export interface HelpBubbleArrowProps extends ToggleTipPrimitive.ArrowProps {}

export const HelpBubbleArrow = withContext<HTMLDivElement, HelpBubbleArrowProps>(
  ToggleTipPrimitive.Arrow,
  "arrow",
);

////////////////////////////////////////////////////////////////////////////////////

export interface HelpBubbleArrowTipProps extends React.SVGProps<SVGSVGElement> {
  /**
   * radius of the arrow tip
   * @default 2
   */
  tipRadius?: number;
}

export const HelpBubbleArrowTip = forwardRef<SVGSVGElement, HelpBubbleArrowTipProps>(
  (props, ref) => {
    const {
      tipRadius = 2, // TODO: get value from rootage spec
      className,
      ...otherProps
    } = props;
    const api = useToggleTipContext();

    const classNames = useClassNames();

    const width = api.rects.arrowTip?.width || 0;
    const height = api.rects.arrowTip?.height || 0;

    const pathData = getHelpBubbleArrowTipPath(width, height, tipRadius);

    // TODO: mergeProps with api.stateProps
    return (
      <svg
        aria-hidden="true"
        viewBox={`0 0 ${width} ${height}`}
        ref={composeRefs(api.refs.arrowTip, ref)}
        className={clsx(classNames.arrowTip, className)}
        {...otherProps}
      >
        <path stroke="none" d={pathData} />
      </svg>
    );
  },
);
HelpBubbleArrowTip.displayName = "HelpBubbleArrowTip";

////////////////////////////////////////////////////////////////////////////////////

export interface HelpBubbleCloseButtonProps extends ToggleTipPrimitive.CloseButtonProps {}

export const HelpBubbleCloseButton = withScaleFeedback(
  withContext<HTMLButtonElement, HelpBubbleCloseButtonProps>(
    ToggleTipPrimitive.CloseButton,
    "closeButton",
  ),
);

////////////////////////////////////////////////////////////////////////////////////

export interface HelpBubbleBodyProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const HelpBubbleBody = withContext<HTMLDivElement, HelpBubbleBodyProps>(
  withStateProps(Primitive.div),
  "body",
);

export interface HelpBubbleTitleProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const HelpBubbleTitle = withContext<HTMLSpanElement, HelpBubbleTitleProps>(
  withStateProps(Primitive.span),
  "title",
);

export interface HelpBubbleDescriptionProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const HelpBubbleDescription = withContext<HTMLDivElement, HelpBubbleDescriptionProps>(
  withStateProps(Primitive.div),
  "description",
);
