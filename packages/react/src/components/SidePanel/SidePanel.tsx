import { sidePanel, type SidePanelVariantProps } from "@seed-design/css/recipes/side-panel";
import { dataAttr } from "@seed-design/dom-utils";
import { Drawer, useDrawerContext } from "@seed-design/react-drawer";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { forwardRef, type ReactNode } from "react";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { withStyleProps, type StyleProps } from "../../utils/styled";

const { withRootProvider, withContext } = createSlotRecipeContext(sidePanel);

////////////////////////////////////////////////////////////////////////////////////

export interface SidePanelRootProps extends SidePanelVariantProps {
  /** Whether the side panel is open (controlled). */
  open?: boolean;
  /** Default open state (uncontrolled). */
  defaultOpen?: boolean;
  /** Called when open state changes. */
  onOpenChange?: (open: boolean) => void;
  /** Direction the side panel slides in from. @default "right" */
  direction?: "left" | "right";
  /** Whether the side panel is modal (with backdrop and focus trap). @default true */
  modal?: boolean;
  /** Whether the side panel can be dismissed via Escape, outside click, or drag. @default true */
  dismissible?: boolean;
  /** Whether to close on Escape key. @default true */
  closeOnEscape?: boolean;
  /** Whether to close on outside interaction. @default true */
  closeOnInteractOutside?: boolean;
  /** Lazy-mount the content on first open. @default true */
  lazyMount?: boolean;
  /** Unmount the content on close. @default true */
  unmountOnExit?: boolean;
  /** Custom portal container. */
  container?: HTMLElement | null;
  /** Whether to auto-focus the content on open. @default true */
  autoFocus?: boolean;
  /** Called when the panel finishes opening or closing. */
  onAnimationEnd?: (open: boolean) => void;
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
    Pick<StyleProps, "width" | "maxWidth" | "height" | "maxHeight">,
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
  forwardRef<HTMLHeadingElement, SidePanelTitleProps>((props, ref) => {
    const { isCloseButtonRendered } = useDrawerContext();

    return (
      <Drawer.Title ref={ref} data-show-close-button={dataAttr(isCloseButtonRendered)} {...props} />
    );
  }),
  "title",
);

SidePanelTitle.displayName = "SidePanelTitle";

////////////////////////////////////////////////////////////////////////////////////

export interface SidePanelDescriptionProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLParagraphElement> {}

export const SidePanelDescription = withContext<HTMLParagraphElement, SidePanelDescriptionProps>(
  forwardRef<HTMLParagraphElement, SidePanelDescriptionProps>((props, ref) => {
    const { isCloseButtonRendered } = useDrawerContext();

    return (
      <Drawer.Description
        ref={ref}
        data-show-close-button={dataAttr(isCloseButtonRendered)}
        {...props}
      />
    );
  }),
  "description",
);

SidePanelDescription.displayName = "SidePanelDescription";

////////////////////////////////////////////////////////////////////////////////////

export interface SidePanelBodyProps
  extends PrimitiveProps,
    Pick<StyleProps, "height" | "maxHeight" | "minHeight" | "justifyContent" | "alignItems">,
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
