import { popover, type PopoverVariantProps } from "@seed-design/css/recipes/popover";
import { Popover as PopoverPrimitive, usePopoverContext } from "@seed-design/react-popover";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { composeRefs, useComposedRefs } from "@radix-ui/react-compose-refs";
import { dataAttr } from "@seed-design/dom-utils";
import clsx from "clsx";
import * as React from "react";
import { forwardRef } from "react";
import { useScaleFeedback } from "@seed-design/react-scale-feedback";
import { createRenderTrackingContext } from "../../utils/createRenderTrackingContext";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { createWithStateProps } from "../../utils/createWithStateProps";
import { useStyleProps, withStyleProps, type StyleProps } from "../../utils/styled";

const { withContext, useClassNames, ClassNamesProvider } = createSlotRecipeContext(popover);
const withStateProps = createWithStateProps([usePopoverContext]);

const closeButtonTracker = createRenderTrackingContext("PopoverCloseButton");

////////////////////////////////////////////////////////////////////////////////////

export interface PopoverRootProps extends PopoverVariantProps, PopoverPrimitive.RootProps {
  /**
   * @default "bottom"
   */
  placement?: PopoverPrimitive.RootProps["placement"];
  /**
   * @default 8
   */
  gutter?: PopoverPrimitive.RootProps["gutter"];
  /**
   * @default 16
   */
  overflowPadding?: PopoverPrimitive.RootProps["overflowPadding"];
  /**
   * @default true
   */
  lazyMount?: PopoverPrimitive.RootProps["lazyMount"];
}

// NOTE: `gutter` and `overflowPadding` are specified in Rootage (`popover.yaml`,
// `$dimension.x2` / `$dimension.x4`) and generated into `@seed-design/css`, but nothing
// reads them: floating-ui's `offset`/`shift` take numbers, not CSS custom properties,
// so the headless layer falls back to its own `0` / `8`. Those defaults stay
// design-system-agnostic on purpose — this layer is the one that owns the
// Rootage binding, so seed the spec values through destructuring defaults here,
// the way `HelpBubbleRoot` passes `gutter` through `defaultProps`.
export function PopoverRoot({
  placement = "bottom",
  gutter = 8, // TODO: get value from rootage spec
  overflowPadding = 16, // TODO: get value from rootage spec
  lazyMount = true,
  ...props
}: PopoverRootProps) {
  const [variantProps, otherProps] = popover.splitVariantProps(props);
  const classNames = popover(variantProps);

  return (
    <ClassNamesProvider value={classNames}>
      <closeButtonTracker.Provider>
        <PopoverPrimitive.Root
          placement={placement}
          gutter={gutter}
          overflowPadding={overflowPadding}
          lazyMount={lazyMount}
          {...otherProps}
        />
      </closeButtonTracker.Provider>
    </ClassNamesProvider>
  );
}

////////////////////////////////////////////////////////////////////////////////////

export interface PopoverTriggerProps extends PopoverPrimitive.TriggerProps {}

export const PopoverTrigger = PopoverPrimitive.Trigger;

////////////////////////////////////////////////////////////////////////////////////

export interface PopoverAnchorProps extends PopoverPrimitive.AnchorProps {}

export const PopoverAnchor = PopoverPrimitive.Anchor;

////////////////////////////////////////////////////////////////////////////////////

// Portals into a `container` ref and keeps FloatingPortal's other props out of reach, matching Menu and Select.
export interface PopoverPositionerProps extends Omit<PopoverPrimitive.PositionerProps, "id"> {
  /**
   * The container element to render the portal into.
   * @default document.body
   */
  container?: React.RefObject<HTMLElement | null>;
}

export const PopoverPositioner = forwardRef<HTMLDivElement, PopoverPositionerProps>(
  ({ container, className, ...props }, ref) => {
    const classNames = useClassNames();

    return (
      <PopoverPrimitive.PositionerPortal
        ref={ref}
        root={container ?? undefined}
        className={clsx(classNames.positioner, className)}
        {...props}
      />
    );
  },
);
PopoverPositioner.displayName = "PopoverPositioner";

////////////////////////////////////////////////////////////////////////////////////

export interface PopoverContentProps
  extends PrimitiveProps,
    Pick<StyleProps, "width" | "maxWidth">,
    React.HTMLAttributes<HTMLDivElement> {}

export const PopoverContent = withContext<HTMLDivElement, PopoverContentProps>(
  withStyleProps(withStateProps(PopoverPrimitive.Content)),
  "content",
);

////////////////////////////////////////////////////////////////////////////////////

export interface PopoverHeaderProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const PopoverHeader = forwardRef<HTMLDivElement, PopoverHeaderProps>(
  ({ className, ...props }, ref) => {
    const classNames = useClassNames();
    const { isRendered } = closeButtonTracker.useRenderTracking();

    return (
      <Primitive.div
        ref={ref}
        data-show-close-button={dataAttr(isRendered)}
        className={clsx(classNames.header, className)}
        {...props}
      />
    );
  },
);

PopoverHeader.displayName = "PopoverHeader";

////////////////////////////////////////////////////////////////////////////////////

export interface PopoverTitleProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLHeadingElement> {}

export const PopoverTitle = withContext<HTMLHeadingElement, PopoverTitleProps>(
  PopoverPrimitive.Title,
  "title",
);

PopoverTitle.displayName = "PopoverTitle";

////////////////////////////////////////////////////////////////////////////////////

export interface PopoverDescriptionProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLParagraphElement> {}

export const PopoverDescription = withContext<HTMLParagraphElement, PopoverDescriptionProps>(
  PopoverPrimitive.Description,
  "description",
);

PopoverDescription.displayName = "PopoverDescription";

////////////////////////////////////////////////////////////////////////////////////

export interface PopoverBodyProps
  extends PrimitiveProps,
    Pick<
      StyleProps,
      "paddingX" | "height" | "maxHeight" | "minHeight" | "justifyContent" | "alignItems"
    >,
    React.HTMLAttributes<HTMLDivElement> {}

export const PopoverBody = forwardRef<HTMLDivElement, PopoverBodyProps>((props, forwardedRef) => {
  const classNames = useClassNames();
  const { style, restProps } = useStyleProps(props);
  const { className, ...otherProps } = restProps;

  const ref = React.useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = React.useState(false);
  const [overflowing, setOverflowing] = React.useState(false);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const check = () => {
      setScrolled(element.scrollTop > 0);
      // Subtract the current bottom padding so overflow detection stays independent
      // of the padding we conditionally apply — otherwise that padding would count as
      // overflow and the state would never settle (padding -> overflow -> padding...).
      const paddingBottom = Number.parseFloat(getComputedStyle(element).paddingBottom) || 0;
      setOverflowing(element.scrollHeight - paddingBottom > element.clientHeight);
    };
    check();

    element.addEventListener("scroll", check);

    const observer = new ResizeObserver(check);
    observer.observe(element);

    return () => {
      element.removeEventListener("scroll", check);
      observer.disconnect();
    };
  }, []);

  return (
    <Primitive.div
      ref={composeRefs(ref, forwardedRef)}
      data-scrolled={dataAttr(scrolled)}
      data-overflow={dataAttr(overflowing)}
      className={clsx(classNames.body, className)}
      style={style}
      {...otherProps}
    />
  );
});

PopoverBody.displayName = "PopoverBody";

////////////////////////////////////////////////////////////////////////////////////

export interface PopoverFooterProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const PopoverFooter = withContext<HTMLDivElement, PopoverFooterProps>(
  Primitive.div,
  "footer",
);

////////////////////////////////////////////////////////////////////////////////////

export interface PopoverActionProps extends PopoverPrimitive.CloseButtonProps {}

export const PopoverAction = PopoverPrimitive.CloseButton;

////////////////////////////////////////////////////////////////////////////////////

export interface PopoverCloseButtonProps extends PopoverPrimitive.CloseButtonProps {}

export const PopoverCloseButton = forwardRef<HTMLButtonElement, PopoverCloseButtonProps>(
  ({ className, ...props }, ref) => {
    const classNames = useClassNames();
    const { trackRef } = closeButtonTracker.useRenderTracking();
    const { scaleFeedbackRef, scaleFeedbackClassName } = useScaleFeedback();

    return (
      <PopoverPrimitive.CloseButton
        ref={useComposedRefs(scaleFeedbackRef, ref, trackRef)}
        className={clsx(classNames.closeButton, scaleFeedbackClassName, className)}
        {...props}
      />
    );
  },
);

PopoverCloseButton.displayName = "PopoverCloseButton";

////////////////////////////////////////////////////////////////////////////////////

export interface PopoverArrowProps extends PopoverPrimitive.ArrowProps {}

// Arrow and ArrowTip are placeholders so future arrow support does not require snippet updates.
export const PopoverArrow = forwardRef<HTMLDivElement, PopoverArrowProps>(() => null);

PopoverArrow.displayName = "PopoverArrow";

////////////////////////////////////////////////////////////////////////////////////

export interface PopoverArrowTipProps extends React.SVGProps<SVGSVGElement> {}

export const PopoverArrowTip = forwardRef<SVGSVGElement, PopoverArrowTipProps>(() => null);

PopoverArrowTip.displayName = "PopoverArrowTip";
