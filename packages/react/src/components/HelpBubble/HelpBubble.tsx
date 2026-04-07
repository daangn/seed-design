import { Popover as PopoverPrimitive, usePopoverContext } from "@ride-developer/react-popover";
import { Primitive, type PrimitiveProps } from "@ride-developer/react-primitive";
import { helpBubble, type HelpBubbleVariantProps } from "@ride-developer/css/recipes/help-bubble";
import { forwardRef } from "react";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { createWithStateProps } from "../../utils/createWithStateProps";
import { withStyleProps, type StyleProps } from "../../utils/styled";
import { composeRefs } from "@radix-ui/react-compose-refs";
import clsx from "clsx";

const { withRootProvider, withContext, useClassNames } = createSlotRecipeContext(helpBubble);
const withStateProps = createWithStateProps([usePopoverContext]);

////////////////////////////////////////////////////////////////////////////////////

export interface HelpBubbleRootProps extends HelpBubbleVariantProps, PopoverPrimitive.RootProps {
  /**
   * @default "top"
   */
  placement?: PopoverPrimitive.RootProps["placement"];
  /**
   * @default 4
   */
  gutter?: PopoverPrimitive.RootProps["gutter"];
  /**
   * @default 16
   */
  overflowPadding?: PopoverPrimitive.RootProps["overflowPadding"];
  /**
   * @default 14
   */
  arrowPadding?: PopoverPrimitive.RootProps["arrowPadding"];
}

export const HelpBubbleRoot = withRootProvider<HelpBubbleRootProps>(PopoverPrimitive.Root, {
  defaultProps: {
    placement: "top",
    gutter: 4, // TODO: get value from rootage spec
    overflowPadding: 16,
    arrowPadding: 14,
  },
});

////////////////////////////////////////////////////////////////////////////////////

export interface HelpBubbleAnchorProps extends PopoverPrimitive.AnchorProps {}

export const HelpBubbleAnchor = PopoverPrimitive.Anchor;

////////////////////////////////////////////////////////////////////////////////////

export interface HelpBubbleTriggerProps extends PopoverPrimitive.TriggerProps {}

export const HelpBubbleTrigger = PopoverPrimitive.Trigger;

////////////////////////////////////////////////////////////////////////////////////

export interface HelpBubblePositionerProps extends PopoverPrimitive.PositionerProps {}

export const HelpBubblePositioner = withContext<HTMLDivElement, HelpBubblePositionerProps>(
  PopoverPrimitive.Positioner,
  "positioner",
);

export interface HelpBubblePositionerPortalProps extends PopoverPrimitive.PositionerPortalProps {}

export const HelpBubblePositionerPortal = withContext<
  HTMLDivElement,
  HelpBubblePositionerPortalProps
>(PopoverPrimitive.PositionerPortal, "positioner");

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

export interface HelpBubbleArrowProps extends PopoverPrimitive.ArrowProps {}

export const HelpBubbleArrow = withContext<HTMLDivElement, HelpBubbleArrowProps>(
  PopoverPrimitive.Arrow,
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
    const api = usePopoverContext();

    const classNames = useClassNames();

    const width = api.rects.arrowTip?.width || 0;
    const height = api.rects.arrowTip?.height || 0;

    const pathData = `M0,0
      H${width}
      L${width / 2 + tipRadius},${height - tipRadius}
      Q${width / 2},${height} ${width / 2 - tipRadius},${height - tipRadius}
      Z`;

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

export interface HelpBubbleCloseButtonProps extends PopoverPrimitive.CloseButtonProps {}

export const HelpBubbleCloseButton = withContext<HTMLButtonElement, HelpBubbleCloseButtonProps>(
  PopoverPrimitive.CloseButton,
  "closeButton",
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
