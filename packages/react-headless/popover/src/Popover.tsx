"use client";

import { composeRefs } from "@radix-ui/react-compose-refs";
import { FocusScope } from "@radix-ui/react-focus-scope";
import { DismissibleLayer } from "@seed-design/react-dismissible-layer";
import { mergeProps } from "@seed-design/dom-utils";
import { Presence } from "@seed-design/react-presence";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import type * as React from "react";
import { forwardRef, useRef } from "react";
import { usePopover, type UsePopoverProps } from "./usePopover";
import { PopoverProvider, usePopoverContext } from "./usePopoverContext";
import { FloatingFocusManager, FloatingPortal, type FloatingPortalProps } from "@floating-ui/react";

export interface PopoverRootProps extends UsePopoverProps {
  children: React.ReactNode;
}

export const PopoverRoot = (props: PopoverRootProps) => {
  const { children, ...otherProps } = props;
  const api = usePopover(otherProps);
  return <PopoverProvider value={api}>{children}</PopoverProvider>;
};

export interface PopoverAnchorProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const PopoverAnchor = forwardRef<HTMLDivElement, PopoverAnchorProps>((props, ref) => {
  const api = usePopoverContext();
  return (
    <Primitive.div
      ref={composeRefs(api.refs.anchor, ref)}
      {...mergeProps(api.anchorProps, props)}
    />
  );
});
PopoverAnchor.displayName = "PopoverAnchor";

export interface PopoverTriggerProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLButtonElement> {}

export const PopoverTrigger = forwardRef<HTMLButtonElement, PopoverTriggerProps>((props, ref) => {
  const api = usePopoverContext();
  return (
    <Primitive.button
      ref={composeRefs(api.refs.trigger, ref)}
      {...mergeProps(api.triggerProps, props)}
    />
  );
});
PopoverTrigger.displayName = "PopoverTrigger";

/**
 * Registers the popover in SEED's shared layer stack for as long as it is open, so Escape
 * and outside presses resolve against the top-most layer instead of every open layer at
 * once, and an ancestor layer closing (Dialog, Drawer) cascades down to this one.
 *
 * The layer wraps the positioner rather than the content for two reasons. The positioner
 * is the floating element, so "outside the layer" keeps meaning what it meant while
 * dismissal lived in floating-ui's `useDismiss`. And it is the one part every consumer of
 * `usePopover` renders — HelpBubble supplies its own content element, so a layer on
 * `PopoverContent` would leave it out of the stack entirely.
 *
 * `pressBehavior="drag"` matches the other anchored surfaces (Menu, Select): a mouse press
 * outside dismisses on pointerdown, while touch waits for a drag or a completed tap so a
 * finger landing mid-scroll does not read as a dismiss.
 */
const PopoverDismissibleLayer = ({ children }: { children: React.ReactNode }) => {
  const { open, setOpen, closeOnInteractOutside, floatingContext } = usePopoverContext();

  return (
    <DismissibleLayer
      enabled={open}
      pressBehavior="drag"
      onEscapeKeyDown={(event) => {
        setOpen(false, { reason: "escapeKeyDown", event });
      }}
      onPressOutside={(event) => {
        if (!closeOnInteractOutside) return;

        setOpen(false, { reason: "interactOutside", event });
      }}
      onFocusOutside={() => {
        // Focus leaving the popover is FloatingFocusManager's call (`closeOnFocusOut` on
        // PopoverContent); the layer only owns pointer and Escape dismissal.
      }}
      onCascadeDismiss={({ dismissedParent }) => {
        setOpen(false, { reason: "cascadeDismiss", dismissedParent });
      }}
      exclude={(target) => {
        // The trigger lives outside the layer's DOM, but `useClick` already toggles the
        // popover shut when it is pressed. Treating it as outside would close the popover
        // on pointerdown and let that same press re-open it on click.
        const reference = floatingContext.refs.reference.current;
        if (!(reference instanceof HTMLElement)) return false;

        return reference.contains(target);
      }}
    >
      {children}
    </DismissibleLayer>
  );
};

export interface PopoverPositionerProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const PopoverPositioner = forwardRef<HTMLDivElement, PopoverPositionerProps>(
  (props, ref) => {
    const api = usePopoverContext();
    return (
      <PopoverDismissibleLayer>
        <Primitive.div
          ref={composeRefs(api.refs.positioner, ref)}
          {...mergeProps(api.positionerProps, props)}
        />
      </PopoverDismissibleLayer>
    );
  },
);
PopoverPositioner.displayName = "PopoverPositioner";

export interface PopoverPositionerPortalProps
  extends PopoverPositionerProps,
    Pick<FloatingPortalProps, "id" | "root" | "preserveTabOrder"> {}

export const PopoverPositionerPortal = forwardRef<HTMLDivElement, PopoverPositionerPortalProps>(
  ({ id, root, preserveTabOrder, ...otherProps }, ref) => {
    const api = usePopoverContext();

    return (
      <FloatingPortal id={id} root={root} preserveTabOrder={preserveTabOrder}>
        <PopoverDismissibleLayer>
          <Primitive.div
            ref={composeRefs(api.refs.positioner, ref)}
            {...mergeProps(api.positionerProps, otherProps)}
          />
        </PopoverDismissibleLayer>
      </FloatingPortal>
    );
  },
);
PopoverPositionerPortal.displayName = "PopoverPositionerPortal";

/**
 * Holds a Radix FocusScope registration for as long as the popover is open, so parent
 * FocusScopes (Dialog, Drawer, BottomSheet, the Stackflow AppScreen) pause their trap and
 * focus can reach content rendered in a portal.
 *
 * The scope needs no behavior of its own — trapping and the tab loop stay off and both
 * autofocus events are prevented — so all it does is enter Radix's focusScopesStack, which
 * is keyed on mount, not on the element it wraps. Hence this empty hidden element rather
 * than a wrapper around the content: wrapping swaps the element type at the content's
 * position on every open/close, and React responds by remounting the whole popover subtree,
 * throwing away form state and scroll position and handing the exit transition a node that
 * was just built from scratch.
 *
 * Mounting only while open is what lands it on top of the stack — a permanently mounted
 * scope would register at page load, below any Dialog opened later.
 */
const FocusScopeRegistration = () => (
  <FocusScope
    hidden
    trapped={false}
    loop={false}
    onMountAutoFocus={(event) => event.preventDefault()}
    onUnmountAutoFocus={(event) => event.preventDefault()}
  />
);

export interface PopoverContentProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const PopoverContent = forwardRef<HTMLDivElement, PopoverContentProps>((props, ref) => {
  const api = usePopoverContext();
  const contentRef = useRef<HTMLDivElement>(null);

  // Focus is managed, not trapped. Opening moves focus into the content, closing returns it
  // to the trigger, and Tab past the last control leaves for the rest of the page instead of
  // wrapping. The background stays live throughout: nothing is inerted or scroll-locked.
  //
  // `initialFocus` names the content container (tabIndex={-1}) instead of the default first
  // tabbable, so opening never lands on the header close button.
  //
  // Disabled rather than unmounted while closed: FloatingFocusManager sits outside Presence so
  // it survives an `unmountOnExit` unmount, and its return-focus cleanup still runs off the
  // open flag rather than off whether the content happens to be in the DOM.
  //
  // Presence gates the content element alone. It reads `animation-name` off the node it holds
  // to tell whether an exit animation is running, so it has to sit on the element the recipe
  // animates, and that element has to survive the close it is animating.
  return (
    <>
      <FloatingFocusManager
        context={api.floatingContext}
        disabled={!api.open}
        modal={false}
        initialFocus={contentRef}
      >
        <Presence present={api.open} lazyMount={api.lazyMount} unmountOnExit={api.unmountOnExit}>
          <Primitive.div
            ref={composeRefs(contentRef, ref)}
            tabIndex={-1}
            {...mergeProps(api.contentProps, props)}
          />
        </Presence>
      </FloatingFocusManager>
      {api.open && <FocusScopeRegistration />}
    </>
  );
});
PopoverContent.displayName = "PopoverContent";

export interface PopoverTitleProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLHeadingElement> {}

export const PopoverTitle = forwardRef<HTMLHeadingElement, PopoverTitleProps>((props, ref) => {
  const api = usePopoverContext();
  return (
    <Primitive.h2 ref={composeRefs(api.refs.title, ref)} {...mergeProps(api.titleProps, props)} />
  );
});
PopoverTitle.displayName = "PopoverTitle";

export interface PopoverDescriptionProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLParagraphElement> {}

export const PopoverDescription = forwardRef<HTMLParagraphElement, PopoverDescriptionProps>(
  (props, ref) => {
    const api = usePopoverContext();
    return (
      <Primitive.p
        ref={composeRefs(api.refs.description, ref)}
        {...mergeProps(api.descriptionProps, props)}
      />
    );
  },
);
PopoverDescription.displayName = "PopoverDescription";

export interface PopoverArrowProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const PopoverArrow = forwardRef<HTMLDivElement, PopoverArrowProps>((props, ref) => {
  const api = usePopoverContext();
  return (
    <Primitive.div ref={composeRefs(api.refs.arrow, ref)} {...mergeProps(api.arrowProps, props)} />
  );
});
PopoverArrow.displayName = "PopoverArrow";

export interface PopoverCloseButtonProps
  extends PrimitiveProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const PopoverCloseButton = forwardRef<HTMLButtonElement, PopoverCloseButtonProps>(
  (props, ref) => {
    const api = usePopoverContext();
    return <Primitive.button ref={ref} {...mergeProps(api.closeButtonProps, props)} />;
  },
);
