import { drawer, type DrawerVariantProps } from "@seed-design/css/recipes/drawer";
import { dataAttr } from "@seed-design/dom-utils";
import { Drawer, useDrawerContext } from "@seed-design/react-drawer";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { forwardRef } from "react";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { withStyleProps, type StyleProps } from "../../utils/styled";

const { withRootProvider, withContext } = createSlotRecipeContext(drawer);

////////////////////////////////////////////////////////////////////////////////////

export interface DrawerRootProps extends DrawerVariantProps, Drawer.RootProps {}

export const DrawerRoot = withRootProvider<DrawerRootProps>(Drawer.Root, {
  defaultProps: {
    direction: "right",
    lazyMount: true,
    unmountOnExit: true,
  },
});

////////////////////////////////////////////////////////////////////////////////////

export interface DrawerTriggerProps extends Drawer.TriggerProps {}

export const DrawerTrigger = Drawer.Trigger;

////////////////////////////////////////////////////////////////////////////////////

export interface DrawerPositionerProps extends Drawer.PositionerProps {}

export const DrawerPositioner = withContext<HTMLDivElement, DrawerPositionerProps>(
  Drawer.Positioner,
  "positioner",
);

////////////////////////////////////////////////////////////////////////////////////

export interface DrawerBackdropProps extends Drawer.BackdropProps {}

export const DrawerBackdrop = withContext<HTMLDivElement, DrawerBackdropProps>(
  Drawer.Backdrop,
  "backdrop",
);

////////////////////////////////////////////////////////////////////////////////////

export interface DrawerContentProps
  extends Drawer.ContentProps,
    Pick<StyleProps, "width" | "maxWidth" | "height" | "maxHeight"> {}

export const DrawerContent = withContext<HTMLDivElement, DrawerContentProps>(
  withStyleProps(Drawer.Content),
  "content",
);

////////////////////////////////////////////////////////////////////////////////////

export interface DrawerHeaderProps extends Drawer.HeaderProps {}

export const DrawerHeader = withContext<HTMLDivElement, DrawerHeaderProps>(Drawer.Header, "header");

////////////////////////////////////////////////////////////////////////////////////

export interface DrawerTitleProps extends Drawer.TitleProps {}

export const DrawerTitle = withContext<HTMLHeadingElement, DrawerTitleProps>(
  forwardRef<HTMLHeadingElement, DrawerTitleProps>((props, ref) => {
    const { isCloseButtonRendered } = useDrawerContext();

    return (
      <Drawer.Title ref={ref} data-show-close-button={dataAttr(isCloseButtonRendered)} {...props} />
    );
  }),
  "title",
);

DrawerTitle.displayName = "DrawerTitle";

////////////////////////////////////////////////////////////////////////////////////

export interface DrawerDescriptionProps extends Drawer.DescriptionProps {}

export const DrawerDescription = withContext<HTMLParagraphElement, DrawerDescriptionProps>(
  Drawer.Description,
  "description",
);

////////////////////////////////////////////////////////////////////////////////////

export interface DrawerBodyProps
  extends PrimitiveProps,
    Pick<StyleProps, "height" | "maxHeight" | "minHeight" | "justifyContent" | "alignItems">,
    React.HTMLAttributes<HTMLDivElement> {}

export const DrawerBody = withContext<HTMLDivElement, DrawerBodyProps>(
  withStyleProps(Primitive.div),
  "body",
);

////////////////////////////////////////////////////////////////////////////////////

export interface DrawerFooterProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const DrawerFooter = withContext<HTMLDivElement, DrawerFooterProps>(Primitive.div, "footer");

////////////////////////////////////////////////////////////////////////////////////

export interface DrawerCloseButtonProps extends Drawer.CloseButtonProps {}

export const DrawerCloseButton = withContext<HTMLButtonElement, DrawerCloseButtonProps>(
  Drawer.CloseButton,
  "closeButton",
);

////////////////////////////////////////////////////////////////////////////////////

export interface DrawerHandleProps extends Drawer.HandleProps {}

export const DrawerHandle = Drawer.Handle;
