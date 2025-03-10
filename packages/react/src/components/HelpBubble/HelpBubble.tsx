import { Popover as PopoverPrimitive, usePopoverContext } from "@seed-design/react-popover";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { helpBubble, type HelpBubbleVariantProps } from "@seed-design/css/recipes/help-bubble";
import { forwardRef } from "react";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { createWithStateProps } from "../../utils/createWithStateProps";
import { withStyleProps, type StyleProps } from "../../utils/styled";

const { withRootProvider, withContext } = createSlotRecipeContext(helpBubble);
const withStateProps = createWithStateProps([usePopoverContext]);

////////////////////////////////////////////////////////////////////////////////////

export interface HelpBubbleRootProps extends HelpBubbleVariantProps, PopoverPrimitive.RootProps {}

export const HelpBubbleRoot = withRootProvider<HelpBubbleRootProps>(PopoverPrimitive.Root, {
  defaultProps: {
    placement: "top",
    gutter: 4, // TODO: get value from rootage spec
    overflowPadding: 16,
    arrowPadding: 14,
    flip: true,
    slide: true,
    strategy: "absolute",
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

////////////////////////////////////////////////////////////////////////////////////

export interface HelpBubbleBackdropProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const HelpBubbleBackdrop = withContext<HTMLDivElement, HelpBubbleBackdropProps>(
  withStateProps(Primitive.div),
  "backdrop",
);

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
   * @default 1
   */
  tipRadius?: number;
}

export const HelpBubbleArrowTip = forwardRef<SVGSVGElement, HelpBubbleArrowTipProps>(
  (props, ref) => {
    const {
      tipRadius = 2, // TODO: get value from rootage spec
      ...otherProps
    } = props;
    const api = usePopoverContext();
    const width = api.rects.arrow?.width || 0;
    const height = api.rects.arrow?.height || 0;
    const pathData = `M0,0
      H${width}
      L${width / 2 + tipRadius},${height - tipRadius}
      Q${width / 2},${height} ${width / 2 - tipRadius},${height - tipRadius}
      Z`;

    // TODO: mergeProps with api.stateProps
    return (
      <svg
        aria-hidden="true"
        width={width}
        height={width}
        viewBox={`0 0 ${width} ${height > width ? height : width}`}
        ref={ref}
        {...otherProps}
      >
        <path stroke="none" d={pathData} />
      </svg>
    );
  },
);

////////////////////////////////////////////////////////////////////////////////////

export interface HelpBubbleCloseButtonProps extends PopoverPrimitive.CloseButtonProps {}

export const HelpBubbleCloseButton = withContext<HTMLButtonElement, HelpBubbleCloseButtonProps>(
  PopoverPrimitive.CloseButton,
  "closeButton",
);

////////////////////////////////////////////////////////////////////////////////////

export interface HelpBubbleTitleProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const HelpBubbleTitle = withContext<HTMLSpanElement, HelpBubbleTitleProps>(
  withStateProps(Primitive.span),
  "title",
);

////////////////////////////////////////////////////////////////////////////////////

export interface HelpBubbleDescriptionProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const HelpBubbleDescription = withContext<HTMLDivElement, HelpBubbleDescriptionProps>(
  withStateProps(Primitive.div),
  "description",
);
