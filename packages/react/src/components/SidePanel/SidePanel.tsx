import { sidePanel, type SidePanelVariantProps } from "@seed-design/css/recipes/side-panel";
import { Drawer } from "@seed-design/react-drawer";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { withStyleProps, type StyleProps } from "../../utils/styled";

const { withRootProvider, withContext } = createSlotRecipeContext(sidePanel);

////////////////////////////////////////////////////////////////////////////////////

export interface SidePanelRootProps
  extends SidePanelVariantProps,
    Pick<
      Drawer.RootProps,
      | "children"
      | "open"
      | "defaultOpen"
      | "onOpenChange"
      | "modal"
      | "dismissible"
      | "closeOnEscape"
      | "closeOnInteractOutside"
      | "lazyMount"
      | "unmountOnExit"
      | "onAnimationEnd"
    > {
  /** Direction the side panel slides in from. @default "right" */
  direction?: "left" | "right";
}

export const SidePanelRoot = withRootProvider<SidePanelRootProps>(Drawer.Root, {
  defaultProps: {
    direction: "right",
    lazyMount: true,
    unmountOnExit: true,
  },
});

////////////////////////////////////////////////////////////////////////////////////

export interface SidePanelTriggerProps extends Drawer.TriggerProps {}

export const SidePanelTrigger = Drawer.Trigger;

////////////////////////////////////////////////////////////////////////////////////

export interface SidePanelPositionerProps extends Drawer.PositionerProps {}

export const SidePanelPositioner = withContext<HTMLDivElement, SidePanelPositionerProps>(
  Drawer.Positioner,
  "positioner",
);

////////////////////////////////////////////////////////////////////////////////////

export interface SidePanelBackdropProps extends Drawer.BackdropProps {}

export const SidePanelBackdrop = withContext<HTMLDivElement, SidePanelBackdropProps>(
  Drawer.Backdrop,
  "backdrop",
);

////////////////////////////////////////////////////////////////////////////////////

export interface SidePanelContentProps
  extends Drawer.ContentProps,
    Pick<StyleProps, "width" | "maxWidth"> {}

export const SidePanelContent = withContext<HTMLDivElement, SidePanelContentProps>(
  withStyleProps(Drawer.Content),
  "content",
);

////////////////////////////////////////////////////////////////////////////////////

export interface SidePanelHeaderProps extends Drawer.HeaderProps {}

export const SidePanelHeader = withContext<HTMLDivElement, SidePanelHeaderProps>(
  Drawer.Header,
  "header",
);

////////////////////////////////////////////////////////////////////////////////////

export interface SidePanelTitleProps extends Drawer.TitleProps {}

export const SidePanelTitle = withContext<HTMLHeadingElement, SidePanelTitleProps>(
  Drawer.Title,
  "title",
);

SidePanelTitle.displayName = "SidePanelTitle";

////////////////////////////////////////////////////////////////////////////////////

export interface SidePanelDescriptionProps extends Drawer.DescriptionProps {}

export const SidePanelDescription = withContext<HTMLParagraphElement, SidePanelDescriptionProps>(
  Drawer.Description,
  "description",
);

SidePanelDescription.displayName = "SidePanelDescription";

////////////////////////////////////////////////////////////////////////////////////

export interface SidePanelBodyProps
  extends PrimitiveProps,
    Pick<
      StyleProps,
      "paddingX" | "height" | "maxHeight" | "minHeight" | "justifyContent" | "alignItems"
    >,
    React.HTMLAttributes<HTMLDivElement> {}

export const SidePanelBody = withContext<HTMLDivElement, SidePanelBodyProps>(
  withStyleProps(Primitive.div),
  "body",
);

////////////////////////////////////////////////////////////////////////////////////

export interface SidePanelFooterProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const SidePanelFooter = withContext<HTMLDivElement, SidePanelFooterProps>(
  Primitive.div,
  "footer",
);

////////////////////////////////////////////////////////////////////////////////////

export interface SidePanelCloseButtonProps extends Drawer.CloseButtonProps {}

export const SidePanelCloseButton = withContext<HTMLButtonElement, SidePanelCloseButtonProps>(
  Drawer.CloseButton,
  "closeButton",
);
