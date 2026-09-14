import * as React from "@lynx-js/react";
import { isValidElement } from "@lynx-js/react";
import { getRectByRef } from "@lynx-js/lynx-ui-common";
import type { BaseEvent, NodesRef } from "@lynx-js/types";
import clsx from "clsx";

import { select, type SelectVariantProps } from "@seed-design/lynx-css/recipes/select";
import {
  selectTrigger,
  type SelectTriggerVariantProps,
} from "@seed-design/lynx-css/recipes/select-trigger";
import { selectItem, type SelectItemVariantProps } from "@seed-design/lynx-css/recipes/select-item";
import { select as selectVars } from "@seed-design/lynx-css/vars/component";

import { useControllableState } from "../../hooks/useControllableState";
import { usePressTap } from "../../hooks/usePressTap";
import type {
  LynxAccessibilityProps,
  LynxPressableProps,
  LynxIconElementProps,
  LynxStyledElementProps,
  LynxTextRef,
  LynxViewProps,
  LynxViewRef,
} from "../../types";
import { toArray } from "../../utils/children";
import { useFieldContext } from "../Field/context";
import { InternalIcon, type InternalIconProps } from "../Icon/Icon";
import {
  computePosition,
  type Placement as SelectPlacement,
  type Position as SelectPosition,
  type Rect as SelectRect,
} from "../private/Positioning";

const EMPTY_VALUE: string[] = [];
// `$dimension.x2` is the Rootage Select spacing token. Generated component vars retain
// it as CSS `var()` for styling, but floating-point collision math needs its numeric 8px value.
const selectGutter = 8;
const selectOverflowPadding = 8;
const selectMaxHeight = Number.parseFloat(selectVars.base.enabled.root.maxHeight);
// This protects placement near the screen edge; it does not impose a minimum list viewport.
const selectMinimumAvailableHeight = 200;
let nextSelectScrollAreaId = 0;

interface SelectClassNames {
  positioner: string;
  backdrop: string;
  content: string;
  scrollArea: string;
  scrollContent: string;
  group: string;
  groupLabel: string;
  separator: string;
}

interface SelectItemClassNames {
  root: string;
  pressedOverlay: string;
  body: string;
  label: string;
  description: string;
  prefixIcon: string;
  indicator: string;
}
type NativeTapHandler = NonNullable<LynxViewProps["bindtap"]>;
type NativeTransitionHandler = NonNullable<LynxViewProps["bindtransitionend"]>;
type NativeLayoutHandler = NonNullable<LynxViewProps["bindlayoutchange"]>;
type SelectTriggerHandlers = Pick<LynxViewProps, "bindtap" | "main-thread:bindtap">;

type SelectPublicVariantProps = Omit<SelectVariantProps, "size" | "open" | "positioned"> & {
  size?: "large" | "medium" | "responsive";
};
type SelectTriggerPublicVariantProps = Omit<
  SelectTriggerVariantProps,
  "size" | "open" | "pressed" | "disabled" | "readOnly" | "invalid"
>;
type SelectItemPublicVariantProps = Omit<
  SelectItemVariantProps,
  "size" | "selected" | "pressed" | "disabled"
>;

export type SelectOpenChangeReason = "trigger" | "interactOutside" | "itemSelect" | "dismiss";

export interface SelectOpenChangeDetails {
  reason: SelectOpenChangeReason;
  event: BaseEvent;
}

export interface SelectSelectedItem {
  value: string;
  label: React.ReactNode;
  textValue: string;
  prefixIcon?: React.ReactNode;
  resolved: boolean;
}

interface SelectOptionEntry {
  label: React.ReactNode;
  textValue: string;
  prefixIcon?: React.ReactNode;
  node: NodesRef | null;
}

interface RegisteredSelectItem extends SelectSelectedItem {
  node: NodesRef | null;
}

interface SelectContextValue {
  value: string[];
  selectedItems: SelectSelectedItem[];
  selectedItem: RegisteredSelectItem | undefined;
  displayValue: React.ReactNode;
  showPlaceholder: boolean;
  multiple: boolean;
  open: boolean;
  mounted: boolean;
  openEpoch: number;
  disabled: boolean;
  readOnly: boolean;
  invalid: boolean;
  required: boolean;
  size: "large" | "medium";
  placement: SelectPlacement;
  gutter: number;
  overflowPadding: number;
  isOpenRef: React.MutableRefObject<boolean>;
  openEpochRef: React.MutableRefObject<number>;
  triggerRef: React.MutableRefObject<NodesRef | null>;
  triggerHandlers: SelectTriggerHandlers;
  setTriggerHandlers: (handlers: SelectTriggerHandlers) => void;
  classes: SelectClassNames;
  positioned: boolean;
  setPositioned: (positioned: boolean) => void;
  requestOpen: (open: boolean, details: SelectOpenChangeDetails) => void;
  finishClose: (immediate?: boolean) => void;
  selectValue: (value: string, event: BaseEvent) => void;
  registerOption: (value: string, entry: SelectOptionEntry) => void;
  unregisterOption: (value: string) => void;
}

interface SelectItemContextValue {
  label: React.ReactNode;
  prefixIcon?: React.ReactNode;
  selected: boolean;
  disabled: boolean;
  pressed: boolean;
  classes: SelectItemClassNames;
}

const SelectContext = React.createContext<SelectContextValue | null>(null);
const SelectItemContext = React.createContext<SelectItemContextValue | null>(null);
const SelectGroupPositionContext = React.createContext({ isFirst: true });

function useSelectContext(consumer: string): SelectContextValue {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error(`<${consumer}/> must be rendered inside <SelectRoot/>.`);
  return context;
}

function useSelectItemContext(consumer: string): SelectItemContextValue {
  const context = React.useContext(SelectItemContext);
  if (!context) throw new Error(`<${consumer}/> must be rendered inside <SelectItem/>.`);
  return context;
}

function mergeNodeRef(forwardedRef: React.ForwardedRef<unknown>, node: NodesRef | null) {
  if (typeof forwardedRef === "function") {
    forwardedRef(node);
  } else if (forwardedRef) {
    forwardedRef.current = node;
  }
}

function getScreenRect(): SelectRect | null {
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

function hasExitTransition(event: Parameters<NativeTransitionHandler>[0]): boolean {
  if (event.target.uid !== event.currentTarget.uid) return false;
  return (
    event.params.animation_type === "transition-opacity" ||
    event.params.animation_name === "opacity"
  );
}

function isSameValue(a: string[], b: string[]) {
  return a.length === b.length && a.every((entry, index) => entry === b[index]);
}

function renderTextContent(
  className: string,
  value: React.ReactNode,
  ref: React.ForwardedRef<unknown>,
  nativeProps: Omit<LynxStyledElementProps, "children" | "className">,
) {
  if (typeof value === "string" || typeof value === "number") {
    return (
      <text {...(ref ? { ref: ref as LynxTextRef } : {})} className={className} {...nativeProps}>
        {value}
      </text>
    );
  }

  return (
    <view {...(ref ? { ref: ref as LynxViewRef } : {})} className={className} {...nativeProps}>
      {value}
    </view>
  );
}

////////////////////////////////////////////////////////////////////////////////////

/**
 * @platform Lynx
 *
 * Web-only DOM APIs are intentionally omitted: `asChild`, hidden native select/name/form
 * submission, DOM focus/typeahead/keyboard navigation, and ARIA ids all rely on a browser DOM.
 * Lynx uses native tap, overlay dismissal, `accessibility-*` attributes, and app-owned state.
 */
export interface SelectRootProps
  extends SelectPublicVariantProps,
    SelectTriggerPublicVariantProps,
    SelectItemPublicVariantProps,
    LynxStyledElementProps {
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  multiple?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean, details: SelectOpenChangeDetails) => void;
  disabled?: boolean;
  readOnly?: boolean;
  invalid?: boolean;
  required?: boolean;
  placement?: SelectPlacement;
  gutter?: number;
  overflowPadding?: number;
  formatValue?: (items: SelectSelectedItem[]) => React.ReactNode;
}

export const SelectRoot = React.forwardRef<unknown, SelectRootProps>((props, ref) => {
  const {
    children,
    className,
    value: valueProp,
    defaultValue = EMPTY_VALUE,
    onValueChange,
    multiple = false,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    disabled: disabledProp,
    readOnly: readOnlyProp,
    invalid: invalidProp,
    required: requiredProp,
    size: sizeProp = "large",
    placement = "bottom",
    gutter = selectGutter,
    overflowPadding = selectOverflowPadding,
    formatValue,
    ...nativeProps
  } = props;
  const fieldContext = useFieldContext({ strict: false });
  const disabled = disabledProp ?? fieldContext?.disabled ?? false;
  const readOnly = readOnlyProp ?? fieldContext?.readOnly ?? false;
  const invalid = invalidProp ?? fieldContext?.invalid ?? false;
  const required = requiredProp ?? fieldContext?.required ?? false;
  const [value, setValueState] = useControllableState({
    value: valueProp,
    defaultValue,
    onChange: onValueChange,
  });
  const [open, setOpenState] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
  });
  const [optionRegistry, setOptionRegistry] = React.useState<
    ReadonlyMap<string, SelectOptionEntry>
  >(() => new Map());
  const [mounted, setMounted] = React.useState(open);
  const [positionedEpoch, setPositionedEpoch] = React.useState<number | null>(null);
  const isOpenRef = React.useRef(open);
  const openEpochRef = React.useRef(0);
  if (open && !isOpenRef.current) openEpochRef.current++;
  isOpenRef.current = open;
  const openEpoch = openEpochRef.current;
  const positioned = positionedEpoch === openEpoch;
  const [triggerHandlers, setTriggerHandlers] = React.useState<SelectTriggerHandlers>({});
  const triggerRef = React.useRef<NodesRef | null>(null);
  const screenRect = getScreenRect();
  const size =
    sizeProp === "responsive" && screenRect?.width != null && screenRect.width >= 1280
      ? "medium"
      : sizeProp === "responsive"
        ? "large"
        : sizeProp;
  const classes = select({ size, open, positioned });

  const selectedItems = React.useMemo(
    () =>
      value.map((optionValue): SelectSelectedItem => {
        const entry = optionRegistry.get(optionValue);
        return entry
          ? { ...entry, value: optionValue, resolved: true }
          : { value: optionValue, label: null, textValue: "", resolved: false };
      }),
    [optionRegistry, value],
  );
  const selectedOption = value.length === 1 ? optionRegistry.get(value[0] ?? "") : undefined;
  const selectedItem = selectedOption
    ? { ...selectedOption, value: value[0] ?? "", resolved: true }
    : undefined;
  const showPlaceholder =
    value.length === 0 ||
    (optionRegistry.size > 0 && selectedItems.every((item) => !item.resolved));
  const displayValue = showPlaceholder
    ? undefined
    : formatValue
      ? formatValue(selectedItems)
      : selectedItems
          .filter((item) => item.resolved)
          .map((item) => item.textValue)
          .join(", ");

  React.useEffect(() => {
    "background only";
    if (open) {
      setMounted(true);
      return;
    }
    if (!positioned) setMounted(false);
  }, [open, positioned]);

  const setPositioned = React.useCallback(
    (nextPositioned: boolean) => setPositionedEpoch(nextPositioned ? openEpochRef.current : null),
    [],
  );
  const requestOpen = React.useCallback(
    (nextOpen: boolean, details: SelectOpenChangeDetails) => {
      "background only";
      if (nextOpen && (disabled || readOnly)) return;
      if (nextOpen === open) return;
      setOpenState(nextOpen);
      onOpenChange?.(nextOpen, details);
    },
    [disabled, onOpenChange, open, readOnly, setOpenState],
  );
  const finishClose = React.useCallback((immediate = false) => {
    "background only";
    if (immediate || !isOpenRef.current) {
      setMounted(false);
      setPositionedEpoch(null);
    }
  }, []);
  const selectValue = React.useCallback(
    (nextValue: string, event: BaseEvent) => {
      "background only";
      if (disabled || readOnly) return;
      const next = multiple
        ? value.includes(nextValue)
          ? value.filter((entry) => entry !== nextValue)
          : [...value, nextValue]
        : [nextValue];
      if (!isSameValue(value, next)) setValueState(next);
      if (!multiple) requestOpen(false, { reason: "itemSelect", event });
    },
    [disabled, multiple, readOnly, requestOpen, setValueState, value],
  );
  const registerOption = React.useCallback((optionValue: string, entry: SelectOptionEntry) => {
    setOptionRegistry((current) => {
      const previous = current.get(optionValue);
      if (
        previous &&
        previous.label === entry.label &&
        previous.textValue === entry.textValue &&
        previous.prefixIcon === entry.prefixIcon &&
        previous.node === entry.node
      ) {
        return current;
      }
      return new Map(current).set(optionValue, entry);
    });
  }, []);
  const unregisterOption = React.useCallback((optionValue: string) => {
    setOptionRegistry((current) => {
      if (!current.has(optionValue)) return current;
      const next = new Map(current);
      next.delete(optionValue);
      return next;
    });
  }, []);

  const contextValue = React.useMemo<SelectContextValue>(
    () => ({
      value,
      selectedItems,
      selectedItem,
      displayValue,
      showPlaceholder,
      multiple,
      open,
      mounted,
      openEpoch,
      disabled,
      readOnly,
      invalid,
      required,
      size,
      placement,
      gutter,
      overflowPadding,
      isOpenRef,
      openEpochRef,
      triggerRef,
      triggerHandlers,
      setTriggerHandlers,
      classes,
      positioned,
      setPositioned,
      requestOpen,
      finishClose,
      selectValue,
      registerOption,
      unregisterOption,
    }),
    [
      classes,
      disabled,
      displayValue,
      finishClose,
      gutter,
      invalid,
      mounted,
      multiple,
      open,
      openEpoch,
      overflowPadding,
      placement,
      positioned,
      readOnly,
      registerOption,
      requestOpen,
      required,
      selectValue,
      selectedItem,
      selectedItems,
      setPositioned,
      showPlaceholder,
      size,
      triggerHandlers,
      unregisterOption,
      value,
    ],
  );

  return (
    <SelectContext.Provider value={contextValue}>
      <view {...(ref ? { ref: ref as LynxViewRef } : {})} className={className} {...nativeProps}>
        {children}
      </view>
    </SelectContext.Provider>
  );
});
SelectRoot.displayName = "SelectRoot";

////////////////////////////////////////////////////////////////////////////////////

export interface SelectTriggerProps
  extends SelectTriggerPublicVariantProps,
    LynxStyledElementProps,
    LynxPressableProps,
    LynxAccessibilityProps {
  placeholder?: React.ReactNode;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
}

export const SelectTrigger = React.forwardRef<unknown, SelectTriggerProps>((props, ref) => {
  const {
    children,
    className,
    placeholder,
    prefixIcon,
    suffixIcon,
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
    "accessibility-element": accessibilityElement = true,
    "accessibility-label": accessibilityLabel,
    "accessibility-traits": accessibilityTraits,
    ...nativeProps
  } = props;
  const context = useSelectContext("SelectTrigger");
  const nonInteractive = context.disabled || context.readOnly;
  const handleTap = React.useCallback<NativeTapHandler>(
    (event, instance) => {
      "background only";
      context.requestOpen(!context.open, { reason: "trigger", event });
      bindtap?.(event, instance);
    },
    [bindtap, context.open, context.requestOpen],
  );
  const {
    pressed,
    bindtap: proxyBindtap,
    ...pressHandlers
  } = usePressTap({
    disabled: nonInteractive,
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
    return () => {
      context.setTriggerHandlers({});
    };
  }, [context.setTriggerHandlers, mainThreadProxyBindtap, proxyBindtap]);
  const handleRef = React.useCallback(
    (node: NodesRef | null) => {
      context.triggerRef.current = node;
      mergeNodeRef(ref, node);
    },
    [context.triggerRef, ref],
  );
  const classes = selectTrigger({
    size: context.size,
    open: context.open,
    pressed,
    disabled: context.disabled,
    readOnly: context.readOnly,
    invalid: context.invalid,
  });

  return (
    <view
      ref={handleRef as LynxViewRef}
      className={clsx(classes.root, className)}
      accessibility-element={accessibilityElement}
      accessibility-label={accessibilityLabel}
      accessibility-role-description="button"
      accessibility-value={context.open ? "expanded" : "collapsed"}
      accessibility-traits={nonInteractive ? "disabled" : (accessibilityTraits ?? "button")}
      {...nativeProps}
      {...pressHandlers}
      bindtap={proxyBindtap}
    >
      <view className={classes.pressedOverlay} accessibility-elements-hidden={true} />
      {children ?? (
        <>
          <SelectPrefixIcon fallback={prefixIcon} />
          <SelectValue />
          <SelectPlaceholder>{placeholder}</SelectPlaceholder>
          <SelectSuffixIcon icon={suffixIcon} />
        </>
      )}
    </view>
  );
});
SelectTrigger.displayName = "SelectTrigger";

////////////////////////////////////////////////////////////////////////////////////

export interface SelectValueProps extends LynxStyledElementProps {}

export const SelectValue = React.forwardRef<unknown, SelectValueProps>((props, ref) => {
  const { children, className, ...nativeProps } = props;
  const context = useSelectContext("SelectValue");
  if (context.showPlaceholder) return null;
  return renderTextContent(
    clsx(
      selectTrigger({
        size: context.size,
        open: context.open,
        disabled: context.disabled,
        readOnly: context.readOnly,
        invalid: context.invalid,
      }).value,
      className,
    ),
    children ?? context.displayValue,
    ref,
    nativeProps,
  );
});
SelectValue.displayName = "SelectValue";

export interface SelectPlaceholderProps extends LynxStyledElementProps {}

export const SelectPlaceholder = React.forwardRef<unknown, SelectPlaceholderProps>((props, ref) => {
  const { children, className, ...nativeProps } = props;
  const context = useSelectContext("SelectPlaceholder");
  if (!context.showPlaceholder) return null;
  return renderTextContent(
    clsx(
      selectTrigger({
        size: context.size,
        open: context.open,
        disabled: context.disabled,
        readOnly: context.readOnly,
        invalid: context.invalid,
      }).placeholder,
      className,
    ),
    children,
    ref,
    nativeProps,
  );
});
SelectPlaceholder.displayName = "SelectPlaceholder";

export interface SelectPrefixIconProps extends Omit<InternalIconProps, "icon" | "deps"> {
  fallback?: React.ReactNode;
}

export const SelectPrefixIcon = React.forwardRef<unknown, SelectPrefixIconProps>((props, ref) => {
  const { fallback, className, ...nativeProps } = props;
  const context = useSelectContext("SelectPrefixIcon");
  const icon = context.selectedItem?.prefixIcon ?? fallback;
  if (!isValidElement<LynxIconElementProps>(icon)) return null;
  const classes = selectTrigger({
    size: context.size,
    open: context.open,
    disabled: context.disabled,
    readOnly: context.readOnly,
    invalid: context.invalid,
  });
  return (
    <InternalIcon
      ref={ref}
      icon={icon}
      className={clsx(classes.prefixIcon, className)}
      accessibility-elements-hidden={true}
      deps={[context.selectedItem?.prefixIcon, context.value]}
      {...nativeProps}
    />
  );
});
SelectPrefixIcon.displayName = "SelectPrefixIcon";

export interface SelectSuffixIconProps extends Omit<InternalIconProps, "icon" | "deps"> {
  icon?: React.ReactNode;
}

export const SelectSuffixIcon = React.forwardRef<unknown, SelectSuffixIconProps>((props, ref) => {
  const { icon, className, ...nativeProps } = props;
  const context = useSelectContext("SelectSuffixIcon");
  const classes = selectTrigger({
    size: context.size,
    open: context.open,
    disabled: context.disabled,
    readOnly: context.readOnly,
    invalid: context.invalid,
  });
  if (!isValidElement<LynxIconElementProps>(icon)) {
    return (
      <text
        {...(ref ? { ref: ref as LynxTextRef } : {})}
        className={clsx(classes.suffixIcon, className)}
        accessibility-elements-hidden={true}
        {...nativeProps}
      >
        ⌄
      </text>
    );
  }
  return (
    <InternalIcon
      ref={ref}
      icon={icon}
      className={clsx(classes.suffixIcon, className)}
      accessibility-elements-hidden={true}
      deps={[context.open]}
      {...nativeProps}
    />
  );
});
SelectSuffixIcon.displayName = "SelectSuffixIcon";

////////////////////////////////////////////////////////////////////////////////////

export interface SelectContentProps extends LynxStyledElementProps {}

export const SelectContent = React.forwardRef<unknown, SelectContentProps>((props, ref) => {
  const { children, className, style, ...nativeProps } = props;
  const context = useSelectContext("SelectContent");
  const measurementVersionRef = React.useRef(0);
  const intrinsicMeasurementVersionRef = React.useRef(0);
  const scrollRequestVersionRef = React.useRef(0);
  const scrolledEpochRef = React.useRef<number | null>(null);
  // Snapshot refs can be recreated on each patch. Their current native node belongs in a ref;
  // the one-time attachment state merely starts effects that require an attached node.
  const overlayNodeRef = React.useRef<NodesRef | null>(null);
  const scrollNodeRef = React.useRef<NodesRef | null>(null);
  const scrollContentNodeRef = React.useRef<NodesRef | null>(null);
  const overlayAttachedRef = React.useRef(false);
  const scrollAttachedRef = React.useRef(false);
  const scrollContentAttachedRef = React.useRef(false);
  const [overlayAttached, setOverlayAttached] = React.useState(false);
  const [scrollAttached, setScrollAttached] = React.useState(false);
  const [scrollContentAttached, setScrollContentAttached] = React.useState(false);
  const [scrollAreaId, setScrollAreaId] = React.useState<string | undefined>(undefined);
  React.useEffect(() => {
    "background only";
    // Generate once on the background thread, then share the id through state.
    setScrollAreaId(`seed-select-scroll-area-${nextSelectScrollAreaId++}`);
  }, []);
  const measurementConfigRef = React.useRef(0);
  const [intrinsicSize, setIntrinsicSize] = React.useState<{
    width: number;
    height: number;
    epoch: number;
    config: number;
  } | null>(null);
  const [position, setPosition] = React.useState<SelectPosition | null>(null);
  const [widthConstraint, setWidthConstraint] = React.useState<number | null>(null);
  const [overlayRect, setOverlayRect] = React.useState<SelectRect | null>(null);
  const [triggerRect, setTriggerRect] = React.useState<SelectRect | null>(null);
  const selectedNode = context.selectedItem?.node;

  const measurePosition = React.useCallback(async () => {
    "background only";
    const referenceNode = context.triggerRef.current;
    const openEpoch = context.openEpoch;
    const overlayNode = overlayNodeRef.current;
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
      const [reference, boundary, overlay] = await Promise.all([
        getRectByRef({ current: referenceNode }, true),
        getRootRect(),
        getRectByRef({ current: overlayNode }, true),
      ]);
      if (
        version !== measurementVersionRef.current ||
        !context.isOpenRef.current ||
        openEpoch !== context.openEpochRef.current
      ) {
        return;
      }
      const width = widthConstraint ?? reference.width;
      const nextPosition = await computePosition({
        reference,
        boundary,
        width,
        height: Math.min(intrinsicSize.height, selectMaxHeight),
        placement: context.placement,
        gutter: context.gutter,
        overflowPadding: context.overflowPadding,
        flip: { fallbackStrategy: "bestFit" },
        shift: { crossAxis: true },
        size: { order: "beforeFlip", minimumHeight: selectMinimumAvailableHeight },
      });
      if (
        version !== measurementVersionRef.current ||
        !context.isOpenRef.current ||
        openEpoch !== context.openEpochRef.current
      ) {
        return;
      }
      if (nextPosition.availableWidth < width) {
        const constrainedWidth = nextPosition.availableWidth;
        if (widthConstraint !== constrainedWidth) {
          measurementVersionRef.current++;
          measurementConfigRef.current++;
          intrinsicMeasurementVersionRef.current++;
          scrollRequestVersionRef.current++;
          setWidthConstraint(constrainedWidth);
          setIntrinsicSize(null);
          setPosition(null);
          setOverlayRect(null);
          setTriggerRect(null);
          context.setPositioned(false);
        }
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
      setTriggerRect(reference);
      context.setPositioned(true);
    } catch {
      // Native nodes can disappear while a selector query is in flight; keep the popup hidden.
    }
  }, [
    context.gutter,
    context.isOpenRef,
    context.open,
    context.openEpoch,
    context.openEpochRef,
    context.overflowPadding,
    context.placement,
    context.setPositioned,
    context.triggerRef,
    intrinsicSize,
    overlayAttached,
    widthConstraint,
  ]);

  const measureIntrinsicSize = React.useCallback(async () => {
    "background only";
    const scrollNode = scrollNodeRef.current;
    const scrollContentNode = scrollContentNodeRef.current;
    const openEpoch = context.openEpochRef.current;
    const config = measurementConfigRef.current;
    if (!context.isOpenRef.current || !scrollAreaId || !scrollNode || !scrollContentNode) {
      return;
    }
    const version = ++intrinsicMeasurementVersionRef.current;
    try {
      const rect = await getRectByRef({ current: scrollContentNode }, false, scrollAreaId);
      if (
        version !== intrinsicMeasurementVersionRef.current ||
        !context.isOpenRef.current ||
        openEpoch !== context.openEpochRef.current ||
        config !== measurementConfigRef.current
      ) {
        return;
      }
      setIntrinsicSize((current) => {
        if (
          current?.width === rect.width &&
          current.height === rect.height &&
          current.epoch === openEpoch &&
          current.config === config
        ) {
          return current;
        }
        return { width: rect.width, height: rect.height, epoch: openEpoch, config };
      });
    } catch {
      // The hidden overlay may release either node before the native query resolves.
    }
  }, [context.isOpenRef, context.openEpochRef, scrollAreaId]);

  React.useEffect(() => {
    "background only";
    measurementVersionRef.current++;
    intrinsicMeasurementVersionRef.current++;
    scrollRequestVersionRef.current++;
    setWidthConstraint(null);
    setPosition(null);
    setOverlayRect(null);
    setTriggerRect(null);
    setIntrinsicSize((current) => (current ? { ...current, epoch: context.openEpoch } : current));
    scrolledEpochRef.current = null;
    if (scrollNodeRef.current && scrollContentNodeRef.current) void measureIntrinsicSize();
  }, [context.openEpoch, measureIntrinsicSize]);
  React.useEffect(() => {
    "background only";
    if (context.open) return;
    measurementVersionRef.current++;
    intrinsicMeasurementVersionRef.current++;
    scrollRequestVersionRef.current++;
  }, [context.open]);
  React.useEffect(() => {
    "background only";
    return () => {
      measurementVersionRef.current++;
      intrinsicMeasurementVersionRef.current++;
      scrollRequestVersionRef.current++;
    };
  }, []);

  React.useEffect(() => {
    "background only";
    measurementVersionRef.current++;
    intrinsicMeasurementVersionRef.current++;
    scrollRequestVersionRef.current++;
    measurementConfigRef.current++;
    setWidthConstraint(null);
    setIntrinsicSize(null);
    setPosition(null);
    setOverlayRect(null);
    setTriggerRect(null);
    context.setPositioned(false);
    if (scrollNodeRef.current && scrollContentNodeRef.current) void measureIntrinsicSize();
  }, [className, context.setPositioned, context.size, measureIntrinsicSize, style]);

  React.useEffect(() => {
    "background only";
    if (scrollAttached && scrollContentAttached) void measureIntrinsicSize();
  }, [measureIntrinsicSize, scrollAttached, scrollContentAttached]);

  React.useEffect(() => {
    "background only";
    if (context.open) void measurePosition();
  }, [context.open, measurePosition]);

  React.useEffect(() => {
    "background only";
    if (context.open && widthConstraint != null) void measureIntrinsicSize();
  }, [context.open, measureIntrinsicSize, widthConstraint]);
  React.useEffect(() => {
    "background only";
    const requestVersion = ++scrollRequestVersionRef.current;
    const openEpoch = context.openEpoch;
    const selected = context.selectedItem;
    const scrollNode = scrollNodeRef.current;
    if (
      !context.open ||
      !context.positioned ||
      !position ||
      !intrinsicSize ||
      intrinsicSize.epoch !== openEpoch ||
      intrinsicSize.config !== measurementConfigRef.current ||
      !selected?.node ||
      !scrollNode ||
      !scrollAreaId ||
      scrolledEpochRef.current === openEpoch
    ) {
      return;
    }
    if (intrinsicSize.height <= position.height) {
      scrolledEpochRef.current = openEpoch;
      return;
    }
    const entry = selected.node;
    void getRectByRef({ current: entry }, false, scrollAreaId)
      .then((item) => {
        if (
          requestVersion !== scrollRequestVersionRef.current ||
          !context.isOpenRef.current ||
          openEpoch !== context.openEpochRef.current ||
          scrolledEpochRef.current === openEpoch
        ) {
          return;
        }
        const offset =
          item.top < 0
            ? item.top
            : item.bottom > position.height
              ? item.bottom - position.height
              : 0;
        if (offset === 0) {
          scrolledEpochRef.current = openEpoch;
          return;
        }
        try {
          scrollNode.invoke({ method: "scrollBy", params: { offset } }).exec();
          scrolledEpochRef.current = openEpoch;
        } catch {
          // Test refs do not implement native UI methods.
        }
      })
      .catch(() => {
        // The entry can be replaced before its native bounds are available.
      });
  }, [
    context.isOpenRef,
    context.open,
    context.openEpoch,
    context.openEpochRef,
    context.positioned,
    context.selectedItem,
    intrinsicSize,
    position,
    scrollAreaId,
    scrollAttached,
    selectedNode,
  ]);

  const handleShowOverlay = React.useCallback(() => {
    "background only";
    void measureIntrinsicSize();
    void measurePosition();
  }, [measureIntrinsicSize, measurePosition]);
  const handleRef = React.useCallback(
    (node: NodesRef | null) => {
      mergeNodeRef(ref, node);
    },
    [ref],
  );
  const handlePositionerRef = React.useCallback((node: NodesRef | null) => {
    overlayNodeRef.current = node;
    if (node && !overlayAttachedRef.current) {
      overlayAttachedRef.current = true;
      setOverlayAttached(true);
    }
  }, []);
  const handleScrollRef = React.useCallback((node: NodesRef | null) => {
    "background only";
    scrollNodeRef.current = node;
    if (node && !scrollAttachedRef.current) {
      scrollAttachedRef.current = true;
      setScrollAttached(true);
    }
  }, []);
  const handleScrollContentRef = React.useCallback((node: NodesRef | null) => {
    "background only";
    scrollContentNodeRef.current = node;
    if (node && !scrollContentAttachedRef.current) {
      scrollContentAttachedRef.current = true;
      setScrollContentAttached(true);
    }
  }, []);
  const handleIntrinsicLayoutChange = React.useCallback<NativeLayoutHandler>(() => {
    "background only";
    void measureIntrinsicSize();
  }, [measureIntrinsicSize]);
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
  const groups = toArray(children);

  return (
    // Keep options mounted while closed so defaultValue can resolve label/icon metadata before open.
    <overlay
      visible={context.mounted}
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
          style={{
            ...geometryStyle,
            ...style,
            ...(widthConstraint != null ? { width: toPixel(widthConstraint) } : {}),
          }}
          bindtransitionend={handleTransitionEnd}
          {...nativeProps}
        >
          <scroll-view
            ref={handleScrollRef as LynxViewRef}
            id={scrollAreaId}
            className={context.classes.scrollArea}
            scroll-orientation="vertical"
            enable-scroll={Boolean(
              position &&
                intrinsicSize &&
                intrinsicSize.epoch === context.openEpoch &&
                intrinsicSize.config === measurementConfigRef.current &&
                intrinsicSize.height > position.height,
            )}
            style={scrollStyle}
          >
            <view
              ref={handleScrollContentRef as LynxViewRef}
              className={context.classes.scrollContent}
              bindlayoutchange={handleIntrinsicLayoutChange}
            >
              {groups.map((group, index) => (
                <SelectGroupPositionContext.Provider
                  key={React.isValidElement(group) ? (group.key ?? index) : index}
                  value={{ isFirst: index === 0 }}
                >
                  {group}
                </SelectGroupPositionContext.Provider>
              ))}
            </view>
          </scroll-view>
        </view>
      </view>
    </overlay>
  );
});
SelectContent.displayName = "SelectContent";

/** The viewport is normally owned by SelectContent; use this only for custom content composition. */
export interface SelectScrollAreaProps extends LynxStyledElementProps {}

export const SelectScrollArea = React.forwardRef<unknown, SelectScrollAreaProps>((props, ref) => {
  const { children, className, ...nativeProps } = props;
  const context = useSelectContext("SelectScrollArea");
  return (
    <scroll-view
      {...(ref ? { ref: ref as LynxViewRef } : {})}
      className={clsx(context.classes.scrollArea, className)}
      scroll-orientation="vertical"
      {...nativeProps}
    >
      <view className={context.classes.scrollContent}>{children}</view>
    </scroll-view>
  );
});
SelectScrollArea.displayName = "SelectScrollArea";

////////////////////////////////////////////////////////////////////////////////////

export interface SelectGroupProps extends LynxStyledElementProps {}

export const SelectGroup = React.forwardRef<unknown, SelectGroupProps>((props, ref) => {
  const { children, className, ...nativeProps } = props;
  const context = useSelectContext("SelectGroup");
  const position = React.useContext(SelectGroupPositionContext);
  return (
    <view
      {...(ref ? { ref: ref as LynxViewRef } : {})}
      className={clsx(context.classes.group, className)}
      {...nativeProps}
    >
      {!position.isFirst ? (
        <view className={context.classes.separator} accessibility-elements-hidden={true} />
      ) : null}
      {children}
    </view>
  );
});
SelectGroup.displayName = "SelectGroup";

export interface SelectGroupLabelProps extends LynxStyledElementProps, LynxAccessibilityProps {}

export const SelectGroupLabel = React.forwardRef<unknown, SelectGroupLabelProps>((props, ref) => {
  const {
    children,
    className,
    "accessibility-heading": accessibilityHeading = true,
    ...nativeProps
  } = props;
  const context = useSelectContext("SelectGroupLabel");
  return (
    <text
      {...(ref ? { ref: ref as LynxTextRef } : {})}
      className={clsx(context.classes.groupLabel, className)}
      accessibility-heading={accessibilityHeading}
      {...nativeProps}
    >
      {children}
    </text>
  );
});
SelectGroupLabel.displayName = "SelectGroupLabel";

////////////////////////////////////////////////////////////////////////////////////

export interface SelectItemProps
  extends SelectItemPublicVariantProps,
    LynxStyledElementProps,
    LynxPressableProps,
    LynxAccessibilityProps {
  value: string;
  label?: React.ReactNode;
  textValue?: string;
  prefixIcon?: React.ReactNode;
  disabled?: boolean;
  readOnly?: boolean;
}

export const SelectItem = React.forwardRef<unknown, SelectItemProps>((props, ref) => {
  const [variantProps, otherProps] = selectItem.splitVariantProps(props);
  const { disabled: disabledProp = false } = variantProps;
  const {
    value,
    label,
    textValue,
    prefixIcon,
    readOnly = false,
    children,
    className,
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
    "accessibility-element": accessibilityElement = true,
    "accessibility-label": accessibilityLabel,
    "accessibility-traits": accessibilityTraits,
    "accessibility-value": accessibilityValue,
    ...nativeProps
  } = otherProps;
  const context = useSelectContext("SelectItem");
  // A fresh snapshot ref is not a semantic option change. Register after its first attachment
  // without turning every native ref patch into a component state update.
  const nodeRef = React.useRef<NodesRef | null>(null);
  const nodeAttachedRef = React.useRef(false);
  const [nodeAttached, setNodeAttached] = React.useState(false);
  const disabled = context.disabled || context.readOnly || disabledProp || readOnly;
  const selected = context.value.includes(value);
  const resolvedTextValue = textValue ?? (typeof label === "string" ? label : value);
  const handleTap = React.useCallback<NativeTapHandler>(
    (event, instance) => {
      "background only";
      context.selectValue(value, event);
      bindtap?.(event, instance);
    },
    [bindtap, context, value],
  );
  const { pressed, ...pressHandlers } = usePressTap({
    disabled,
    onTap: handleTap,
    mainThreadOnTap: mainThreadBindtap,
  });
  const handleRef = React.useCallback(
    (nextNode: NodesRef | null) => {
      nodeRef.current = nextNode;
      if (nextNode && !nodeAttachedRef.current) {
        nodeAttachedRef.current = true;
        setNodeAttached(true);
      }
      mergeNodeRef(ref, nextNode);
    },
    [ref],
  );
  React.useEffect(() => {
    "background only";
    context.registerOption(value, {
      label,
      textValue: resolvedTextValue,
      prefixIcon,
      node: nodeRef.current,
    });
    return () => {
      context.unregisterOption(value);
    };
  }, [
    context.registerOption,
    context.unregisterOption,
    label,
    nodeAttached,
    prefixIcon,
    resolvedTextValue,
    value,
  ]);
  const classes = selectItem({
    ...variantProps,
    size: context.size,
    disabled,
    selected,
    pressed,
  });
  const itemContextValue = React.useMemo<SelectItemContextValue>(
    () => ({ label, prefixIcon, selected, disabled, pressed, classes }),
    [classes, disabled, label, prefixIcon, pressed, selected],
  );

  return (
    <SelectItemContext.Provider value={itemContextValue}>
      <view
        ref={handleRef as LynxViewRef}
        className={clsx(classes.root, className)}
        accessibility-element={accessibilityElement}
        accessibility-label={accessibilityLabel ?? resolvedTextValue}
        accessibility-role-description="option"
        accessibility-value={accessibilityValue ?? (selected ? "selected" : "not selected")}
        accessibility-traits={disabled ? "disabled" : accessibilityTraits}
        {...nativeProps}
        {...pressHandlers}
      >
        <view className={classes.pressedOverlay} accessibility-elements-hidden={true} />
        {children}
      </view>
    </SelectItemContext.Provider>
  );
});
SelectItem.displayName = "SelectItem";

export interface SelectItemPrefixIconProps extends Omit<InternalIconProps, "icon" | "deps"> {
  icon?: React.ReactNode;
}

export const SelectItemPrefixIcon = React.forwardRef<unknown, SelectItemPrefixIconProps>(
  (props, ref) => {
    const { icon: iconOverride, className, ...nativeProps } = props;
    const context = useSelectItemContext("SelectItemPrefixIcon");
    const icon = iconOverride ?? context.prefixIcon;
    if (!isValidElement<LynxIconElementProps>(icon)) return null;
    return (
      <InternalIcon
        ref={ref}
        icon={icon}
        className={clsx(context.classes.prefixIcon, className)}
        accessibility-elements-hidden={true}
        deps={[context.selected, context.disabled, context.pressed, icon]}
        {...nativeProps}
      />
    );
  },
);
SelectItemPrefixIcon.displayName = "SelectItemPrefixIcon";

export interface SelectItemBodyProps extends LynxStyledElementProps {}

export const SelectItemBody = React.forwardRef<unknown, SelectItemBodyProps>((props, ref) => {
  const { children, className, ...nativeProps } = props;
  const context = useSelectItemContext("SelectItemBody");
  return (
    <view
      {...(ref ? { ref: ref as LynxViewRef } : {})}
      className={clsx(context.classes.body, className)}
      {...nativeProps}
    >
      {children}
    </view>
  );
});
SelectItemBody.displayName = "SelectItemBody";

export interface SelectItemLabelProps extends LynxStyledElementProps {}

export const SelectItemLabel = React.forwardRef<unknown, SelectItemLabelProps>((props, ref) => {
  const { children, className, ...nativeProps } = props;
  const context = useSelectItemContext("SelectItemLabel");
  return renderTextContent(
    clsx(context.classes.label, className),
    children ?? context.label,
    ref,
    nativeProps,
  );
});
SelectItemLabel.displayName = "SelectItemLabel";

export interface SelectItemDescriptionProps extends LynxStyledElementProps {}

export const SelectItemDescription = React.forwardRef<unknown, SelectItemDescriptionProps>(
  (props, ref) => {
    const { children, className, ...nativeProps } = props;
    const context = useSelectItemContext("SelectItemDescription");
    return renderTextContent(
      clsx(context.classes.description, className),
      children,
      ref,
      nativeProps,
    );
  },
);
SelectItemDescription.displayName = "SelectItemDescription";

export interface SelectItemIndicatorProps extends Omit<InternalIconProps, "icon" | "deps"> {
  selected?: React.ReactNode;
  unselected?: React.ReactNode;
}

export const SelectItemIndicator = React.forwardRef<unknown, SelectItemIndicatorProps>(
  (props, ref) => {
    const { selected: selectedIcon, unselected, className, ...nativeProps } = props;
    const context = useSelectItemContext("SelectItemIndicator");
    const icon = context.selected ? selectedIcon : unselected;
    if (!isValidElement<LynxIconElementProps>(icon)) {
      if (!context.selected) return null;
      return (
        <text
          {...(ref ? { ref: ref as LynxTextRef } : {})}
          className={clsx(context.classes.indicator, className)}
          accessibility-elements-hidden={true}
          {...nativeProps}
        >
          ✓
        </text>
      );
    }
    return (
      <InternalIcon
        ref={ref}
        icon={icon}
        className={clsx(context.classes.indicator, className)}
        accessibility-elements-hidden={true}
        deps={[context.selected, context.disabled, context.pressed, icon]}
        {...nativeProps}
      />
    );
  },
);
SelectItemIndicator.displayName = "SelectItemIndicator";
