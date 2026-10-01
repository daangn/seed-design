import * as React from "@lynx-js/react";
import type { IntrinsicElements, MainThread, NodesRef } from "@lynx-js/types";
import { runOnMainThread } from "@lynx-js/react";
import { useTabsContext } from "./useTabsContext.js";
import { getTabsLayoutWidth, getTabsScrollOffset } from "./Tabs.utils.js";
type NativeViewProps = IntrinsicElements["view"];
type LayoutChangeHandler = NonNullable<NativeViewProps["bindlayoutchange"]>;
type NativeScrollViewProps = IntrinsicElements["scroll-view"];
type ScrollViewLayoutChangeHandler = NonNullable<NativeScrollViewProps["bindlayoutchange"]>;
type ScrollViewHandler = NonNullable<NativeScrollViewProps["bindscroll"]>;
type ContentSizeChangedHandler = NonNullable<NativeScrollViewProps["bindcontentsizechanged"]>;

type ComputedStyleElement = MainThread.Element & {
  getComputedStyleProperty?: (name: string) => string;
};

interface TabsContentInsets {
  start: number;
  end: number;
}

interface TabsScrollMetrics {
  currentOffset: number;
  viewportWidth: number | null;
  contentWidth: number | null;
  insets: TabsContentInsets | null;
}

function getTabsContentInsets(
  contentRef: React.RefObject<ComputedStyleElement | null>,
): TabsContentInsets | null {
  "main thread";

  const content = contentRef.current;
  if (!content || typeof content.getComputedStyleProperty !== "function") return null;
  // Read used values so Rootage tokens and consumer style overrides share the
  // same scroll-content origin as the trigger rectangles; do not invent a fallback.

  const start = Number.parseFloat(content.getComputedStyleProperty("padding-left"));
  const end = Number.parseFloat(content.getComputedStyleProperty("padding-right"));
  if (!Number.isFinite(start) || !Number.isFinite(end) || start < 0 || end < 0) return null;
  return { start, end };
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
function getTabsTriggerValues(children: React.ReactNode): string[] {
  const values: string[] = [];

  function visit(node: React.ReactNode) {
    if (Array.isArray(node)) {
      node.forEach(visit);
      return;
    }
    if (!React.isValidElement<{ value?: string; children?: React.ReactNode }>(node)) return;
    if (typeof node.props.value === "string") {
      values.push(node.props.value);
      return;
    }
    if (node.type === React.Fragment) visit(node.props.children);
  }

  visit(children);
  return values;
}

export interface UseTabsListProps {
  children?: React.ReactNode;
  /** @platform Lynx React의 fixed-padding reveal과 달리 정렬 방식을 지정합니다. */
  scrollAlign?: "nearest" | "start" | "center" | "end";
}
export function useTabsList({ children, scrollAlign = "start" }: UseTabsListProps) {
  const { items, syncTriggerOrder, triggerRects, value } = useTabsContext();
  const scrollRef = React.useRef<NodesRef | null>(null);
  const contentRef = React.useMainThreadRef<ComputedStyleElement | null>(null);
  const metricsRef = React.useRef<TabsScrollMetrics>({
    currentOffset: 0,
    viewportWidth: null,
    contentWidth: null,
    insets: null,
  });
  const contentInsetRequestRef = React.useRef(0);
  const selectedValueRef = React.useRef(value);
  const [geometryRevision, setGeometryRevision] = React.useState(0);
  const triggerOrder = React.useMemo(() => getTabsTriggerValues(children), [children]);

  selectedValueRef.current = value;

  React.useEffect(() => {
    "background only";
    syncTriggerOrder(triggerOrder);
  }, [items, syncTriggerOrder, triggerOrder]);

  const requestContentInsets = React.useCallback(() => {
    "background only";
    const request = ++contentInsetRequestRef.current;
    metricsRef.current.insets = null;

    void runOnMainThread<TabsContentInsets | null, typeof getTabsContentInsets>(
      getTabsContentInsets,
    )(contentRef).then(
      (insets) => {
        "background only";
        if (request !== contentInsetRequestRef.current || !insets) return;

        metricsRef.current.insets = insets;
        setGeometryRevision((revision) => revision + 1);
      },
      () => {
        // Missing native measurement intentionally leaves alignment pending.
      },
    );
  }, [contentRef]);

  const handleListLayoutChange = React.useCallback<ScrollViewLayoutChangeHandler>((event) => {
    "background only";
    const width = getTabsLayoutWidth(event);
    if (width !== null && width > 0 && metricsRef.current.viewportWidth !== width) {
      metricsRef.current.viewportWidth = width;
      setGeometryRevision((revision) => revision + 1);
    }
  }, []);

  const handleContentLayoutChange = React.useCallback<LayoutChangeHandler>(
    (event) => {
      "background only";
      const width = getTabsLayoutWidth(event);
      if (width !== null && width > 0 && metricsRef.current.contentWidth !== width) {
        // Layout width is the ListContent border box until scrollWidth reports
        // the scroll-view content width; the latter replaces this value below.
        metricsRef.current.contentWidth = width;
        setGeometryRevision((revision) => revision + 1);
      }
      requestContentInsets();
    },
    [requestContentInsets],
  );

  const updateScrollMetrics = React.useCallback(
    (scrollLeft: number, scrollWidth: number) => {
      "background only";
      if (Number.isFinite(scrollLeft)) metricsRef.current.currentOffset = Math.max(0, scrollLeft);
      if (
        Number.isFinite(scrollWidth) &&
        scrollWidth > 0 &&
        metricsRef.current.contentWidth !== scrollWidth
      ) {
        metricsRef.current.contentWidth = scrollWidth;
        requestContentInsets();
        setGeometryRevision((revision) => revision + 1);
      }
    },
    [requestContentInsets],
  );

  const handleScroll = React.useCallback<ScrollViewHandler>(
    (event) => {
      "background only";
      updateScrollMetrics(event.detail.scrollLeft, event.detail.scrollWidth);
    },
    [updateScrollMetrics],
  );

  const handleContentSizeChanged = React.useCallback<ContentSizeChangedHandler>(
    (event) => {
      "background only";
      updateScrollMetrics(event.detail.scrollLeft, event.detail.scrollWidth);
    },
    [updateScrollMetrics],
  );

  React.useEffect(() => {
    "background only";
    const selectedRect = value === undefined ? undefined : triggerRects[value];
    const { currentOffset, viewportWidth, contentWidth, insets } = metricsRef.current;
    if (
      !scrollRef.current ||
      value === undefined ||
      !selectedRect ||
      viewportWidth === null ||
      contentWidth === null ||
      insets === null
    ) {
      return;
    }

    const targetOffset = getTabsScrollOffset({
      scrollAlign,
      currentOffset,
      viewportWidth,
      contentWidth,
      contentInsetStart: insets.start,
      contentInsetEnd: insets.end,
      triggerRect: selectedRect,
    });
    if (selectedValueRef.current !== value || targetOffset === currentOffset) return;

    invokeScrollToOffset(scrollRef.current, targetOffset);
  }, [geometryRevision, items, scrollAlign, triggerRects, value]);

  return React.useMemo(
    () => ({
      listProps: {
        ref: scrollRef,
        bindlayoutchange: handleListLayoutChange,
        bindscroll: handleScroll,
        bindcontentsizechanged: handleContentSizeChanged,
        "scroll-orientation": "horizontal" as const,
        "scroll-bar-enable": false,
        "accessibility-element": false,
        "accessibility-traits": "tabbar" as const,
      },
      listContentProps: {
        "main-thread:ref": contentRef,
        bindlayoutchange: handleContentLayoutChange,
      },
    }),
    [
      contentRef,
      handleListLayoutChange,
      handleScroll,
      handleContentSizeChanged,
      handleContentLayoutChange,
    ],
  );
}
export type UseTabsListReturn = ReturnType<typeof useTabsList>;
