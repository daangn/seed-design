import * as React from "@lynx-js/react";
import { getRectByRef } from "@lynx-js/lynx-ui-common";
import type { BaseEvent, NodesRef } from "@lynx-js/types";
import clsx from "clsx";

import { menu, type MenuVariantProps } from "@seed-design/lynx-css/recipes/menu";
import { menuItem, type MenuItemVariantProps } from "@seed-design/lynx-css/recipes/menu-item";
import { menu as menuVars } from "@seed-design/lynx-css/vars/component";

import { useControllableState } from "../../hooks/useControllableState";
import { usePressTap } from "../../hooks/usePressTap";
import type {
  LynxAccessibilityProps,
  LynxPressableProps,
  LynxStyledElementProps,
  LynxTextRef,
  LynxViewProps,
  LynxViewRef,
} from "../../types";
import { toArray } from "../../utils/children";
import { IconSlotProvider, PrefixIcon, SuffixIcon } from "../Icon/Icon";
import { positionMenu, type MenuPlacement, type MenuPosition, type MenuRect } from "./positioning";

type MenuClassNames = {
  positioner: string;
  backdrop: string;
  content: string;
  scrollArea: string;
  scrollContent: string;
  group: string;
  groupLabel: string;
  separator: string;
};
type MenuItemClassNames = {
  root: string;
  pressedOverlay: string;
  body: string;
  label: string;
  description: string;
  prefixIcon: string;
  suffixIcon: string;
};
type MenuPublicVariantProps = Omit<MenuVariantProps, "open" | "positioned" | "size"> & {
  size?: "small" | "medium" | "responsive";
};
type MenuItemPublicVariantProps = Omit<MenuItemVariantProps, "size" | "disabled" | "pressed">;
type NativeTapHandler = NonNullable<LynxViewProps["bindtap"]>;
type NativeTransitionHandler = NonNullable<LynxViewProps["bindtransitionend"]>;
type NativeLayoutHandler = NonNullable<LynxViewProps["bindlayoutchange"]>;
type MenuTriggerHandlers = Pick<LynxViewProps, "bindtap" | "main-thread:bindtap">;

const menuMaxHeight = Number.parseFloat(menuVars.base.enabled.root.maxHeight);

export type MenuOpenChangeReason = "trigger" | "interactOutside" | "itemClick" | "dismiss";

export interface MenuOpenChangeDetails {
  reason: MenuOpenChangeReason;
  event: BaseEvent;
}

interface MenuContextValue {
  open: boolean;
  mounted: boolean;
  openEpoch: number;
  disabled: boolean;
  size: "small" | "medium";
  placement: MenuPlacement;
  gutter: number;
  overflowPadding: number;
  matchReferenceWidth: boolean;
  isOpenRef: React.MutableRefObject<boolean>;
  openEpochRef: React.MutableRefObject<number>;
  anchorRef: React.MutableRefObject<NodesRef | null>;
  triggerRef: React.MutableRefObject<NodesRef | null>;
  triggerHandlers: MenuTriggerHandlers;
  setTriggerHandlers: (handlers: MenuTriggerHandlers) => void;
  classes: MenuClassNames;
  positioned: boolean;
  setPositioned: (positioned: boolean) => void;
  requestOpen: (open: boolean, details: MenuOpenChangeDetails) => void;
  finishClose: (immediate?: boolean) => void;
}

const MenuContext = React.createContext<MenuContextValue | null>(null);
const MenuItemClassNamesContext = React.createContext<MenuItemClassNames | null>(null);
const MenuGroupPositionContext = React.createContext({ isFirst: true });

function useMenuContext(consumer: string): MenuContextValue {
  const context = React.useContext(MenuContext);
  if (!context) throw new Error(`<${consumer}/> must be rendered inside <MenuRoot/>.`);
  return context;
}

function useMenuItemClassNames(consumer: string): MenuItemClassNames {
  const context = React.useContext(MenuItemClassNamesContext);
  if (!context) throw new Error(`<${consumer}/> must be rendered inside <MenuItem/>.`);
  return context;
}

function mergeNodeRef(forwardedRef: React.ForwardedRef<unknown>, node: NodesRef | null) {
  if (typeof forwardedRef === "function") {
    forwardedRef(node);
  } else if (forwardedRef) {
    forwardedRef.current = node;
  }
}

function getScreenRect(): MenuRect | null {
  const systemInfo = typeof SystemInfo === "undefined" ? undefined : SystemInfo;
  const pixelWidth = systemInfo?.pixelWidth;
  const pixelHeight = systemInfo?.pixelHeight;
  const pixelRatio = systemInfo?.pixelRatio;
  if (
    typeof pixelWidth !== "number" ||
    typeof pixelHeight !== "number" ||
    typeof pixelRatio !== "number" ||
    pixelWidth <= 0 ||
    pixelHeight <= 0 ||
    pixelRatio <= 0
  ) {
    return null;
  }

  const width = pixelWidth / pixelRatio;
  const height = pixelHeight / pixelRatio;
  return { left: 0, top: 0, right: width, bottom: height, width, height };
}

function getRootRect() {
  "background only";
  return getRectByRef({ current: lynx.createSelectorQuery().selectRoot() }, true);
}

function toPixel(value: number) {
  return `${value}px`;
}

function getLayoutSize(
  event: Parameters<NativeLayoutHandler>[0],
): { width: number; height: number } | null {
  const width = event.detail?.width ?? event.params?.width;
  const height = event.detail?.height ?? event.params?.height;
  if (!Number.isFinite(width) || !Number.isFinite(height)) return null;
  return { width: Math.max(0, width), height: Math.max(0, height) };
}

function hasExitTransition(event: Parameters<NativeTransitionHandler>[0]): boolean {
  if (event.target.uid !== event.currentTarget.uid) return false;
  return (
    event.params.animation_type === "transition-opacity" ||
    event.params.animation_name === "opacity"
  );
}

////////////////////////////////////////////////////////////////////////////////////

export interface MenuRootProps extends MenuPublicVariantProps, LynxStyledElementProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean, details: MenuOpenChangeDetails) => void;
  disabled?: boolean;
  placement?: MenuPlacement;
  gutter?: number;
  overflowPadding?: number;
  matchReferenceWidth?: boolean;
}

/**
 * @platform Lynx
 *
 * Lynx menu supports native tap and accessibility semantics. It does not expose
 * web DOM focus, keyboard navigation, typeahead, `asChild`, or nested submenus.
 */
export const MenuRoot = React.forwardRef<unknown, MenuRootProps>((props, ref) => {
  const { size: sizeProp = "medium", open: openProp, ...restProps } = props;
  const [variantProps, otherProps] = menu.splitVariantProps({
    ...restProps,
    size: sizeProp === "responsive" ? undefined : sizeProp,
  });
  const {
    children,
    className,
    defaultOpen = false,
    onOpenChange,
    disabled = false,
    placement = "bottom",
    gutter = 8,
    overflowPadding = 8,
    matchReferenceWidth = false,
    ...nativeProps
  } = otherProps;
  const [open, setOpen] = useControllableState({ value: openProp, defaultValue: defaultOpen });
  const [mounted, setMounted] = React.useState(open);
  const [positionedEpoch, setPositionedEpoch] = React.useState<number | null>(null);
  const isOpenRef = React.useRef(open);
  const openEpochRef = React.useRef(0);
  if (open && !isOpenRef.current) openEpochRef.current++;
  isOpenRef.current = open;
  const openEpoch = openEpochRef.current;
  const positioned = positionedEpoch === openEpoch;
  const setPositioned = React.useCallback(
    (nextPositioned: boolean) => setPositionedEpoch(nextPositioned ? openEpochRef.current : null),
    [],
  );
  const [triggerHandlers, setTriggerHandlers] = React.useState<MenuTriggerHandlers>({});
  const anchorRef = React.useRef<NodesRef | null>(null);
  const triggerRef = React.useRef<NodesRef | null>(null);

  React.useEffect(() => {
    "background only";
    if (open) {
      setMounted(true);
      return;
    }
    if (!positioned) setMounted(false);
  }, [open, positioned]);

  const requestOpen = React.useCallback(
    (nextOpen: boolean, details: MenuOpenChangeDetails) => {
      "background only";
      if (disabled && nextOpen) return;
      if (nextOpen === open) return;
      setOpen(nextOpen);
      onOpenChange?.(nextOpen, details);
    },
    [disabled, onOpenChange, open, setOpen],
  );

  const finishClose = React.useCallback((immediate = false) => {
    "background only";
    if (immediate || !isOpenRef.current) {
      setMounted(false);
      setPositionedEpoch(null);
    }
  }, []);

  const screenRect = getScreenRect();
  const resolvedSize =
    sizeProp === "responsive" && screenRect?.width != null && screenRect.width >= 1280
      ? "small"
      : (variantProps.size ?? "medium");
  const classes = menu({ size: resolvedSize, open, positioned });
  const contextValue = React.useMemo<MenuContextValue>(
    () => ({
      open,
      mounted,
      openEpoch,
      disabled,
      size: resolvedSize,
      placement,
      gutter,
      overflowPadding,
      matchReferenceWidth,
      isOpenRef,
      openEpochRef,
      anchorRef,
      triggerRef,
      triggerHandlers,
      setTriggerHandlers,
      classes,
      positioned,
      setPositioned,
      requestOpen,
      finishClose,
    }),
    [
      classes,
      disabled,
      finishClose,
      gutter,
      matchReferenceWidth,
      mounted,
      openEpoch,
      setPositioned,
      openEpochRef,
      triggerHandlers,
      resolvedSize,
      open,
      overflowPadding,
      placement,
      positioned,
      requestOpen,
    ],
  );

  return (
    <MenuContext.Provider value={contextValue}>
      <view {...(ref ? { ref: ref as LynxViewRef } : {})} className={className} {...nativeProps}>
        {children}
      </view>
    </MenuContext.Provider>
  );
});
MenuRoot.displayName = "MenuRoot";

////////////////////////////////////////////////////////////////////////////////////

export interface MenuAnchorProps extends LynxStyledElementProps {}

export const MenuAnchor = React.forwardRef<unknown, MenuAnchorProps>((props, ref) => {
  const { children, className, ...nativeProps } = props;
  const context = useMenuContext("MenuAnchor");
  const handleRef = React.useCallback(
    (node: NodesRef | null) => {
      context.anchorRef.current = node;
      mergeNodeRef(ref, node);
    },
    [context.anchorRef, ref],
  );

  return (
    <view ref={handleRef as LynxViewRef} className={className} {...nativeProps}>
      {children}
    </view>
  );
});
MenuAnchor.displayName = "MenuAnchor";

////////////////////////////////////////////////////////////////////////////////////

export interface MenuTriggerProps
  extends LynxStyledElementProps,
    LynxPressableProps,
    LynxAccessibilityProps {
  disabled?: boolean;
}

export const MenuTrigger = React.forwardRef<unknown, MenuTriggerProps>((props, ref) => {
  const {
    children,
    className,
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
    disabled: disabledProp = false,
    "accessibility-element": accessibilityElement = true,
    "accessibility-label": accessibilityLabel,
    "accessibility-traits": accessibilityTraits,
    ...nativeProps
  } = props;
  const context = useMenuContext("MenuTrigger");
  const disabled = context.disabled || disabledProp;
  const handleTap = React.useCallback<NativeTapHandler>(
    (event, instance) => {
      "background only";
      context.requestOpen(!context.open, { reason: "trigger", event });
      bindtap?.(event, instance);
    },
    [bindtap, context],
  );
  const { bindtap: proxyBindtap, ...pressHandlers } = usePressTap({
    disabled,
    onTap: handleTap,
    mainThreadOnTap: mainThreadBindtap,
  });
  const mainThreadProxyBindtap = pressHandlers["main-thread:bindtap"];
  React.useEffect(() => {
    "background only";
    context.setTriggerHandlers({
      bindtap: proxyBindtap,
      "main-thread:bindtap": mainThreadProxyBindtap,
    });
    return () => context.setTriggerHandlers({});
  }, [context.setTriggerHandlers, mainThreadProxyBindtap, proxyBindtap]);
  const handleRef = React.useCallback(
    (node: NodesRef | null) => {
      context.triggerRef.current = node;
      mergeNodeRef(ref, node);
    },
    [context.triggerRef, ref],
  );

  return (
    <view
      ref={handleRef as LynxViewRef}
      className={className}
      accessibility-element={accessibilityElement}
      accessibility-label={accessibilityLabel}
      accessibility-role-description="button"
      accessibility-value={context.open ? "expanded" : "collapsed"}
      accessibility-traits={disabled ? "disabled" : (accessibilityTraits ?? "button")}
      {...nativeProps}
      {...pressHandlers}
      bindtap={proxyBindtap}
    >
      {children}
    </view>
  );
});
MenuTrigger.displayName = "MenuTrigger";

////////////////////////////////////////////////////////////////////////////////////

export interface MenuContentProps extends LynxStyledElementProps {}

export const MenuContent = React.forwardRef<unknown, MenuContentProps>((props, ref) => {
  const { children, className, style, ...nativeProps } = props;
  const context = useMenuContext("MenuContent");
  const measurementVersionRef = React.useRef(0);
  const intrinsicWidthRef = React.useRef<number | null>(null);
  const [overlayNode, setOverlayNode] = React.useState<NodesRef | null>(null);
  const measurementConfigRef = React.useRef(0);
  const [intrinsicSize, setIntrinsicSize] = React.useState<{
    width: number;
    height: number;
    epoch: number;
    config: number;
  } | null>(null);
  const [position, setPosition] = React.useState<MenuPosition | null>(null);
  const [overlayRect, setOverlayRect] = React.useState<MenuRect | null>(null);
  const [triggerRect, setTriggerRect] = React.useState<MenuRect | null>(null);

  const measurePosition = React.useCallback(async () => {
    "background only";
    const referenceNode = context.anchorRef.current ?? context.triggerRef.current;
    const triggerNode = context.triggerRef.current;
    const openEpoch = context.openEpoch;
    if (
      !context.open ||
      !referenceNode ||
      !overlayNode ||
      !intrinsicSize ||
      intrinsicSize.epoch !== openEpoch ||
      intrinsicSize.config !== measurementConfigRef.current
    ) {
      return;
    }
    const version = ++measurementVersionRef.current;
    try {
      const [reference, boundary, overlay, trigger] = await Promise.all([
        getRectByRef({ current: referenceNode }, true),
        getRootRect(),
        getRectByRef({ current: overlayNode }, true),
        triggerNode ? getRectByRef({ current: triggerNode }, true) : Promise.resolve(null),
      ]);
      if (
        version !== measurementVersionRef.current ||
        !context.isOpenRef.current ||
        openEpoch !== context.openEpochRef.current
      ) {
        return;
      }
      const width = context.matchReferenceWidth
        ? reference.width
        : (intrinsicWidthRef.current ?? intrinsicSize.width);
      const nextPosition = await positionMenu({
        reference,
        boundary,
        width,
        height: Math.min(intrinsicSize.height, menuMaxHeight),
        placement: context.placement,
        gutter: context.gutter,
        overflowPadding: context.overflowPadding,
      });
      if (
        version !== measurementVersionRef.current ||
        !context.isOpenRef.current ||
        openEpoch !== context.openEpochRef.current
      ) {
        return;
      }
      setPosition((previous) => {
        if (
          previous?.left === nextPosition.left &&
          previous.top === nextPosition.top &&
          previous.width === nextPosition.width &&
          previous.height === nextPosition.height &&
          previous.placement === nextPosition.placement
        ) {
          return previous;
        }
        return nextPosition;
      });
      setOverlayRect(overlay);
      setTriggerRect(trigger);
      context.setPositioned(true);
    } catch {
      // A ref can disappear while the native query is in flight. Keep this close hidden.
    }
  }, [context, intrinsicSize, overlayNode]);

  React.useEffect(() => {
    "background only";
    measurementVersionRef.current++;
    setPosition(null);
    setOverlayRect(null);
    setTriggerRect(null);
    setIntrinsicSize((current) => (current ? { ...current, epoch: context.openEpoch } : current));
  }, [context.openEpoch]);

  React.useEffect(() => {
    "background only";
    measurementVersionRef.current++;
    intrinsicWidthRef.current = null;
    measurementConfigRef.current++;
    setIntrinsicSize((current) =>
      current ? { ...current, config: measurementConfigRef.current } : current,
    );
    setPosition(null);
    setOverlayRect(null);
    setTriggerRect(null);
    context.setPositioned(false);
  }, [className, context.setPositioned, context.size, style]);

  React.useEffect(() => {
    "background only";
    if (context.open) void measurePosition();
  }, [context.open, measurePosition]);

  const handleShowOverlay = React.useCallback(() => {
    "background only";
    void measurePosition();
  }, [measurePosition]);

  const handleRef = React.useCallback(
    (node: NodesRef | null) => {
      measurementVersionRef.current++;
      mergeNodeRef(ref, node);
    },
    [ref],
  );
  const handlePositionerRef = React.useCallback((node: NodesRef | null) => {
    setOverlayNode(node);
  }, []);
  const handleIntrinsicLayoutChange = React.useCallback<NativeLayoutHandler>(
    (event) => {
      "background only";
      const nextSize = getLayoutSize(event);
      if (!nextSize || !context.open) return;
      if (intrinsicWidthRef.current === null) intrinsicWidthRef.current = nextSize.width;
      setIntrinsicSize((current) => {
        const nextWidth = intrinsicWidthRef.current ?? nextSize.width;
        if (
          current?.width === nextWidth &&
          current.height === nextSize.height &&
          current.epoch === context.openEpoch &&
          current.config === measurementConfigRef.current
        ) {
          return current;
        }
        return {
          width: nextWidth,
          height: nextSize.height,
          epoch: context.openEpoch,
          config: measurementConfigRef.current,
        };
      });
    },
    [context.open, context.openEpoch],
  );
  const handleTransitionEnd = React.useCallback<NativeTransitionHandler>(
    (event) => {
      "background only";
      if (!context.open && hasExitTransition(event)) context.finishClose();
    },
    [context],
  );
  const handleBackdropTap = React.useCallback<NativeTapHandler>(
    (event) => {
      "background only";
      context.requestOpen(false, { reason: "interactOutside", event });
    },
    [context],
  );
  const handleNativeDismiss = React.useCallback(
    (event: BaseEvent) => {
      "background only";
      context.requestOpen(false, { reason: "dismiss", event });
      context.finishClose(true);
    },
    [context],
  );
  const handleRequestClose = React.useCallback(
    (event: BaseEvent) => {
      "background only";
      context.requestOpen(false, { reason: "dismiss", event });
    },
    [context],
  );

  if (!context.mounted) return null;

  const geometryStyle =
    position && overlayRect
      ? {
          left: toPixel(position.left - overlayRect.left),
          top: toPixel(position.top - overlayRect.top),
          width: toPixel(position.width),
          transformOrigin: position.transformOrigin,
        }
      : undefined;
  const scrollStyle = position ? { height: toPixel(position.height) } : undefined;
  const triggerProxyStyle =
    triggerRect && overlayRect
      ? {
          left: toPixel(triggerRect.left - overlayRect.left),
          top: toPixel(triggerRect.top - overlayRect.top),
          width: toPixel(triggerRect.width),
          height: toPixel(triggerRect.height),
        }
      : undefined;
  const childNodes = toArray(children);

  return (
    <overlay
      visible
      style={{ position: "fixed" }}
      binddismissoverlay={handleNativeDismiss}
      bindshowoverlay={handleShowOverlay}
      bindrequestclose={handleRequestClose}
    >
      <view ref={handlePositionerRef as LynxViewRef} className={context.classes.positioner}>
        <view className={context.classes.backdrop} bindtap={handleBackdropTap} />
        {triggerProxyStyle && (
          <view
            style={{ position: "absolute", ...triggerProxyStyle }}
            bindtap={context.triggerHandlers.bindtap}
            main-thread:bindtap={context.triggerHandlers["main-thread:bindtap"]}
          />
        )}
        <view
          ref={handleRef as LynxViewRef}
          className={clsx(context.classes.content, className)}
          style={{ ...geometryStyle, ...style }}
          bindtransitionend={handleTransitionEnd}
          {...nativeProps}
        >
          <scroll-view
            className={context.classes.scrollArea}
            scroll-orientation="vertical"
            style={scrollStyle}
          >
            <view
              className={context.classes.scrollContent}
              bindlayoutchange={handleIntrinsicLayoutChange}
            >
              {childNodes.map((child, index) => (
                <MenuGroupPositionContext.Provider
                  key={React.isValidElement(child) ? (child.key ?? index) : index}
                  value={{ isFirst: index === 0 }}
                >
                  {child}
                </MenuGroupPositionContext.Provider>
              ))}
            </view>
          </scroll-view>
        </view>
      </view>
    </overlay>
  );
});
MenuContent.displayName = "MenuContent";

////////////////////////////////////////////////////////////////////////////////////

/** The scroll viewport is supplied by `MenuContent`; this slot styles custom scroll content only. */
export interface MenuScrollAreaProps extends LynxStyledElementProps {}

export const MenuScrollArea = React.forwardRef<unknown, MenuScrollAreaProps>((props, ref) => {
  const { children, className, ...nativeProps } = props;
  const classes = useMenuContext("MenuScrollArea").classes;
  return (
    <scroll-view
      {...(ref ? { ref: ref as LynxViewRef } : {})}
      className={clsx(classes.scrollArea, className)}
      scroll-orientation="vertical"
      {...nativeProps}
    >
      <view className={classes.scrollContent}>{children}</view>
    </scroll-view>
  );
});
MenuScrollArea.displayName = "MenuScrollArea";

////////////////////////////////////////////////////////////////////////////////////

export interface MenuGroupProps extends LynxStyledElementProps {}

export const MenuGroup = React.forwardRef<unknown, MenuGroupProps>((props, ref) => {
  const { children, className, ...nativeProps } = props;
  const classes = useMenuContext("MenuGroup").classes;
  const position = React.useContext(MenuGroupPositionContext);
  return (
    <view
      {...(ref ? { ref: ref as LynxViewRef } : {})}
      className={clsx(classes.group, className)}
      {...nativeProps}
    >
      {!position.isFirst ? (
        <view className={classes.separator} accessibility-elements-hidden={true} />
      ) : null}
      {children}
    </view>
  );
});
MenuGroup.displayName = "MenuGroup";

////////////////////////////////////////////////////////////////////////////////////

export interface MenuGroupLabelProps extends LynxStyledElementProps, LynxAccessibilityProps {}

export const MenuGroupLabel = React.forwardRef<unknown, MenuGroupLabelProps>((props, ref) => {
  const {
    children,
    className,
    "accessibility-heading": accessibilityHeading = true,
    ...nativeProps
  } = props;
  const classes = useMenuContext("MenuGroupLabel").classes;
  return (
    <text
      {...(ref ? { ref: ref as LynxTextRef } : {})}
      className={clsx(classes.groupLabel, className)}
      accessibility-heading={accessibilityHeading}
      {...nativeProps}
    >
      {children}
    </text>
  );
});
MenuGroupLabel.displayName = "MenuGroupLabel";

////////////////////////////////////////////////////////////////////////////////////

export interface MenuItemProps
  extends MenuItemPublicVariantProps,
    LynxStyledElementProps,
    LynxPressableProps,
    LynxAccessibilityProps {
  disabled?: boolean;
}

export const MenuItem = React.forwardRef<unknown, MenuItemProps>((props, ref) => {
  const [variantProps, otherProps] = menuItem.splitVariantProps(props);
  const { disabled: disabledProp = false, tone = "neutral" } = variantProps;
  const {
    children,
    className,
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
    "accessibility-element": accessibilityElement = true,
    "accessibility-label": accessibilityLabel,
    "accessibility-traits": accessibilityTraits,
    ...nativeProps
  } = otherProps;
  const context = useMenuContext("MenuItem");
  const disabled = context.disabled || disabledProp;
  const handleTap = React.useCallback<NativeTapHandler>(
    (event, instance) => {
      "background only";
      bindtap?.(event, instance);
      context.requestOpen(false, { reason: "itemClick", event });
    },
    [bindtap, context],
  );
  const { pressed, ...pressHandlers } = usePressTap({
    disabled,
    onTap: handleTap,
    mainThreadOnTap: mainThreadBindtap,
  });
  const classes = menuItem({
    ...variantProps,
    size: context.size,
    tone,
    disabled,
    pressed,
  });
  const iconSlots = React.useMemo(
    () => ({
      classNames: { prefixIcon: classes.prefixIcon, suffixIcon: classes.suffixIcon },
      deps: [classes.prefixIcon, classes.suffixIcon],
    }),
    [classes.prefixIcon, classes.suffixIcon],
  );

  return (
    <MenuItemClassNamesContext.Provider value={classes}>
      <IconSlotProvider value={iconSlots}>
        <view
          {...(ref ? { ref: ref as LynxViewRef } : {})}
          className={clsx(classes.root, className)}
          accessibility-element={accessibilityElement}
          accessibility-label={accessibilityLabel}
          accessibility-role-description="button"
          accessibility-traits={disabled ? "disabled" : (accessibilityTraits ?? "button")}
          {...nativeProps}
          {...pressHandlers}
        >
          <view className={classes.pressedOverlay} accessibility-elements-hidden={true} />
          {children}
        </view>
      </IconSlotProvider>
    </MenuItemClassNamesContext.Provider>
  );
});
MenuItem.displayName = "MenuItem";

////////////////////////////////////////////////////////////////////////////////////

export interface MenuItemBodyProps extends LynxStyledElementProps {}

export const MenuItemBody = React.forwardRef<unknown, MenuItemBodyProps>((props, ref) => {
  const { children, className, ...nativeProps } = props;
  const classes = useMenuItemClassNames("MenuItemBody");
  return (
    <view
      {...(ref ? { ref: ref as LynxViewRef } : {})}
      className={clsx(classes.body, className)}
      {...nativeProps}
    >
      {children}
    </view>
  );
});
MenuItemBody.displayName = "MenuItemBody";

export interface MenuItemLabelProps extends LynxStyledElementProps {}

export const MenuItemLabel = React.forwardRef<unknown, MenuItemLabelProps>((props, ref) => {
  const { children, className, ...nativeProps } = props;
  const classes = useMenuItemClassNames("MenuItemLabel");
  return (
    <text
      {...(ref ? { ref: ref as LynxTextRef } : {})}
      className={clsx(classes.label, className)}
      {...nativeProps}
    >
      {children}
    </text>
  );
});
MenuItemLabel.displayName = "MenuItemLabel";

export interface MenuItemDescriptionProps extends LynxStyledElementProps {}

export const MenuItemDescription = React.forwardRef<unknown, MenuItemDescriptionProps>(
  (props, ref) => {
    const { children, className, ...nativeProps } = props;
    const classes = useMenuItemClassNames("MenuItemDescription");
    return (
      <text
        {...(ref ? { ref: ref as LynxTextRef } : {})}
        className={clsx(classes.description, className)}
        {...nativeProps}
      >
        {children}
      </text>
    );
  },
);
MenuItemDescription.displayName = "MenuItemDescription";

export { PrefixIcon as MenuPrefixIcon, SuffixIcon as MenuSuffixIcon };
export type { MenuPlacement };
