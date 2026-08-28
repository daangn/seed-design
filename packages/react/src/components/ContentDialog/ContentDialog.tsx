import { composeRefs, useComposedRefs } from "@radix-ui/react-compose-refs";
import {
  contentDialog,
  type ContentDialogVariantProps,
} from "@seed-design/css/recipes/content-dialog";
import { dataAttr } from "@seed-design/dom-utils";
import { Dialog as DialogPrimitive } from "@seed-design/react-dialog";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import clsx from "clsx";
import * as React from "react";
import { createRenderTrackingContext } from "../../utils/createRenderTrackingContext";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { useScaleFeedback } from "@seed-design/react-scale-feedback";
import { useStyleProps, withStyleProps, type StyleProps } from "../../utils/styled";

const { withContext, useClassNames, ClassNamesProvider } = createSlotRecipeContext(contentDialog);

const closeButtonTracker = createRenderTrackingContext("ContentDialogCloseButton");

////////////////////////////////////////////////////////////////////////////////////

export interface ContentDialogRootProps
  extends ContentDialogVariantProps,
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

export function ContentDialogRoot(props: ContentDialogRootProps) {
  const [variantProps, otherProps] = contentDialog.splitVariantProps({
    lazyMount: true,
    unmountOnExit: true,
    ...props,
  });
  const classNames = contentDialog(variantProps);

  return (
    <ClassNamesProvider value={classNames}>
      <closeButtonTracker.Provider>
        <DialogPrimitive.Root {...otherProps} />
      </closeButtonTracker.Provider>
    </ClassNamesProvider>
  );
}

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

export interface ContentDialogContentProps
  extends DialogPrimitive.ContentProps,
    Pick<StyleProps, "width" | "maxWidth"> {}

export const ContentDialogContent = withContext<HTMLDivElement, ContentDialogContentProps>(
  withStyleProps(DialogPrimitive.Content),
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

export interface ContentDialogTitleProps extends DialogPrimitive.TitleProps {}

export const ContentDialogTitle = withContext<HTMLHeadingElement, ContentDialogTitleProps>(
  DialogPrimitive.Title,
  "title",
);

////////////////////////////////////////////////////////////////////////////////////

export interface ContentDialogDescriptionProps extends DialogPrimitive.DescriptionProps {}

export const ContentDialogDescription = withContext<
  HTMLParagraphElement,
  ContentDialogDescriptionProps
>(DialogPrimitive.Description, "description");

////////////////////////////////////////////////////////////////////////////////////

export interface ContentDialogBodyProps
  extends PrimitiveProps,
    Pick<StyleProps, "paddingX" | "minHeight" | "maxHeight" | "justifyContent" | "alignItems">,
    React.HTMLAttributes<HTMLDivElement> {}

export const ContentDialogBody = React.forwardRef<HTMLDivElement, ContentDialogBodyProps>(
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

export interface ContentDialogActionProps extends DialogPrimitive.CloseButtonProps {}

export const ContentDialogAction = DialogPrimitive.CloseButton;

////////////////////////////////////////////////////////////////////////////////////

export interface ContentDialogCloseButtonProps extends DialogPrimitive.CloseButtonProps {}

export const ContentDialogCloseButton = React.forwardRef<
  HTMLButtonElement,
  ContentDialogCloseButtonProps
>(({ className, ...props }, ref) => {
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
});

ContentDialogCloseButton.displayName = "ContentDialogCloseButton";
