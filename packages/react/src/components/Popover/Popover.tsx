import { popover, type PopoverVariantProps } from "@seed-design/css/recipes/popover";
import { Popover as PopoverPrimitive, usePopoverContext } from "@seed-design/react-popover";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { composeRefs, useComposedRefs } from "@radix-ui/react-compose-refs";
import { dataAttr } from "@seed-design/dom-utils";
import clsx from "clsx";
import * as React from "react";
import { forwardRef } from "react";
import { createRenderTrackingContext } from "../../utils/createRenderTrackingContext";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { createWithStateProps } from "../../utils/createWithStateProps";
import { useStyleProps, withStyleProps, type StyleProps } from "../../utils/styled";

const { withContext, useClassNames, ClassNamesProvider } = createSlotRecipeContext(popover);
const withStateProps = createWithStateProps([usePopoverContext]);

const closeButtonTracker = createRenderTrackingContext("PopoverCloseButton");

////////////////////////////////////////////////////////////////////////////////////

// `popover.yaml` declares these as `$dimension.x2` / `$dimension.x4`, but the generated
// `@seed-design/css` vars publish them as `var(--seed-dimension-*)` strings, and floating-ui
// positions with numbers — so the token cannot be read back here and the px values are
// mirrored by hand. Move them together with the YAML.
const DEFAULT_GUTTER = 8;
const DEFAULT_OVERFLOW_PADDING = 16;

export interface PopoverRootProps extends PopoverVariantProps, PopoverPrimitive.RootProps {
  /** @default "bottom" */
  placement?: PopoverPrimitive.RootProps["placement"];
  /** @default 8 */
  gutter?: PopoverPrimitive.RootProps["gutter"];
  /** @default 16 */
  overflowPadding?: PopoverPrimitive.RootProps["overflowPadding"];
  /**
   * Keep the popover clear of the device safe-area (notch / home indicator).
   * @default true
   */
  safeAreaAware?: PopoverPrimitive.RootProps["safeAreaAware"];
  /**
   * @default true
   */
  lazyMount?: PopoverPrimitive.RootProps["lazyMount"];
  /**
   * Kept off by default: a popover is an anchored surface like Menu and Select, which never
   * unmount their content, and discarding it on close would throw away form state and the
   * body's scroll position every time.
   * @default false
   */
  unmountOnExit?: PopoverPrimitive.RootProps["unmountOnExit"];
}

export function PopoverRoot(props: PopoverRootProps) {
  const [variantProps, otherProps] = popover.splitVariantProps(props);
  const classNames = popover(variantProps);

  return (
    <ClassNamesProvider value={classNames}>
      <closeButtonTracker.Provider>
        <PopoverPrimitive.Root
          placement="bottom"
          gutter={DEFAULT_GUTTER}
          overflowPadding={DEFAULT_OVERFLOW_PADDING}
          safeAreaAware
          lazyMount
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

export interface PopoverPositionerProps extends PopoverPrimitive.PositionerProps {}

export const PopoverPositioner = withContext<HTMLDivElement, PopoverPositionerProps>(
  PopoverPrimitive.Positioner,
  "positioner",
);

export interface PopoverPositionerPortalProps extends PopoverPrimitive.PositionerPortalProps {}

export const PopoverPositionerPortal = withContext<HTMLDivElement, PopoverPositionerPortalProps>(
  PopoverPrimitive.PositionerPortal,
  "positioner",
);

////////////////////////////////////////////////////////////////////////////////////

export interface PopoverContentProps
  extends PrimitiveProps,
    Pick<StyleProps, "width" | "minWidth" | "maxWidth">,
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

  const [scrolled, setScrolled] = React.useState(false);
  const [overflowing, setOverflowing] = React.useState(false);

  const teardownRef = React.useRef<(() => void) | null>(null);

  // The node can attach at any point in the component's life: `lazyMount` holds the whole
  // content subtree out of the DOM until the first open, and an `asChild` child may hand its
  // node over later still. Measurement therefore hangs off the ref, which sees every attach
  // and detach — a mount effect reads the node once and has no way to retry.
  const observeRef = React.useCallback((element: HTMLDivElement | null) => {
    teardownRef.current?.();
    teardownRef.current = null;

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

    teardownRef.current = () => {
      element.removeEventListener("scroll", check);
      observer.disconnect();
    };
  }, []);

  const ref = useComposedRefs(observeRef, forwardedRef);

  return (
    <Primitive.div
      ref={ref}
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

export interface PopoverCloseButtonProps extends PopoverPrimitive.CloseButtonProps {}

export const PopoverCloseButton = forwardRef<HTMLButtonElement, PopoverCloseButtonProps>(
  ({ className, ...props }, ref) => {
    const classNames = useClassNames();
    const { trackRef } = closeButtonTracker.useRenderTracking();

    return (
      <PopoverPrimitive.CloseButton
        ref={composeRefs(ref, trackRef)}
        className={clsx(classNames.closeButton, className)}
        {...props}
      />
    );
  },
);

PopoverCloseButton.displayName = "PopoverCloseButton";

////////////////////////////////////////////////////////////////////////////////////

export interface PopoverArrowProps extends PopoverPrimitive.ArrowProps {}

// Placeholder: the arrow part is part of the public surface but renders nothing yet.
export const PopoverArrow = forwardRef<HTMLDivElement, PopoverArrowProps>(() => null);

PopoverArrow.displayName = "PopoverArrow";
