import { bottomSheet, type BottomSheetVariantProps } from "@seed-design/css/recipes/bottom-sheet";
import { Drawer, useDrawerContext } from "@seed-design/react-drawer";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import clsx from "clsx";
import type { StyleProps } from "../../utils/styled";
import { forwardRef } from "react";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";

const { content, header, positioner, backdrop, title, description, closeButton, body, footer } =
  bottomSheet();

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

export const BottomSheetBackdrop = (props: BottomSheetBackdropProps) => {
  const { className, ...restProps } = props;
  return <Drawer.Backdrop className={clsx(backdrop, className)} {...restProps} />;
};

////////////////////////////////////////////////////////////////////////////////////

export interface BottomSheetContentProps extends Drawer.ContentProps {}

export const BottomSheetContent = forwardRef<HTMLDivElement, BottomSheetContentProps>(
  (props, ref) => {
    const { className, ...restProps } = props;
    return <Drawer.Content className={clsx(content, className)} ref={ref} {...restProps} />;
  },
);

////////////////////////////////////////////////////////////////////////////////////

export interface BottomSheetHeaderProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const BottomSheetHeader = (props: BottomSheetHeaderProps) => {
  const { className, ...restProps } = props;
  return <Primitive.div className={clsx(header, className)} {...restProps} />;
};

////////////////////////////////////////////////////////////////////////////////////

export interface BottomSheetTitleProps extends Drawer.TitleProps {}

export const BottomSheetTitle = (props: BottomSheetTitleProps) => {
  const { className, ...restProps } = props;
  return <Drawer.Title className={clsx(title, className)} {...restProps} />;
};

////////////////////////////////////////////////////////////////////////////////////

export interface BottomSheetDescriptionProps extends Drawer.DescriptionProps {}

export const BottomSheetDescription = (props: BottomSheetDescriptionProps) => {
  const { className, ...restProps } = props;
  return <Drawer.Description className={clsx(description, className)} {...restProps} />;
};

////////////////////////////////////////////////////////////////////////////////////

export interface BottomSheetBodyProps
  extends PrimitiveProps,
    Pick<
      StyleProps,
      "paddingX" | "height" | "maxHeight" | "minHeight" | "justifyContent" | "alignItems"
    >,
    React.HTMLAttributes<HTMLDivElement> {}

export const BottomSheetBody = (props: BottomSheetBodyProps) => {
  const { className, ...restProps } = props;
  return <Primitive.div className={clsx(body, className)} {...restProps} />;
};

////////////////////////////////////////////////////////////////////////////////////

export interface BottomSheetFooterProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const BottomSheetFooter = (props: BottomSheetFooterProps) => {
  const { className, ...restProps } = props;
  return <Primitive.div className={clsx(footer, className)} {...restProps} />;
};

////////////////////////////////////////////////////////////////////////////////////

export interface BottomSheetCloseButtonProps extends Drawer.CloseButtonProps {}

export const BottomSheetCloseButton = forwardRef<HTMLButtonElement, BottomSheetCloseButtonProps>(
  (props, ref) => {
    const api = useDrawerContext();
    const { className, ...restProps } = props;
    return (
      <Drawer.CloseButton
        className={clsx(closeButton, className)}
        {...restProps}
        ref={ref}
        onClick={() => api.setIsOpen(false)}
      />
    );
  },
);
