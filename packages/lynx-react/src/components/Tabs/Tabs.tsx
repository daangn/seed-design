import { tabs, type TabsVariantProps } from "@seed-design/lynx-css/recipes/tabs";
import * as React from "@lynx-js/react";
import type {
  IntrinsicElements,
  NodesRef,
  ViewPagerChangeEvent,
  ViewPagerOffsetChangeEvent,
  ViewPagerWillChangeEvent,
} from "@lynx-js/types";
import clsx from "clsx";

import { useControllableState } from "../../hooks/useControllableState";
import { usePressTap } from "../../hooks/usePressTap";
import type { LynxStyle, LynxViewProps, LynxViewRef } from "../../types";
import { createSlotRecipeContext } from "../../utils/create-slot-recipe-context";

type NativeViewProps = IntrinsicElements["view"];
type NativeScrollViewProps = IntrinsicElements["scroll-view"];
type NativeViewPagerProps = IntrinsicElements["viewpager"];
type NativeViewPagerItemProps = IntrinsicElements["viewpager-item"];
type LayoutChangeHandler = NonNullable<NativeViewProps["bindlayoutchange"]>;
type TriggerRect = { left: number; width: number };
type TriggerItem = { value: string; disabled: boolean };
type TabsPublicVariantProps = Omit<TabsVariantProps, "selected" | "disabled" | "inCarousel">;

const { ClassNamesProvider, useClassNames } = createSlotRecipeContext(tabs);

function invokeSelectTab(pager: NodesRef | null, index: number, smooth: boolean) {
  "background only";
  if (!pager || index < 0) return;
  try {
    pager.invoke({ method: "selectTab", params: { index, smooth } }).exec();
  } catch {
    // ReactLynx Testing Library의 NodesRef는 UI method를 구현하지 않는다.
  }
}

function invokeScrollToIndex(list: NodesRef | null, index: number) {
  "background only";
  if (!list || index < 0) return;
  try {
    list.invoke({ method: "scrollTo", params: { index, smooth: true } }).exec();
  } catch {
    // ReactLynx Testing Library의 NodesRef는 UI method를 구현하지 않는다.
  }
}

function getLayoutRect(event: Parameters<LayoutChangeHandler>[0]): TriggerRect | null {
  const width = event.detail?.width ?? event.params?.width;
  const left = event.detail?.left ?? event.params?.left;
  if (!Number.isFinite(width) || !Number.isFinite(left)) return null;
  return { width: Math.max(0, width), left };
}

function getNextEnabledIndex(items: TriggerItem[], targetIndex: number, currentIndex: number) {
  if (!items[targetIndex]?.disabled) return targetIndex;

  const direction = targetIndex >= currentIndex ? 1 : -1;
  for (
    let index = targetIndex + direction;
    index >= 0 && index < items.length;
    index += direction
  ) {
    if (!items[index]?.disabled) return index;
  }
  for (
    let index = targetIndex - direction;
    index >= 0 && index < items.length;
    index -= direction
  ) {
    if (!items[index]?.disabled) return index;
  }
  return currentIndex;
}

interface TabsContextValue {
  value: string | undefined;
  variantProps: TabsPublicVariantProps;
  items: TriggerItem[];
  selectedIndex: number;
  carouselOffset: number | null;
  listLeft: number;
  triggerRects: Record<string, TriggerRect>;
  registerTrigger: (value: string, disabled: boolean) => () => void;
  updateTriggerDisabled: (value: string, disabled: boolean) => void;
  updateTriggerRect: (value: string, rect: TriggerRect) => void;
  setListLeft: (left: number) => void;
  setListRef: (ref: NodesRef | null) => void;
  setPagerRef: (ref: NodesRef | null) => void;
  selectValue: (value: string) => void;
  handlePagerChange: (index: number) => void;
  handlePagerOffsetChange: (offset: number) => void;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

function useTabsContext(consumer: string) {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error(`<${consumer}/> must be rendered inside <TabsRoot/>.`);
  }
  return context;
}

interface TabsCarouselContextValue {
  swipeable: boolean;
  onSettle?: () => void;
  onSwipeStart?: () => void;
  onSwipeEnd?: () => void;
}

const TabsCarouselContext = React.createContext<TabsCarouselContextValue | null>(null);

function useTabsCarouselContext(consumer: string): TabsCarouselContextValue;
function useTabsCarouselContext(consumer: string, strict: false): TabsCarouselContextValue | null;
function useTabsCarouselContext(consumer: string, strict = true) {
  const context = React.useContext(TabsCarouselContext);
  if (!context && strict) {
    throw new Error(`<${consumer}/> must be rendered inside <TabsCarousel/>.`);
  }
  return context;
}

////////////////////////////////////////////////////////////////////////////////////

/**
 * @platform Lynx
 *
 * 웹 대비 미지원 기능:
 * - `orientation`: Lynx Tabs는 수평 방향만 지원
 * - `lazyMount`, `unmountOnExit`: native viewpager가 모든 page slot을 유지해야 함
 * - 키보드 포커스와 roving tabindex
 */
export interface TabsRootProps
  extends TabsPublicVariantProps,
    Omit<NativeViewProps, "children" | "className" | "style"> {
  children?: React.ReactNode;
  className?: string;
  style?: LynxStyle;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

export const TabsRoot = React.forwardRef<unknown, TabsRootProps>((props, ref) => {
  const [variantProps, otherProps] = tabs.splitVariantProps(props);
  const {
    children,
    className,
    style,
    value: valueProp,
    defaultValue,
    onValueChange,
    ...nativeProps
  } = otherProps;
  const classNames = tabs(variantProps);
  const [value, setValueInternal] = useControllableState<string | undefined>({
    value: valueProp,
    defaultValue,
    onChange(nextValue) {
      "background only";
      if (nextValue !== undefined) onValueChange?.(nextValue);
    },
  });
  const [items, setItems] = React.useState<TriggerItem[]>([]);
  const [triggerRects, setTriggerRects] = React.useState<Record<string, TriggerRect>>({});
  const [listLeft, setListLeft] = React.useState(0);
  const listRef = React.useRef<NodesRef | null>(null);
  const pagerRef = React.useRef<NodesRef | null>(null);
  const [carouselOffset, setCarouselOffset] = React.useState<number | null>(null);

  const selectedIndex = value === undefined ? -1 : items.findIndex((item) => item.value === value);

  const setListNode = React.useCallback(
    (node: NodesRef | null) => {
      listRef.current = node;
      if (node && selectedIndex >= 0) invokeScrollToIndex(node, selectedIndex);
    },
    [selectedIndex],
  );

  const setPagerNode = React.useCallback(
    (node: NodesRef | null) => {
      pagerRef.current = node;
      if (node && selectedIndex >= 0) invokeSelectTab(node, selectedIndex, false);
    },
    [selectedIndex],
  );

  const registerTrigger = React.useCallback((triggerValue: string, disabled: boolean) => {
    setItems((current) => {
      if (current.some((item) => item.value === triggerValue)) return current;
      return [...current, { value: triggerValue, disabled }];
    });

    return () => {
      "background only";
      setItems((current) => current.filter((item) => item.value !== triggerValue));
      setTriggerRects((current) => {
        const next = { ...current };
        delete next[triggerValue];
        return next;
      });
    };
  }, []);

  const updateTriggerDisabled = React.useCallback((triggerValue: string, disabled: boolean) => {
    setItems((current) =>
      current.map((item) =>
        item.value === triggerValue && item.disabled !== disabled ? { ...item, disabled } : item,
      ),
    );
  }, []);

  const updateTriggerRect = React.useCallback((triggerValue: string, rect: TriggerRect) => {
    setTriggerRects((current) => {
      const previous = current[triggerValue];
      if (previous?.left === rect.left && previous.width === rect.width) return current;
      return { ...current, [triggerValue]: rect };
    });
  }, []);

  const selectValue = React.useCallback(
    (nextValue: string) => {
      setValueInternal(nextValue);
    },
    [setValueInternal],
  );

  const handlePagerChange = React.useCallback(
    (targetIndex: number) => {
      const nextIndex = getNextEnabledIndex(items, targetIndex, selectedIndex);
      const nextItem = items[nextIndex];
      if (!nextItem) return;

      if (nextIndex !== targetIndex) {
        invokeSelectTab(pagerRef.current, nextIndex, true);
      }
      setCarouselOffset(null);
      setValueInternal(nextItem.value);
    },
    [items, selectedIndex, setValueInternal],
  );

  const handlePagerOffsetChange = React.useCallback((offset: number) => {
    setCarouselOffset(Number.isFinite(offset) ? offset : null);
  }, []);

  React.useEffect(() => {
    "background only";
    if (selectedIndex < 0) return;
    invokeSelectTab(pagerRef.current, selectedIndex, false);
    invokeScrollToIndex(listRef.current, selectedIndex);
  }, [selectedIndex]);

  const contextValue = React.useMemo<TabsContextValue>(
    () => ({
      value,
      variantProps,
      items,
      selectedIndex,
      carouselOffset,
      listLeft,
      triggerRects,
      registerTrigger,
      updateTriggerDisabled,
      updateTriggerRect,
      setListLeft,
      setListRef: setListNode,
      setPagerRef: setPagerNode,
      selectValue,
      handlePagerChange,
      handlePagerOffsetChange,
    }),
    [
      value,
      variantProps,
      items,
      selectedIndex,
      carouselOffset,
      listLeft,
      triggerRects,
      registerTrigger,
      updateTriggerDisabled,
      updateTriggerRect,
      setListNode,
      setPagerNode,
      selectValue,
      handlePagerChange,
      handlePagerOffsetChange,
    ],
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <ClassNamesProvider value={classNames}>
        <view
          {...(ref ? { ref: ref as LynxViewRef } : {})}
          {...nativeProps}
          className={clsx(classNames.root, className)}
          style={style}
        >
          {children}
        </view>
      </ClassNamesProvider>
    </TabsContext.Provider>
  );
});
TabsRoot.displayName = "TabsRoot";

////////////////////////////////////////////////////////////////////////////////////

export interface TabsListProps
  extends Omit<
    NativeScrollViewProps,
    "children" | "className" | "style" | "scroll-orientation" | "scroll-x" | "scroll-y"
  > {
  children?: React.ReactNode;
  className?: string;
  style?: LynxStyle;
}

export const TabsList = React.forwardRef<unknown, TabsListProps>((props, ref) => {
  const { children, className, style, bindlayoutchange, ...nativeProps } = props;
  const classNames = useClassNames();
  const { setListLeft, setListRef } = useTabsContext("TabsList");

  const mergedRef = React.useCallback(
    (node: NodesRef | null) => {
      setListRef(node);
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref, setListRef],
  );

  const handleLayoutChange = React.useCallback<LayoutChangeHandler>(
    (...args) => {
      "background only";
      bindlayoutchange?.(...args);
      const rect = getLayoutRect(args[0]);
      if (rect) setListLeft(rect.left);
    },
    [bindlayoutchange, setListLeft],
  );

  return (
    <scroll-view
      ref={mergedRef}
      {...nativeProps}
      scroll-orientation="horizontal"
      scroll-bar-enable={false}
      bindlayoutchange={handleLayoutChange}
      accessibility-element={false}
      accessibility-traits="tabbar"
      className={clsx(classNames.list, className)}
      style={style}
    >
      {children}
    </scroll-view>
  );
});
TabsList.displayName = "TabsList";

////////////////////////////////////////////////////////////////////////////////////

export interface TabsTriggerProps
  extends Omit<
    NativeViewProps,
    "children" | "className" | "style" | "bindtap" | "bindlayoutchange"
  > {
  children?: React.ReactNode;
  className?: string;
  style?: LynxStyle;
  value: string;
  disabled?: boolean;
  bindtap?: NativeViewProps["bindtap"];
  bindlayoutchange?: NativeViewProps["bindlayoutchange"];
}

export const TabsTrigger = React.forwardRef<unknown, TabsTriggerProps>((props, ref) => {
  const {
    children,
    className,
    style,
    value: triggerValue,
    disabled = false,
    bindtap,
    bindlayoutchange,
    "accessibility-label": accessibilityLabel,
    ...nativeProps
  } = props;
  const context = useTabsContext("TabsTrigger");
  const selected = context.value === triggerValue;

  React.useEffect(() => {
    "background only";
    return context.registerTrigger(triggerValue, disabled);
  }, [context.registerTrigger, triggerValue]);

  React.useEffect(() => {
    "background only";
    context.updateTriggerDisabled(triggerValue, disabled);
  }, [context.updateTriggerDisabled, triggerValue, disabled]);

  const handleTap = React.useCallback<NonNullable<NativeViewProps["bindtap"]>>(
    (...args) => {
      "background only";
      context.selectValue(triggerValue);
      bindtap?.(...args);
    },
    [bindtap, context.selectValue, triggerValue],
  );
  const { pressed: _pressed, ...pressHandlers } = usePressTap({ disabled, onTap: handleTap });

  const handleLayoutChange = React.useCallback<LayoutChangeHandler>(
    (...args) => {
      "background only";
      bindlayoutchange?.(...args);
      const rect = getLayoutRect(args[0]);
      if (rect) context.updateTriggerRect(triggerValue, rect);
    },
    [bindlayoutchange, context.updateTriggerRect, triggerValue],
  );

  const triggerClasses = tabs({ ...context.variantProps, selected, disabled });
  const label =
    typeof children === "string" || typeof children === "number" ? String(children) : undefined;

  return (
    <view
      {...(ref ? { ref: ref as LynxViewRef } : {})}
      {...nativeProps}
      {...pressHandlers}
      flatten={false}
      bindlayoutchange={handleLayoutChange}
      accessibility-element={true}
      accessibility-role-description="tab"
      accessibility-label={accessibilityLabel ?? label}
      accessibility-value={selected ? "selected" : "not selected"}
      accessibility-traits={disabled ? "disabled" : selected ? "selected" : "button"}
      className={clsx(triggerClasses.trigger, className)}
      style={style}
    >
      <text className={triggerClasses.triggerLabel}>{children}</text>
    </view>
  );
});
TabsTrigger.displayName = "TabsTrigger";

////////////////////////////////////////////////////////////////////////////////////

export interface TabsIndicatorProps
  extends Omit<NativeViewProps, "children" | "className" | "style"> {
  className?: string;
  style?: LynxStyle;
}

export const TabsIndicator = React.forwardRef<unknown, TabsIndicatorProps>((props, ref) => {
  const { className, style, ...nativeProps } = props;
  const classNames = useClassNames();
  const { carouselOffset, items, listLeft, selectedIndex, triggerRects } =
    useTabsContext("TabsIndicator");
  const position = carouselOffset ?? selectedIndex;
  const lowerIndex = Math.max(0, Math.floor(position));
  const upperIndex = Math.min(items.length - 1, Math.ceil(position));
  const progress = Math.max(0, Math.min(1, position - lowerIndex));
  const lowerRect = triggerRects[items[lowerIndex]?.value ?? ""];
  const upperRect = triggerRects[items[upperIndex]?.value ?? ""] ?? lowerRect;
  const x = lowerRect
    ? lowerRect.left - listLeft + ((upperRect?.left ?? lowerRect.left) - lowerRect.left) * progress
    : 0;
  const width = lowerRect
    ? lowerRect.width + ((upperRect?.width ?? lowerRect.width) - lowerRect.width) * progress
    : 0;

  return (
    <view
      {...(ref ? { ref: ref as LynxViewRef } : {})}
      {...nativeProps}
      accessibility-elements-hidden={true}
      className={clsx(classNames.indicator, className)}
      style={
        {
          "--tabs-indicator-x": `${x}px`,
          "--tabs-indicator-width": `${width}px`,
          ...style,
        } as LynxViewProps["style"]
      }
    />
  );
});
TabsIndicator.displayName = "TabsIndicator";

////////////////////////////////////////////////////////////////////////////////////

export interface TabsContentProps
  extends Omit<NativeViewProps, "children" | "className" | "style"> {
  children?: React.ReactNode;
  className?: string;
  style?: LynxStyle;
  value: string;
  viewPagerItemProps?: Omit<NativeViewPagerItemProps, "children">;
}

export const TabsContent = React.forwardRef<unknown, TabsContentProps>((props, ref) => {
  const {
    children,
    className,
    style,
    value: contentValue,
    viewPagerItemProps,
    ...nativeProps
  } = props;
  const tabsContext = useTabsContext("TabsContent");
  const inCarousel = useTabsCarouselContext("TabsContent", false) !== null;
  const selected = tabsContext.value === contentValue;
  const contentClasses = tabs({ ...tabsContext.variantProps, selected, inCarousel });

  const content = (
    <view
      {...(ref ? { ref: ref as LynxViewRef } : {})}
      {...nativeProps}
      accessibility-elements-hidden={!selected}
      accessibility-role-description="tabpanel"
      accessibility-value={selected ? "selected" : "not selected"}
      className={clsx(contentClasses.content, className)}
      style={style}
    >
      {children}
    </view>
  );

  if (inCarousel) {
    return <viewpager-item {...viewPagerItemProps}>{content}</viewpager-item>;
  }
  return content;
});
TabsContent.displayName = "TabsContent";

////////////////////////////////////////////////////////////////////////////////////

/**
 * @platform Lynx
 *
 * native viewpager를 사용하므로 웹의 `loop`, `autoHeight`, `dragThreshold`,
 * `carouselPreventDrag`는 지원하지 않습니다.
 */
export interface TabsCarouselProps
  extends Omit<NativeViewProps, "children" | "className" | "style"> {
  children?: React.ReactNode;
  className?: string;
  style?: LynxStyle;
  swipeable?: boolean;
  onSettle?: () => void;
  onSwipeStart?: () => void;
  onSwipeEnd?: () => void;
}

export const TabsCarousel = React.forwardRef<unknown, TabsCarouselProps>((props, ref) => {
  const {
    children,
    className,
    style,
    swipeable = false,
    onSettle,
    onSwipeStart,
    onSwipeEnd,
    ...nativeProps
  } = props;
  const classNames = useClassNames();
  const contextValue = React.useMemo<TabsCarouselContextValue>(
    () => ({ swipeable, onSettle, onSwipeStart, onSwipeEnd }),
    [swipeable, onSettle, onSwipeStart, onSwipeEnd],
  );

  return (
    <TabsCarouselContext.Provider value={contextValue}>
      <view
        {...(ref ? { ref: ref as LynxViewRef } : {})}
        {...nativeProps}
        className={clsx(classNames.carousel, className)}
        style={style}
      >
        {children}
      </view>
    </TabsCarouselContext.Provider>
  );
});
TabsCarousel.displayName = "TabsCarousel";

////////////////////////////////////////////////////////////////////////////////////

export interface TabsCarouselCameraProps
  extends Omit<
    NativeViewPagerProps,
    | "children"
    | "className"
    | "style"
    | "enable-scroll"
    | "initial-select-index"
    | "bindchange"
    | "bindwillchange"
    | "bindoffsetchange"
  > {
  children?: React.ReactNode;
  className?: string;
  style?: LynxStyle;
  bindchange?: NativeViewPagerProps["bindchange"];
  bindwillchange?: NativeViewPagerProps["bindwillchange"];
  bindoffsetchange?: NativeViewPagerProps["bindoffsetchange"];
}

export const TabsCarouselCamera = React.forwardRef<unknown, TabsCarouselCameraProps>(
  (props, ref) => {
    const {
      children,
      className,
      style,
      bindchange,
      bindwillchange,
      bindoffsetchange,
      ...nativeProps
    } = props;
    const classNames = useClassNames();
    const tabsContext = useTabsContext("TabsCarouselCamera");
    const carouselContext = useTabsCarouselContext("TabsCarouselCamera");
    const swipingRef = React.useRef(false);

    const mergedRef = React.useCallback(
      (node: NodesRef | null) => {
        tabsContext.setPagerRef(node);
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref, tabsContext.setPagerRef],
    );

    const handleWillChange = React.useCallback(
      (event: ViewPagerWillChangeEvent) => {
        "background only";
        bindwillchange?.(event);
        if (event.detail.isDragged && !swipingRef.current) {
          swipingRef.current = true;
          carouselContext.onSwipeStart?.();
        }
      },
      [bindwillchange, carouselContext.onSwipeStart],
    );

    const handleChange = React.useCallback(
      (event: ViewPagerChangeEvent) => {
        "background only";
        bindchange?.(event);
        tabsContext.handlePagerChange(event.detail.index);
        carouselContext.onSettle?.();
        if (swipingRef.current || event.detail.isDragged) {
          swipingRef.current = false;
          carouselContext.onSwipeEnd?.();
        }
      },
      [
        bindchange,
        carouselContext.onSettle,
        carouselContext.onSwipeEnd,
        tabsContext.handlePagerChange,
      ],
    );

    const handleOffsetChange = React.useCallback(
      (event: ViewPagerOffsetChangeEvent) => {
        "background only";
        bindoffsetchange?.(event);
        tabsContext.handlePagerOffsetChange(Number(event.detail.offset));
      },
      [bindoffsetchange, tabsContext.handlePagerOffsetChange],
    );

    return (
      <viewpager
        ref={mergedRef}
        {...nativeProps}
        initial-select-index={Math.max(0, tabsContext.selectedIndex)}
        enable-scroll={carouselContext.swipeable}
        bindwillchange={handleWillChange}
        bindchange={handleChange}
        bindoffsetchange={handleOffsetChange}
        className={clsx(classNames.carouselCamera, className)}
        style={style}
      >
        {children}
      </viewpager>
    );
  },
);
TabsCarouselCamera.displayName = "TabsCarouselCamera";
