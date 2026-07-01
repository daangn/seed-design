import { composeRefs } from "@radix-ui/react-compose-refs";
import {
  contentDialog,
  type ContentDialogVariantProps,
} from "@seed-design/css/recipes/content-dialog";
import { dataAttr } from "@seed-design/dom-utils";
import { Dialog as DialogPrimitive, useDialogContext } from "@seed-design/react-dialog";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import clsx from "clsx";
import * as React from "react";
import { createRenderTrackingContext } from "../../utils/createRenderTrackingContext";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { createWithStateProps } from "../../utils/createWithStateProps";

const { withRootProvider, withContext, useClassNames } = createSlotRecipeContext(contentDialog);
const withStateProps = createWithStateProps([useDialogContext]);

const closeButtonTracker = createRenderTrackingContext("ContentDialogCloseButton");

////////////////////////////////////////////////////////////////////////////////////

export interface ContentDialogRootProps
  extends ContentDialogVariantProps,
    DialogPrimitive.RootProps {
  /**
   * @default true
   */
  lazyMount?: DialogPrimitive.RootProps["lazyMount"];
  /**
   * @default true
   */
  unmountOnExit?: DialogPrimitive.RootProps["unmountOnExit"];
}

const ContentDialogRootBase = (props: DialogPrimitive.RootProps) => (
  <closeButtonTracker.Provider>
    <DialogPrimitive.Root {...props} />
  </closeButtonTracker.Provider>
);

export const ContentDialogRoot = withRootProvider<ContentDialogRootProps>(ContentDialogRootBase, {
  defaultProps: {
    lazyMount: true,
    unmountOnExit: true,
  },
});

////////////////////////////////////////////////////////////////////////////////////

export interface ContentDialogTriggerProps extends DialogPrimitive.TriggerProps {}

export const ContentDialogTrigger = DialogPrimitive.Trigger;

////////////////////////////////////////////////////////////////////////////////////

export interface ContentDialogPositionerProps extends DialogPrimitive.PositionerProps {}

export const ContentDialogPositioner = withContext<HTMLDivElement, ContentDialogPositionerProps>(
  DialogPrimitive.Positioner,
  "positioner",
);

////////////////////////////////////////////////////////////////////////////////////

export interface ContentDialogBackdropProps extends DialogPrimitive.BackdropProps {}

export const ContentDialogBackdrop = withContext<HTMLDivElement, ContentDialogBackdropProps>(
  DialogPrimitive.Backdrop,
  "backdrop",
);

////////////////////////////////////////////////////////////////////////////////////

export interface ContentDialogContentProps extends DialogPrimitive.ContentProps {}

export const ContentDialogContent = withContext<HTMLDivElement, ContentDialogContentProps>(
  DialogPrimitive.Content,
  "content",
);

////////////////////////////////////////////////////////////////////////////////////

export interface ContentDialogHeaderProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const ContentDialogHeader = React.forwardRef<HTMLDivElement, ContentDialogHeaderProps>(
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

ContentDialogHeader.displayName = "ContentDialogHeader";

////////////////////////////////////////////////////////////////////////////////////

// NOTE: uses DialogPrimitive.TitleProps,
// but actual rendered component is a Primitive.span rather than a DialogPrimitive.Title
// find out why later; misses h2 and some a11y features
export interface ContentDialogTitleProps extends DialogPrimitive.TitleProps {}

export const ContentDialogTitle = withContext<HTMLHeadingElement, ContentDialogTitleProps>(
  withStateProps(Primitive.span),
  "title",
);

////////////////////////////////////////////////////////////////////////////////////

// NOTE: uses DialogPrimitive.DescriptionProps,
// but actual rendered component is a Primitive.div rather than a DialogPrimitive.Description
// find out why later; misses p and some a11y features
export interface ContentDialogDescriptionProps extends DialogPrimitive.DescriptionProps {}

export const ContentDialogDescription = withContext<
  HTMLParagraphElement,
  ContentDialogDescriptionProps
>(withStateProps(Primitive.div), "description");

////////////////////////////////////////////////////////////////////////////////////

export interface ContentDialogBodyProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const ContentDialogBody = React.forwardRef<HTMLDivElement, ContentDialogBodyProps>(
  ({ className, ...props }, forwardedRef) => {
    const classNames = useClassNames();

    const ref = React.useRef<HTMLDivElement>(null);
    const [scrolled, setScrolled] = React.useState(false);

    React.useEffect(() => {
      const element = ref.current;
      if (!element) return;

      const check = () => setScrolled(element.scrollTop > 0);
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
        className={clsx(classNames.body, className)}
        {...props}
      />
    );
  },
);

ContentDialogBody.displayName = "ContentDialogBody";

////////////////////////////////////////////////////////////////////////////////////

export interface ContentDialogFooterProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const ContentDialogFooter = withContext<HTMLDivElement, ContentDialogFooterProps>(
  Primitive.div,
  "footer",
);

////////////////////////////////////////////////////////////////////////////////////

export interface ContentDialogActionProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLButtonElement> {}

export const ContentDialogAction = DialogPrimitive.CloseButton;

////////////////////////////////////////////////////////////////////////////////////

export interface ContentDialogCloseButtonProps extends DialogPrimitive.CloseButtonProps {}

export const ContentDialogCloseButton = React.forwardRef<
  HTMLButtonElement,
  ContentDialogCloseButtonProps
>(({ className, ...props }, ref) => {
  const classNames = useClassNames();
  const { trackRef } = closeButtonTracker.useRenderTracking();

  return (
    <DialogPrimitive.CloseButton
      ref={composeRefs(ref, trackRef)}
      className={clsx(classNames.closeButton, className)}
      {...props}
    />
  );
});

ContentDialogCloseButton.displayName = "ContentDialogCloseButton";
