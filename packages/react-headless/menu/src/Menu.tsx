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
import {
  useMenu,
  useMenuGroup,
  type UseMenuGroupReturn,
  type UseMenuItemProps,
  type UseMenuProps,
} from "./useMenu";
import { MenuProvider, useMenuContext } from "./useMenuContext";
import { MenuItemProvider } from "./useMenuItemContext";

const MenuGroupContext = createContext<UseMenuGroupReturn | null>(null);

export interface MenuRootProps extends UseMenuProps {
  children?: React.ReactNode;
}

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
  children,
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

  return <MenuProvider value={api}>{children}</MenuProvider>;
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

export interface MenuTriggerProps
  extends PrimitiveProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {}

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

/**
 * Holds a Radix FocusScope registration for as long as the menu is open, so parent
 * FocusScopes (Dialog, Drawer) pause their trap and focus can reach content
 * rendered in a portal.
 *
 * The scope needs no behavior of its own — trapping and the tab loop stay off and
 * both autofocus events are prevented — so all it does is enter Radix's
 * focusScopesStack, which is keyed on mount, not on the element it wraps. Hence
 * this empty hidden element rather than a wrapper around the content: wrapping
 * swaps the element type at the content's position on every open/close, and React
 * responds by remounting the whole menu subtree, handing the exit transition a
 * scroll container freshly reset to the top.
 *
 * Mounting only while open is what lands it on top of the stack — a permanently
 * mounted scope would register at page load, below any Dialog opened later.
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

export interface MenuContentProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const MenuContent = forwardRef<HTMLDivElement, MenuContentProps>((props, ref) => {
  const { floatingContext, contentProps, open, setOpen, elementsRef, labelsRef } = useMenuContext();

  // FloatingFocusManager: handles position-aware initial focus, return focus,
  // closeOnFocusOut, tab order guards, and useListNavigation coordination.
  return (
    <>
      <FloatingFocusManager context={floatingContext} disabled={!open} modal={false}>
        <FloatingList elementsRef={elementsRef} labelsRef={labelsRef}>
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
        </FloatingList>
      </FloatingFocusManager>
      {open && <FocusScopeRegistration />}
    </>
  );
});
MenuContent.displayName = "MenuContent";

export interface MenuItemProps
  extends UseMenuItemProps,
    PrimitiveProps,
    Omit<React.HTMLAttributes<HTMLDivElement>, "onClick"> {}

export const MenuItem = forwardRef<HTMLDivElement, MenuItemProps>(
  ({ disabled, typeaheadLabel, onClick, ...restProps }, ref) => {
    const { getItemProps } = useMenuContext();
    const { ref: listRef, index } = useListItem({ label: typeaheadLabel });
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
  const group = useMenuGroup();

  return (
    <MenuGroupContext.Provider value={group}>
      <Primitive.div ref={ref} {...mergeProps(group.rootProps, props)} />
    </MenuGroupContext.Provider>
  );
});
MenuGroup.displayName = "MenuGroup";

export interface MenuGroupLabelProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const MenuGroupLabel = forwardRef<HTMLDivElement, MenuGroupLabelProps>((props, ref) => {
  const group = React.useContext(MenuGroupContext);
  if (!group) throw new Error("MenuGroupLabel must be used within a MenuGroup");

  // Compose the group's label ref so the group advertises aria-labelledby only
  // while this label is actually rendered (see useMenuGroup).
  return (
    <Primitive.div
      ref={composeRefs(group.refs.label, ref)}
      {...mergeProps(group.labelProps, props)}
    />
  );
});
MenuGroupLabel.displayName = "MenuGroupLabel";
