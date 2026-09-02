import { tabs, type TabsVariantProps } from "@seed-design/lynx-css/recipes/tabs";
import * as React from "@lynx-js/react";
import type {
  IntrinsicElements,
  MainThread,
  NodesRef,
  ViewPagerChangeEvent,
  ViewPagerOffsetChangeEvent,
  ViewPagerWillChangeEvent,
} from "@lynx-js/types";
import clsx from "clsx";

import { useControllableState } from "../../hooks/useControllableState";
import { usePressTap } from "../../hooks/usePressTap";
import type {
  LynxAccessibilityProps,
  LynxStyledElementProps,
  LynxViewProps,
  LynxViewRef,
} from "../../types";
import { createSlotRecipeContext } from "../../utils/create-slot-recipe-context";
import {
  getTabsLayoutWidth,
  getTabsOrderedItems,
  getTabsTriggerRects,
  type TabsLayoutRect,
} from "./Tabs.utils";

type NativeViewProps = IntrinsicElements["view"];
type NativeViewPagerProps = IntrinsicElements["viewpager"];
type LayoutChangeHandler = NonNullable<NativeViewProps["bindlayoutchange"]>;
type TriggerRect = TabsLayoutRect;
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

function invokeScrollToOffset(list: NodesRef | null, offset: number) {
  "background only";
  if (!list || offset < 0) return;
  try {
    list.invoke({ method: "scrollTo", params: { offset, smooth: true } }).exec();
  } catch {
    // ReactLynx Testing Library의 NodesRef는 UI method를 구현하지 않는다.
  }
}

interface TabsContextValue {
  value: string | undefined;
  visualValue: string | undefined;
  variantProps: TabsPublicVariantProps;
  items: TriggerItem[];
  pagerValues: string[];
  indicatorIndex: number;
  selectedPagerIndex: number;
  indicatorRef: React.RefObject<MainThread.Element>;
  triggerRects: Record<string, TriggerRect>;
  transitionsEnabled: boolean;
  registerTrigger: (value: string, disabled: boolean) => () => void;
  registerContent: (value: string) => () => void;
  updateTriggerDisabled: (value: string, disabled: boolean) => void;
  syncTriggerOrder: (values: string[]) => void;
  updateTriggerWidth: (value: string, width: number) => void;
  setListRef: (ref: NodesRef | null) => void;
  setPagerRef: (ref: NodesRef | null) => void;
  selectValue: (value: string) => void;
  handlePagerWillChange: (index: number) => void;
  handlePagerChange: (index: number) => void;
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
  iosBackGestureEdgeWidth: number;
  onSettle?: () => void;
  onSwipeStart?: () => void;
  onSwipeEnd?: () => void;
}

const TabsCarouselContext = React.createContext<TabsCarouselContextValue | null>(null);
const TabsCarouselCameraContext = React.createContext<boolean | null>(null);

function useTabsCarouselCameraContext() {
  return React.useContext(TabsCarouselCameraContext) ?? false;
}

function useTabsCarouselContext(consumer: string) {
  const context = React.useContext(TabsCarouselContext);
  if (!context) {
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
export interface TabsRootProps extends TabsPublicVariantProps, LynxStyledElementProps {
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
  const [contentValues, setContentValues] = React.useState<string[]>([]);
  const [indicatorValue, setIndicatorValue] = React.useState<string | undefined>();
  const [triggerWidths, setTriggerWidths] = React.useState<Record<string, number>>({});
  const [transitionsEnabled, setTransitionsEnabled] = React.useState(false);
  const listRef = React.useRef<NodesRef | null>(null);
  const pagerRef = React.useRef<NodesRef | null>(null);
  const indicatorRef = React.useMainThreadRef<MainThread.Element>(null);

  const pagerValues = React.useMemo(
    () =>
      contentValues.filter(
        (contentValue) => !items.find((item) => item.value === contentValue)?.disabled,
      ),
    [contentValues, items],
  );
  const triggerRects = React.useMemo(
    () =>
      getTabsTriggerRects(
        items.map((item) => item.value),
        triggerWidths,
      ),
    [items, triggerWidths],
  );
  const visualValue = indicatorValue ?? value;
  const indicatorIndex = items.findIndex((item) => item.value === visualValue);
  const selectedPagerIndex = value === undefined ? -1 : pagerValues.indexOf(value);
  const selectedRect = value === undefined ? undefined : triggerRects[value];
  const selectedOffset = selectedRect?.left ?? null;

  const setListNode = React.useCallback(
    (node: NodesRef | null) => {
      listRef.current = node;
      if (node && selectedOffset !== null) invokeScrollToOffset(node, selectedOffset);
    },
    [selectedOffset],
  );

  const setPagerNode = React.useCallback(
    (node: NodesRef | null) => {
      pagerRef.current = node;
      if (node && selectedPagerIndex >= 0) invokeSelectTab(node, selectedPagerIndex, false);
    },
    [selectedPagerIndex],
  );

  const registerTrigger = React.useCallback((triggerValue: string, disabled: boolean) => {
    setItems((current) => {
      if (current.some((item) => item.value === triggerValue)) return current;
      return [...current, { value: triggerValue, disabled }];
    });

    return () => {
      "background only";
      setItems((current) => current.filter((item) => item.value !== triggerValue));
      setTriggerWidths((current) => {
        const next = { ...current };
        delete next[triggerValue];
        return next;
      });
    };
  }, []);

  const registerContent = React.useCallback((contentValue: string) => {
    setContentValues((current) =>
      current.includes(contentValue) ? current : [...current, contentValue],
    );

    return () => {
      "background only";
      setContentValues((current) => current.filter((value) => value !== contentValue));
    };
  }, []);

  const updateTriggerDisabled = React.useCallback((triggerValue: string, disabled: boolean) => {
    setItems((current) =>
      current.map((item) =>
        item.value === triggerValue && item.disabled !== disabled ? { ...item, disabled } : item,
      ),
    );
  }, []);

  const syncTriggerOrder = React.useCallback((triggerValues: string[]) => {
    setItems((current) => {
      const ordered = getTabsOrderedItems(current, triggerValues);
      return ordered.every((item, index) => item === current[index]) ? current : ordered;
    });
  }, []);

  const updateTriggerWidth = React.useCallback((triggerValue: string, width: number) => {
    setTriggerWidths((current) =>
      current[triggerValue] === width ? current : { ...current, [triggerValue]: width },
    );
  }, []);

  const selectValue = React.useCallback(
    (nextValue: string) => {
      setIndicatorValue(undefined);
      setValueInternal(nextValue);
    },
    [setValueInternal],
  );

  const handlePagerWillChange = React.useCallback(
    (targetIndex: number) => {
      setIndicatorValue(pagerValues[targetIndex]);
    },
    [pagerValues],
  );

  const handlePagerChange = React.useCallback(
    (targetIndex: number) => {
      const nextValue = pagerValues[targetIndex];
      if (nextValue === undefined) return;
      setIndicatorValue(undefined);
      setValueInternal(nextValue);
    },
    [pagerValues, setValueInternal],
  );

  React.useEffect(() => {
    "background only";
    if (selectedPagerIndex >= 0) {
      invokeSelectTab(pagerRef.current, selectedPagerIndex, false);
    }
    if (selectedOffset !== null) invokeScrollToOffset(listRef.current, selectedOffset);
  }, [selectedPagerIndex, selectedOffset]);

  React.useEffect(() => {
    "background only";
    if (
      !transitionsEnabled &&
      items.length > 0 &&
      items.every((item) => triggerRects[item.value] !== undefined)
    ) {
      setTransitionsEnabled(true);
    }
  }, [items, transitionsEnabled, triggerRects]);

  const contextValue = React.useMemo<TabsContextValue>(
    () => ({
      value,
      visualValue,
      variantProps,
      items,
      pagerValues,
      indicatorIndex,
      selectedPagerIndex,
      indicatorRef,
      transitionsEnabled,
      triggerRects,
      registerTrigger,
      registerContent,
      updateTriggerDisabled,
      syncTriggerOrder,
      updateTriggerWidth,
      setListRef: setListNode,
      setPagerRef: setPagerNode,
      selectValue,
      handlePagerWillChange,
      handlePagerChange,
    }),
    [
      value,
      visualValue,
      variantProps,
      items,
      pagerValues,
      indicatorIndex,
      selectedPagerIndex,
      indicatorRef,
      triggerRects,
      transitionsEnabled,
      registerTrigger,
      registerContent,
      updateTriggerDisabled,
      syncTriggerOrder,
      updateTriggerWidth,
      setListNode,
      setPagerNode,
      selectValue,
      handlePagerWillChange,
      handlePagerChange,
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

function getTabsTriggerValues(children: React.ReactNode): string[] {
  const values: string[] = [];

  function visit(node: React.ReactNode) {
    if (Array.isArray(node)) {
      node.forEach(visit);
      return;
    }
    if (!React.isValidElement<TabsTriggerProps>(node)) return;
    if (node.type === TabsTrigger) {
      values.push(node.props.value);
      return;
    }
    if (node.type === React.Fragment) visit(node.props.children);
  }

  visit(children);
  return values;
}

export interface TabsListProps extends LynxStyledElementProps {}

export const TabsList = React.forwardRef<unknown, TabsListProps>((props, ref) => {
  const { children, className, style, ...nativeProps } = props;
  const classNames = useClassNames();
  const { items, setListRef, syncTriggerOrder } = useTabsContext("TabsList");
  const triggerOrder = React.useMemo(() => getTabsTriggerValues(children), [children]);

  React.useEffect(() => {
    "background only";
    syncTriggerOrder(triggerOrder);
  }, [items, syncTriggerOrder, triggerOrder]);

  const mergedRef = React.useCallback(
    (node: NodesRef | null) => {
      setListRef(node);
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref, setListRef],
  );

  return (
    <scroll-view
      ref={mergedRef}
      {...nativeProps}
      scroll-orientation="horizontal"
      scroll-bar-enable={false}
      accessibility-element={false}
      accessibility-traits="tabbar"
      className={clsx(classNames.list, className)}
      style={style}
    >
      <view className={classNames.listContent}>{children}</view>
    </scroll-view>
  );
});
TabsList.displayName = "TabsList";

////////////////////////////////////////////////////////////////////////////////////

export interface TabsTriggerProps extends LynxStyledElementProps {
  value: string;
  disabled?: boolean;
  "accessibility-label"?: LynxAccessibilityProps["accessibility-label"];
}

export const TabsTrigger = React.forwardRef<unknown, TabsTriggerProps>((props, ref) => {
  const {
    children,
    className,
    style,
    value: triggerValue,
    disabled = false,
    "accessibility-label": accessibilityLabel,
    ...nativeProps
  } = props;
  const context = useTabsContext("TabsTrigger");
  const selected = context.value === triggerValue;
  const visuallySelected = context.visualValue === triggerValue;

  React.useEffect(() => {
    "background only";
    return context.registerTrigger(triggerValue, disabled);
  }, [context.registerTrigger, triggerValue]);

  React.useEffect(() => {
    "background only";
    context.updateTriggerDisabled(triggerValue, disabled);
  }, [context.updateTriggerDisabled, triggerValue, disabled]);

  const handleTap = React.useCallback<NonNullable<NativeViewProps["bindtap"]>>(() => {
    "background only";
    context.selectValue(triggerValue);
  }, [context.selectValue, triggerValue]);
  const { pressed: _pressed, ...pressHandlers } = usePressTap({ disabled, onTap: handleTap });

  const handleLayoutChange = React.useCallback<LayoutChangeHandler>(
    (...args) => {
      "background only";
      const width = getTabsLayoutWidth(args[0]);
      if (width !== null) context.updateTriggerWidth(triggerValue, width);
    },
    [context.updateTriggerWidth, triggerValue],
  );

  const triggerClasses = tabs({
    ...context.variantProps,
    selected: visuallySelected,
    disabled,
  });
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
      <text
        className={triggerClasses.triggerLabel}
        style={context.transitionsEnabled ? undefined : { transitionDuration: "0s" }}
      >
        {children}
      </text>
    </view>
  );
});
TabsTrigger.displayName = "TabsTrigger";

////////////////////////////////////////////////////////////////////////////////////

export interface TabsIndicatorProps extends LynxStyledElementProps {}

export const TabsIndicator = React.forwardRef<unknown, TabsIndicatorProps>((props, ref) => {
  const { className, style, ...nativeProps } = props;
  const classNames = useClassNames();
  const { indicatorRef, items, indicatorIndex, transitionsEnabled, triggerRects } =
    useTabsContext("TabsIndicator");
  const position = indicatorIndex;
  const lowerIndex = Math.max(0, Math.floor(position));
  const upperIndex = Math.min(items.length - 1, Math.ceil(position));
  const progress = Math.max(0, Math.min(1, position - lowerIndex));
  const lowerRect = triggerRects[items[lowerIndex]?.value ?? ""];
  const upperRect = triggerRects[items[upperIndex]?.value ?? ""] ?? lowerRect;
  const x = lowerRect
    ? lowerRect.left + ((upperRect?.left ?? lowerRect.left) - lowerRect.left) * progress
    : 0;
  const width = lowerRect
    ? lowerRect.width + ((upperRect?.width ?? lowerRect.width) - lowerRect.width) * progress
    : 0;

  return (
    <view
      {...(ref ? { ref: ref as LynxViewRef } : {})}
      main-thread:ref={indicatorRef}
      {...nativeProps}
      accessibility-elements-hidden={true}
      className={clsx(classNames.indicator, className)}
      style={
        {
          "--tabs-indicator-x": `${x}px`,
          "--tabs-indicator-width": `${width}px`,
          ...style,
          ...(transitionsEnabled ? {} : { transitionDuration: "0s" }),
        } as LynxViewProps["style"]
      }
    />
  );
});
TabsIndicator.displayName = "TabsIndicator";

////////////////////////////////////////////////////////////////////////////////////

export interface TabsContentProps extends LynxStyledElementProps {
  value: string;
}

export const TabsContent = React.forwardRef<unknown, TabsContentProps>((props, ref) => {
  const { children, className, style, value: contentValue, ...nativeProps } = props;
  const tabsContext = useTabsContext("TabsContent");
  const inCarousel = useTabsCarouselCameraContext();
  const selected = tabsContext.value === contentValue;
  const disabled = tabsContext.items.find((item) => item.value === contentValue)?.disabled ?? false;
  const contentClasses = tabs({ ...tabsContext.variantProps, selected, inCarousel });

  React.useEffect(() => {
    "background only";
    if (inCarousel) return tabsContext.registerContent(contentValue);
  }, [inCarousel, tabsContext.registerContent, contentValue]);

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
    if (disabled) return null;
    return <viewpager-item>{content}</viewpager-item>;
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
export interface TabsCarouselProps extends LynxStyledElementProps {
  swipeable?: boolean;
  /** iOS 뒤로가기 제스처를 우선하는 화면 왼쪽 가장자리 너비입니다. */
  iosBackGestureEdgeWidth?: number;
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
    iosBackGestureEdgeWidth = 32,
    onSettle,
    onSwipeStart,
    onSwipeEnd,
    ...nativeProps
  } = props;
  const classNames = useClassNames();
  const contextValue = React.useMemo<TabsCarouselContextValue>(
    () => ({ swipeable, iosBackGestureEdgeWidth, onSettle, onSwipeStart, onSwipeEnd }),
    [swipeable, iosBackGestureEdgeWidth, onSettle, onSwipeStart, onSwipeEnd],
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

export interface TabsCarouselCameraProps extends LynxStyledElementProps {
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
    const { indicatorRef, pagerValues, triggerRects } = tabsContext;
    const indicatorRects = pagerValues.map((value) => triggerRects[value] ?? null);

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
        if (event.detail.isDragged) {
          tabsContext.handlePagerWillChange(event.detail.index);
          if (!swipingRef.current) {
            swipingRef.current = true;
            carouselContext.onSwipeStart?.();
          }
        }
      },
      [bindwillchange, carouselContext.onSwipeStart, tabsContext.handlePagerWillChange],
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
      },
      [bindoffsetchange],
    );

    function handleIndicatorOffsetChange(event: ViewPagerOffsetChangeEvent) {
      "main thread";

      const position = Number(event.detail.offset);
      if (!Number.isFinite(position)) return;

      const lowerIndex = Math.max(0, Math.floor(position));
      const upperIndex = Math.min(indicatorRects.length - 1, Math.ceil(position));
      const progress = Math.max(0, Math.min(1, position - lowerIndex));
      const lowerRect = indicatorRects[lowerIndex];
      const upperRect = indicatorRects[upperIndex] ?? lowerRect;
      if (!lowerRect) return;

      const x = lowerRect.left + ((upperRect?.left ?? lowerRect.left) - lowerRect.left) * progress;
      const width =
        lowerRect.width + ((upperRect?.width ?? lowerRect.width) - lowerRect.width) * progress;

      indicatorRef.current?.setStyleProperties({
        "--tabs-indicator-x": `${x}px`,
        "--tabs-indicator-width": `${width}px`,
      });
    }

    return (
      <viewpager
        ref={mergedRef}
        {...nativeProps}
        initial-select-index={Math.max(0, tabsContext.selectedPagerIndex)}
        enable-scroll={carouselContext.swipeable}
        ios-gesture-offset={carouselContext.iosBackGestureEdgeWidth}
        bindwillchange={handleWillChange}
        bindchange={handleChange}
        bindoffsetchange={handleOffsetChange}
        main-thread:bindoffsetchange={handleIndicatorOffsetChange}
        className={clsx(classNames.carouselCamera, className)}
        style={style}
      >
        <TabsCarouselCameraContext.Provider value={true}>
          {children}
        </TabsCarouselCameraContext.Provider>
      </viewpager>
    );
  },
);
TabsCarouselCamera.displayName = "TabsCarouselCamera";
