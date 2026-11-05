import { bottomSheet, type BottomSheetVariantProps } from "@seed-design/css/recipes/bottom-sheet";
import { useComposedRefs } from "@radix-ui/react-compose-refs";
import { dataAttr } from "@seed-design/dom-utils";
import { Drawer } from "@seed-design/react-drawer";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import clsx from "clsx";
import { forwardRef } from "react";
import { useScaleFeedback } from "@seed-design/react-scale-feedback";
import { createRenderTrackingContext } from "../../utils/createRenderTrackingContext";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { withStyleProps, type StyleProps } from "../../utils/styled";

const { withContext, useClassNames, ClassNamesProvider } = createSlotRecipeContext(bottomSheet);

const closeButtonTracker = createRenderTrackingContext("BottomSheetCloseButton");

////////////////////////////////////////////////////////////////////////////////////

export interface BottomSheetRootProps
  extends BottomSheetVariantProps,
    Omit<Drawer.RootProps, "direction"> {}

export function BottomSheetRoot(props: BottomSheetRootProps) {
  const [variantProps, otherProps] = bottomSheet.splitVariantProps({
    direction: "bottom" as const,
    lazyMount: true,
    unmountOnExit: true,
    ...props,
  });
  const classNames = bottomSheet(variantProps);

  return (
    <ClassNamesProvider value={classNames}>
      <closeButtonTracker.Provider>
        <Drawer.Root {...otherProps} />
      </closeButtonTracker.Provider>
    </ClassNamesProvider>
  );
}

////////////////////////////////////////////////////////////////////////////////////

export interface BottomSheetTriggerProps extends Drawer.TriggerProps {}

export const BottomSheetTrigger = Drawer.Trigger;

////////////////////////////////////////////////////////////////////////////////////

export interface BottomSheetPositionerProps extends Drawer.PositionerProps {}

export const BottomSheetPositioner = withContext<HTMLDivElement, BottomSheetPositionerProps>(
  Drawer.Positioner,
  "positioner",
);

////////////////////////////////////////////////////////////////////////////////////

export interface BottomSheetBackdropProps extends Drawer.BackdropProps {}

export const BottomSheetBackdrop = withContext<HTMLDivElement, BottomSheetBackdropProps>(
  Drawer.Backdrop,
  "backdrop",
);

////////////////////////////////////////////////////////////////////////////////////

export interface BottomSheetContentProps extends Drawer.ContentProps {}

export const BottomSheetContent = withContext<HTMLDivElement, BottomSheetContentProps>(
  Drawer.Content,
  "content",
);

////////////////////////////////////////////////////////////////////////////////////

export interface BottomSheetHeaderProps extends Drawer.HeaderProps {}

export const BottomSheetHeader = withContext<HTMLDivElement, BottomSheetHeaderProps>(
  Drawer.Header,
  "header",
);

////////////////////////////////////////////////////////////////////////////////////

export interface BottomSheetTitleProps extends Drawer.TitleProps {}

export const BottomSheetTitle = forwardRef<HTMLHeadingElement, BottomSheetTitleProps>(
  ({ className, ...props }, ref) => {
    const classNames = useClassNames();
    const { isRendered } = closeButtonTracker.useRenderTracking();

    return (
      <Drawer.Title
        ref={ref}
        data-show-close-button={dataAttr(isRendered)}
        className={clsx(classNames.title, className)}
        {...props}
      />
    );
  },
);

BottomSheetTitle.displayName = "BottomSheetTitle";

////////////////////////////////////////////////////////////////////////////////////

export interface BottomSheetDescriptionProps extends Drawer.DescriptionProps {}

export const BottomSheetDescription = withContext<
  HTMLParagraphElement,
  BottomSheetDescriptionProps
>(Drawer.Description, "description");

////////////////////////////////////////////////////////////////////////////////////

export interface BottomSheetBodyProps
  extends PrimitiveProps,
    Pick<
      StyleProps,
      "paddingX" | "height" | "maxHeight" | "minHeight" | "justifyContent" | "alignItems"
    >,
    React.HTMLAttributes<HTMLDivElement> {}

export const BottomSheetBody = withContext<HTMLDivElement, BottomSheetBodyProps>(
  withStyleProps(Primitive.div),
  "body",
);

////////////////////////////////////////////////////////////////////////////////////

export interface BottomSheetFooterProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const BottomSheetFooter = withContext<HTMLDivElement, BottomSheetFooterProps>(
  Primitive.div,
  "footer",
);

////////////////////////////////////////////////////////////////////////////////////

export interface BottomSheetCloseButtonProps extends Drawer.CloseButtonProps {}

export const BottomSheetCloseButton = forwardRef<HTMLButtonElement, BottomSheetCloseButtonProps>(
  ({ className, ...props }, ref) => {
    const classNames = useClassNames();
    const { trackRef } = closeButtonTracker.useRenderTracking();
    const { scaleFeedbackRef, scaleFeedbackClassName } = useScaleFeedback();

    return (
      <Drawer.CloseButton
        ref={useComposedRefs(scaleFeedbackRef, ref, trackRef)}
        className={clsx(classNames.closeButton, scaleFeedbackClassName, className)}
        {...props}
      />
    );
  },
);

BottomSheetCloseButton.displayName = "BottomSheetCloseButton";
