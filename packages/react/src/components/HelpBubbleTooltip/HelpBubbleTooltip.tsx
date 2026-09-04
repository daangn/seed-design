import { Tooltip as TooltipPrimitive, useTooltipContext } from "@seed-design/react-tooltip";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { helpBubble, type HelpBubbleVariantProps } from "@seed-design/css/recipes/help-bubble";
import { forwardRef } from "react";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { createWithStateProps } from "../../utils/createWithStateProps";
import { withStyleProps, type StyleProps } from "../../utils/styled";
import { getHelpBubbleArrowTipPath } from "../../utils/getHelpBubbleArrowTipPath";
import { composeRefs } from "@radix-ui/react-compose-refs";
import { clsx } from "cn";

const { withRootProvider, withContext, useClassNames } = createSlotRecipeContext(helpBubble);
const withStateProps = createWithStateProps([useTooltipContext]);

////////////////////////////////////////////////////////////////////////////////////

export interface HelpBubbleTooltipRootProps
  extends HelpBubbleVariantProps,
    TooltipPrimitive.RootProps {
  /**
   * @default "top"
   */
  placement?: TooltipPrimitive.RootProps["placement"];
  /**
   * @default 4
   */
  gutter?: TooltipPrimitive.RootProps["gutter"];
  /**
   * @default 16
   */
  overflowPadding?: TooltipPrimitive.RootProps["overflowPadding"];
  /**
   * @default 14
   */
  arrowPadding?: TooltipPrimitive.RootProps["arrowPadding"];
}

export const HelpBubbleTooltipRoot = withRootProvider<HelpBubbleTooltipRootProps>(
  TooltipPrimitive.Root,
  {
    defaultProps: {
      placement: "top",
      gutter: 4, // TODO: get value from rootage spec
      overflowPadding: 16, // TODO: get value from rootage spec
      arrowPadding: 14,
    },
  },
);

////////////////////////////////////////////////////////////////////////////////////

export interface HelpBubbleTooltipTriggerProps extends TooltipPrimitive.TriggerProps {}

export const HelpBubbleTooltipTrigger = TooltipPrimitive.Trigger;

////////////////////////////////////////////////////////////////////////////////////

export interface HelpBubbleTooltipDelayGroupProps extends TooltipPrimitive.DelayGroupProps {}

export const HelpBubbleTooltipDelayGroup = TooltipPrimitive.DelayGroup;

////////////////////////////////////////////////////////////////////////////////////

export interface HelpBubbleTooltipPositionerProps extends TooltipPrimitive.PositionerProps {}

export const HelpBubbleTooltipPositioner = withContext<
  HTMLDivElement,
  HelpBubbleTooltipPositionerProps
>(TooltipPrimitive.Positioner, "positioner");

export interface HelpBubbleTooltipPositionerPortalProps
  extends TooltipPrimitive.PositionerPortalProps {}

export const HelpBubbleTooltipPositionerPortal = withContext<
  HTMLDivElement,
  HelpBubbleTooltipPositionerPortalProps
>(TooltipPrimitive.PositionerPortal, "positioner");

////////////////////////////////////////////////////////////////////////////////////

export interface HelpBubbleTooltipContentProps
  extends PrimitiveProps,
    Pick<StyleProps, "maxWidth">,
    React.HTMLAttributes<HTMLDivElement> {}

export const HelpBubbleTooltipContent = withContext<HTMLDivElement, HelpBubbleTooltipContentProps>(
  withStyleProps(withStateProps(Primitive.div)),
  "content",
);

////////////////////////////////////////////////////////////////////////////////////

export interface HelpBubbleTooltipArrowProps extends TooltipPrimitive.ArrowProps {}

export const HelpBubbleTooltipArrow = withContext<HTMLDivElement, HelpBubbleTooltipArrowProps>(
  TooltipPrimitive.Arrow,
  "arrow",
);

////////////////////////////////////////////////////////////////////////////////////

export interface HelpBubbleTooltipArrowTipProps extends React.SVGProps<SVGSVGElement> {
  /**
   * radius of the arrow tip
   * @default 2
   */
  tipRadius?: number;
}

export const HelpBubbleTooltipArrowTip = forwardRef<SVGSVGElement, HelpBubbleTooltipArrowTipProps>(
  (props, ref) => {
    const {
      tipRadius = 2, // TODO: get value from rootage spec
      className,
      ...otherProps
    } = props;
    const api = useTooltipContext();

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
HelpBubbleTooltipArrowTip.displayName = "HelpBubbleTooltipArrowTip";

////////////////////////////////////////////////////////////////////////////////////

export interface HelpBubbleTooltipBodyProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const HelpBubbleTooltipBody = withContext<HTMLDivElement, HelpBubbleTooltipBodyProps>(
  withStateProps(Primitive.div),
  "body",
);

export interface HelpBubbleTooltipTitleProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const HelpBubbleTooltipTitle = withContext<HTMLSpanElement, HelpBubbleTooltipTitleProps>(
  withStateProps(Primitive.span),
  "title",
);

export interface HelpBubbleTooltipDescriptionProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const HelpBubbleTooltipDescription = withContext<
  HTMLDivElement,
  HelpBubbleTooltipDescriptionProps
>(withStateProps(Primitive.div), "description");
