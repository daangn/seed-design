import { sidePanel, type SidePanelVariantProps } from "@seed-design/css/recipes/side-panel";
import { Drawer } from "@seed-design/react-drawer";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { composeRefs } from "@radix-ui/react-compose-refs";
import { dataAttr } from "@seed-design/dom-utils";
import clsx from "clsx";
import * as React from "react";
import { createRenderTrackingContext } from "../../utils/createRenderTrackingContext";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { useStyleProps, withStyleProps, type StyleProps } from "../../utils/styled";

const { withContext, useClassNames, ClassNamesProvider } = createSlotRecipeContext(sidePanel);

const closeButtonTracker = createRenderTrackingContext("SidePanelCloseButton");

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

export function SidePanelRoot(props: SidePanelRootProps) {
  const [variantProps, otherProps] = sidePanel.splitVariantProps({
    direction: "right" as const,
    lazyMount: true,
    unmountOnExit: true,
    ...props,
  });
  const classNames = sidePanel(variantProps);

  return (
    <ClassNamesProvider value={classNames}>
      <closeButtonTracker.Provider>
        <Drawer.Root {...otherProps} />
      </closeButtonTracker.Provider>
    </ClassNamesProvider>
  );
}

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

export const SidePanelHeader = React.forwardRef<HTMLDivElement, SidePanelHeaderProps>(
  ({ className, ...props }, ref) => {
    const classNames = useClassNames();
    const { isRendered } = closeButtonTracker.useRenderTracking();

    return (
      <Drawer.Header
        ref={ref}
        data-show-close-button={dataAttr(isRendered)}
        className={clsx(classNames.header, className)}
        {...props}
      />
    );
  },
);

SidePanelHeader.displayName = "SidePanelHeader";

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

export const SidePanelBody = React.forwardRef<HTMLDivElement, SidePanelBodyProps>(
  (props, forwardedRef) => {
    const classNames = useClassNames();
    const { style, restProps } = useStyleProps(props);
    const { className, ...otherProps } = restProps;

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
        className={clsx(classNames.body, className)}
        style={style}
        {...{ "data-scrolled": dataAttr(scrolled) }}
        {...otherProps}
      />
    );
  },
);

SidePanelBody.displayName = "SidePanelBody";

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

export const SidePanelCloseButton = React.forwardRef<HTMLButtonElement, SidePanelCloseButtonProps>(
  ({ className, ...props }, ref) => {
    const classNames = useClassNames();
    const { trackRef } = closeButtonTracker.useRenderTracking();

    return (
      <Drawer.CloseButton
        ref={composeRefs(ref, trackRef)}
        className={clsx(classNames.closeButton, className)}
        {...props}
      />
    );
  },
);

SidePanelCloseButton.displayName = "SidePanelCloseButton";
