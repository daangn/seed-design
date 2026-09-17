import { composeRefs, useComposedRefs } from "@radix-ui/react-compose-refs";
import { dialog, type DialogVariantProps } from "@seed-design/css/recipes/dialog";
import { dataAttr } from "@seed-design/dom-utils";
import { Dialog as DialogPrimitive } from "@seed-design/react-dialog";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import clsx from "clsx";
import * as React from "react";
import { createRenderTrackingContext } from "../../utils/createRenderTrackingContext";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { useScaleFeedback } from "@seed-design/react-scale-feedback";
import { useStyleProps, withStyleProps, type StyleProps } from "../../utils/styled";

const { withContext, useClassNames, ClassNamesProvider } = createSlotRecipeContext(dialog);

const closeButtonTracker = createRenderTrackingContext("DialogCloseButton");

////////////////////////////////////////////////////////////////////////////////////

export interface DialogRootProps
  extends DialogVariantProps,
    Omit<DialogPrimitive.RootProps, "role"> {
  /**
   * @default true
   */
  lazyMount?: DialogPrimitive.RootProps["lazyMount"];
  /**
   * @default true
   */
  unmountOnExit?: DialogPrimitive.RootProps["unmountOnExit"];
}

export function DialogRoot(props: DialogRootProps) {
  const [variantProps, otherProps] = dialog.splitVariantProps({
    lazyMount: true,
    unmountOnExit: true,
    ...props,
  });
  const classNames = dialog(variantProps);

  return (
    <ClassNamesProvider value={classNames}>
      <closeButtonTracker.Provider>
        <DialogPrimitive.Root {...otherProps} />
      </closeButtonTracker.Provider>
    </ClassNamesProvider>
  );
}

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

export interface DialogContentProps
  extends DialogPrimitive.ContentProps,
    Pick<StyleProps, "width" | "maxWidth"> {}

export const DialogContent = withContext<HTMLDivElement, DialogContentProps>(
  withStyleProps(DialogPrimitive.Content),
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

export interface DialogTitleProps extends DialogPrimitive.TitleProps {}

export const DialogTitle = withContext<HTMLHeadingElement, DialogTitleProps>(
  DialogPrimitive.Title,
  "title",
);

////////////////////////////////////////////////////////////////////////////////////

export interface DialogDescriptionProps extends DialogPrimitive.DescriptionProps {}

export const DialogDescription = withContext<HTMLParagraphElement, DialogDescriptionProps>(
  DialogPrimitive.Description,
  "description",
);

////////////////////////////////////////////////////////////////////////////////////

export interface DialogBodyProps
  extends PrimitiveProps,
    Pick<StyleProps, "paddingX" | "minHeight" | "maxHeight" | "justifyContent" | "alignItems">,
    React.HTMLAttributes<HTMLDivElement> {}

export const DialogBody = React.forwardRef<HTMLDivElement, DialogBodyProps>(
  (props, forwardedRef) => {
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
  },
);

DialogBody.displayName = "DialogBody";

////////////////////////////////////////////////////////////////////////////////////

export interface DialogFooterProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const DialogFooter = withContext<HTMLDivElement, DialogFooterProps>(Primitive.div, "footer");

////////////////////////////////////////////////////////////////////////////////////

export interface DialogActionProps extends DialogPrimitive.CloseButtonProps {}

export const DialogAction = DialogPrimitive.CloseButton;

////////////////////////////////////////////////////////////////////////////////////

export interface DialogCloseButtonProps extends DialogPrimitive.CloseButtonProps {}

export const DialogCloseButton = React.forwardRef<HTMLButtonElement, DialogCloseButtonProps>(
  ({ className, ...props }, ref) => {
    const classNames = useClassNames();
    const { trackRef } = closeButtonTracker.useRenderTracking();
    const { scaleFeedbackRef, scaleFeedbackClassName } = useScaleFeedback();

    return (
      <DialogPrimitive.CloseButton
        ref={useComposedRefs(scaleFeedbackRef, ref, trackRef)}
        className={clsx(classNames.closeButton, scaleFeedbackClassName, className)}
        {...props}
      />
    );
  },
);

DialogCloseButton.displayName = "DialogCloseButton";
