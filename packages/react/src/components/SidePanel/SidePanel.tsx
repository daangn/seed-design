import { sidePanel, type SidePanelVariantProps } from "@seed-design/css/recipes/side-panel";
import { Drawer } from "@seed-design/react-drawer";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import type { ReactNode } from "react";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { withStyleProps, type StyleProps } from "../../utils/styled";

const { withRootProvider, withContext } = createSlotRecipeContext(sidePanel);

////////////////////////////////////////////////////////////////////////////////////

export interface SidePanelRootProps
  extends SidePanelVariantProps,
    Pick<
      Drawer.RootProps,
      | "open"
      | "defaultOpen"
      | "onOpenChange"
      | "modal"
      | "dismissible"
      | "closeOnEscape"
      | "closeOnInteractOutside"
      | "lazyMount"
      | "unmountOnExit"
      | "container"
      | "autoFocus"
      | "onAnimationEnd"
      | "closeThreshold"
      | "onDrag"
      | "onRelease"
    > {
  /** Direction the side panel slides in from. @default "right" */
  direction?: "left" | "right";
  children?: ReactNode;
}

export const SidePanelRoot = withRootProvider<SidePanelRootProps>(Drawer.Root, {
  defaultProps: {
    direction: "right",
    lazyMount: true,
    unmountOnExit: true,
  },
});

////////////////////////////////////////////////////////////////////////////////////

export interface SidePanelTriggerProps
  extends PrimitiveProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const SidePanelTrigger = Drawer.Trigger;

////////////////////////////////////////////////////////////////////////////////////

export interface SidePanelPositionerProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const SidePanelPositioner = withContext<HTMLDivElement, SidePanelPositionerProps>(
  Drawer.Positioner,
  "positioner",
);

////////////////////////////////////////////////////////////////////////////////////

export interface SidePanelBackdropProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const SidePanelBackdrop = withContext<HTMLDivElement, SidePanelBackdropProps>(
  Drawer.Backdrop,
  "backdrop",
);

////////////////////////////////////////////////////////////////////////////////////

export interface SidePanelContentProps
  extends PrimitiveProps,
    Pick<StyleProps, "width" | "maxWidth">,
    React.HTMLAttributes<HTMLDivElement> {}

export const SidePanelContent = withContext<HTMLDivElement, SidePanelContentProps>(
  withStyleProps(Drawer.Content),
  "content",
);

////////////////////////////////////////////////////////////////////////////////////

export interface SidePanelHeaderProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const SidePanelHeader = withContext<HTMLDivElement, SidePanelHeaderProps>(
  Drawer.Header,
  "header",
);

////////////////////////////////////////////////////////////////////////////////////

export interface SidePanelTitleProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLHeadingElement> {}

export const SidePanelTitle = withContext<HTMLHeadingElement, SidePanelTitleProps>(
  Drawer.Title,
  "title",
);

SidePanelTitle.displayName = "SidePanelTitle";

////////////////////////////////////////////////////////////////////////////////////

export interface SidePanelDescriptionProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLParagraphElement> {}

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

export interface SidePanelCloseButtonProps
  extends PrimitiveProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const SidePanelCloseButton = withContext<HTMLButtonElement, SidePanelCloseButtonProps>(
  Drawer.CloseButton,
  "closeButton",
);
