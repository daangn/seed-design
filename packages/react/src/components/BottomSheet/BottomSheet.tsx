import { bottomSheet, type BottomSheetVariantProps } from "@ride-developer/css/recipes/bottom-sheet";
import { dataAttr } from "@seed-design/dom-utils";
import { Drawer, useDrawerContext } from "@seed-design/react-drawer";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { forwardRef } from "react";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { withStyleProps, type StyleProps } from "../../utils/styled";

const { withRootProvider, withContext } = createSlotRecipeContext(bottomSheet);

////////////////////////////////////////////////////////////////////////////////////

export interface BottomSheetRootProps extends BottomSheetVariantProps, Drawer.RootProps {}

export const BottomSheetRoot = withRootProvider<BottomSheetRootProps>(Drawer.Root, {
  defaultProps: {
    direction: "bottom",
  },
});

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

export const BottomSheetTitle = withContext<HTMLHeadingElement, BottomSheetTitleProps>(
  forwardRef<HTMLHeadingElement, BottomSheetTitleProps>((props, ref) => {
    const { isCloseButtonRendered } = useDrawerContext();

    return (
      <Drawer.Title ref={ref} data-show-close-button={dataAttr(isCloseButtonRendered)} {...props} />
    );
  }),
  "title",
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

export const BottomSheetCloseButton = withContext<HTMLButtonElement, BottomSheetCloseButtonProps>(
  Drawer.CloseButton,
  "closeButton",
);
