import { composeRefs } from "@radix-ui/react-compose-refs";
import { dialog, type DialogVariantProps } from "@seed-design/css/recipes/dialog";
import { dataAttr } from "@seed-design/dom-utils";
import { Dialog as DialogPrimitive, useDialogContext } from "@seed-design/react-dialog";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import clsx from "clsx";
import * as React from "react";
import { createRenderTrackingContext } from "../../utils/createRenderTrackingContext";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { createWithStateProps } from "../../utils/createWithStateProps";

const { withRootProvider, withContext, useClassNames } = createSlotRecipeContext(dialog);
const withStateProps = createWithStateProps([useDialogContext]);

const closeButtonTracker = createRenderTrackingContext("DialogCloseButton");

////////////////////////////////////////////////////////////////////////////////////

export interface DialogRootProps extends DialogVariantProps, DialogPrimitive.RootProps {
  /**
   * @default true
   */
  lazyMount?: DialogPrimitive.RootProps["lazyMount"];
  /**
   * @default true
   */
  unmountOnExit?: DialogPrimitive.RootProps["unmountOnExit"];
}

const DialogRootBase = (props: DialogPrimitive.RootProps) => (
  <closeButtonTracker.Provider>
    <DialogPrimitive.Root {...props} />
  </closeButtonTracker.Provider>
);

export const DialogRoot = withRootProvider<DialogRootProps>(DialogRootBase, {
  defaultProps: {
    lazyMount: true,
    unmountOnExit: true,
  },
});

////////////////////////////////////////////////////////////////////////////////////

export interface DialogTriggerProps extends DialogPrimitive.TriggerProps {}

export const DialogTrigger = DialogPrimitive.Trigger;

////////////////////////////////////////////////////////////////////////////////////

export interface DialogPositionerProps extends DialogPrimitive.PositionerProps {}

export const DialogPositioner = withContext<HTMLDivElement, DialogPositionerProps>(
  DialogPrimitive.Positioner,
  "positioner",
);

////////////////////////////////////////////////////////////////////////////////////

export interface DialogBackdropProps extends DialogPrimitive.BackdropProps {}

export const DialogBackdrop = withContext<HTMLDivElement, DialogBackdropProps>(
  DialogPrimitive.Backdrop,
  "backdrop",
);

////////////////////////////////////////////////////////////////////////////////////

export interface DialogContentProps extends DialogPrimitive.ContentProps {}

export const DialogContent = withContext<HTMLDivElement, DialogContentProps>(
  DialogPrimitive.Content,
  "content",
);

////////////////////////////////////////////////////////////////////////////////////

export interface DialogHeaderProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const DialogHeader = React.forwardRef<HTMLDivElement, DialogHeaderProps>(
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

DialogHeader.displayName = "DialogHeader";

////////////////////////////////////////////////////////////////////////////////////

// NOTE: uses DialogPrimitive.TitleProps,
// but actual rendered component is a Primitive.span rather than a DialogPrimitive.Title
// find out why later; misses h2 and some a11y features
export interface DialogTitleProps extends DialogPrimitive.TitleProps {}

export const DialogTitle = withContext<HTMLHeadingElement, DialogTitleProps>(
  withStateProps(Primitive.span),
  "title",
);

////////////////////////////////////////////////////////////////////////////////////

// NOTE: uses DialogPrimitive.DescriptionProps,
// but actual rendered component is a Primitive.div rather than a DialogPrimitive.Description
// find out why later; misses p and some a11y features
export interface DialogDescriptionProps extends DialogPrimitive.DescriptionProps {}

export const DialogDescription = withContext<HTMLParagraphElement, DialogDescriptionProps>(
  withStateProps(Primitive.div),
  "description",
);

////////////////////////////////////////////////////////////////////////////////////

export interface DialogBodyProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const DialogBody = React.forwardRef<HTMLDivElement, DialogBodyProps>(
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

DialogBody.displayName = "DialogBody";

////////////////////////////////////////////////////////////////////////////////////

export interface DialogFooterProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const DialogFooter = withContext<HTMLDivElement, DialogFooterProps>(Primitive.div, "footer");

////////////////////////////////////////////////////////////////////////////////////

export interface DialogActionProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLButtonElement> {}

export const DialogAction = DialogPrimitive.CloseButton;

////////////////////////////////////////////////////////////////////////////////////

export interface DialogCloseButtonProps extends DialogPrimitive.CloseButtonProps {}

export const DialogCloseButton = React.forwardRef<HTMLButtonElement, DialogCloseButtonProps>(
  ({ className, ...props }, ref) => {
    const classNames = useClassNames();
    const { trackRef } = closeButtonTracker.useRenderTracking();

    return (
      <DialogPrimitive.CloseButton
        ref={composeRefs(ref, trackRef)}
        className={clsx(classNames.closeButton, className)}
        {...props}
      />
    );
  },
);

DialogCloseButton.displayName = "DialogCloseButton";
