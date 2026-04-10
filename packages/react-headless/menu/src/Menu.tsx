"use client";

import {
  FloatingFocusManager,
  FloatingList,
  FloatingPortal,
  useListItem,
} from "@floating-ui/react";
import { composeRefs } from "@radix-ui/react-compose-refs";
import { FocusScope } from "@radix-ui/react-focus-scope";
import { DismissibleLayer } from "@seed-design/react-dismissible-layer";
import { mergeProps } from "@seed-design/dom-utils";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import React, { forwardRef, createContext } from "react";
import { useMenu, type UseMenuItemProps, type UseMenuProps } from "./useMenu";
import { MenuProvider, useMenuContext } from "./useMenuContext";
import { MenuItemProvider } from "./useMenuItemContext";

const MenuGroupLabelIdContext = createContext<string | null>(null);

export interface MenuRootProps
  extends UseMenuProps,
    PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const MenuRoot = ({
  open,
  defaultOpen,
  onOpenChange,
  disabled,
  placement,
  gutter,
  overflowPadding,
  strategy,
  matchReferenceWidth,

  ...props
}: MenuRootProps) => {
  const api = useMenu({
    open,
    defaultOpen,
    onOpenChange,
    disabled,
    placement,
    gutter,
    overflowPadding,
    strategy,
    matchReferenceWidth,
  });

  return <MenuProvider value={api} {...props} />;
};

export interface MenuAnchorProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const MenuAnchor = forwardRef<HTMLDivElement, MenuAnchorProps>((props, ref) => {
  const api = useMenuContext();

  return (
    <Primitive.div
      ref={composeRefs(api.refs.anchor, ref)}
      {...mergeProps(api.anchorProps, props)}
    />
  );
});
MenuAnchor.displayName = "MenuAnchor";

export interface MenuTriggerProps extends PrimitiveProps, React.HTMLAttributes<HTMLButtonElement> {}

export const MenuTrigger = forwardRef<HTMLButtonElement, MenuTriggerProps>((props, ref) => {
  const api = useMenuContext();

  return (
    <Primitive.button
      ref={composeRefs(api.refs.trigger, ref)}
      {...mergeProps(api.triggerProps, props)}
    />
  );
});
MenuTrigger.displayName = "MenuTrigger";

export interface MenuPositionerProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {
  /**
   * The container element to render the portal into.
   * @default document.body
   */
  container?: React.RefObject<HTMLElement | null>;
}

export const MenuPositioner = forwardRef<HTMLDivElement, MenuPositionerProps>(
  ({ container, ...props }, ref) => {
    const api = useMenuContext();

    // FloatingPortal (not a generic portal) so that FloatingFocusManager
    // detects the portal context and renders focus-guard sentinels.
    return (
      <FloatingPortal root={container ?? undefined}>
        <Primitive.div
          ref={composeRefs(api.refs.positioner, ref)}
          {...mergeProps(api.positionerProps, props)}
        />
      </FloatingPortal>
    );
  },
);
MenuPositioner.displayName = "MenuPositioner";

export interface MenuContentProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const MenuContent = forwardRef<HTMLDivElement, MenuContentProps>((props, ref) => {
  const { floatingContext, contentProps, open, setOpen, elementsRef, labelsRef } = useMenuContext();

  const content = (
    <DismissibleLayer
      enabled={open}
      pressBehavior="drag"
      onEscapeKeyDown={(event) => {
        setOpen(false, { reason: "escapeKeyDown", event });
      }}
      onPressOutside={(event) => {
        setOpen(false, { reason: "interactOutside", event });
      }}
      onCascadeDismiss={({ dismissedParent }) => {
        setOpen(false, { reason: "cascadeDismiss", dismissedParent });
      }}
      onFocusOutside={() => {
        // focus trapping is handled by FloatingFocusManager — nothing to do here
      }}
      exclude={(target) => {
        const reference = floatingContext.refs.reference.current;
        if (!(reference instanceof HTMLElement)) return false;

        return reference.contains(target);
      }}
    >
      <Primitive.div ref={ref} {...mergeProps(contentProps, props)} />
    </DismissibleLayer>
  );

  // FloatingFocusManager: handles position-aware initial focus, return focus,
  // closeOnFocusOut, tab order guards, and useListNavigation coordination.
  //
  // FocusScope: participates in Radix's focusScopesStack so that parent
  // FocusScopes (e.g. Dialog, Drawer) are automatically paused while this
  // Menu is open. Without this, focus cannot leave a trapped parent scope
  // to reach Menu content rendered in a Portal.
  //
  // FocusScope is conditionally rendered (only when open) because Menu
  // content is always in the DOM (hidden via data-hidden). If FocusScope
  // were always mounted, it would register in the stack at page load —
  // before any Dialog — and could never re-register above a Dialog that
  // mounts later. Mounting only when open ensures it lands at the top of
  // the stack, pausing the parent scope.
  return (
    <FloatingFocusManager context={floatingContext} disabled={!open} modal={false}>
      <FloatingList elementsRef={elementsRef} labelsRef={labelsRef}>
        {open ? (
          <FocusScope
            asChild
            trapped={false}
            loop={false}
            onMountAutoFocus={(e) => e.preventDefault()}
            onUnmountAutoFocus={(e) => e.preventDefault()}
          >
            {content}
          </FocusScope>
        ) : (
          content
        )}
      </FloatingList>
    </FloatingFocusManager>
  );
});
MenuContent.displayName = "MenuContent";

export interface MenuItemProps
  extends UseMenuItemProps,
    PrimitiveProps,
    Omit<React.HTMLAttributes<HTMLDivElement>, "onClick"> {}

export const MenuItem = forwardRef<HTMLDivElement, MenuItemProps>(
  ({ disabled, label, onClick, ...restProps }, ref) => {
    const { getItemProps } = useMenuContext();
    const { ref: listRef, index } = useListItem({ label });
    const api = getItemProps({ disabled, onClick }, index);

    return (
      <MenuItemProvider value={api}>
        <Primitive.div ref={composeRefs(listRef, ref)} {...mergeProps(api.rootProps, restProps)} />
      </MenuItemProvider>
    );
  },
);
MenuItem.displayName = "MenuItem";

export interface MenuGroupProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const MenuGroup = forwardRef<HTMLDivElement, MenuGroupProps>((props, ref) => {
  const { getGroupProps } = useMenuContext();
  const { labelId, rootProps } = getGroupProps();

  return (
    <MenuGroupLabelIdContext.Provider value={labelId}>
      <Primitive.div ref={ref} {...mergeProps(rootProps, props)} />
    </MenuGroupLabelIdContext.Provider>
  );
});
MenuGroup.displayName = "MenuGroup";

export interface MenuGroupLabelProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const MenuGroupLabel = forwardRef<HTMLDivElement, MenuGroupLabelProps>((props, ref) => {
  const { getGroupLabelProps } = useMenuContext();
  const labelId = React.useContext(MenuGroupLabelIdContext);
  if (!labelId) throw new Error("MenuGroupLabel must be used within a MenuGroup");

  return <Primitive.div ref={ref} {...mergeProps(getGroupLabelProps(labelId), props)} />;
});
MenuGroupLabel.displayName = "MenuGroupLabel";
