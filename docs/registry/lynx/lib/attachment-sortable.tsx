import * as React from "@lynx-js/react";
import { runOnBackground, runOnMainThread, useCallback, useMainThreadRef } from "@lynx-js/react";

type ViewProps = React.JSX.IntrinsicElements["view"];
type TouchDragEvent = Parameters<NonNullable<ViewProps["main-thread:bindtouchmove"]>>[0];
type MouseDragEvent = Parameters<NonNullable<ViewProps["main-thread:bindmousemove"]>>[0];
type DragPointEvent = TouchDragEvent | MouseDragEvent;
type ScrollViewProps = React.JSX.IntrinsicElements["scroll-view"];
type ScrollEvent = Pick<Parameters<NonNullable<ScrollViewProps["bindscroll"]>>[0], "detail">;

type Rect = { left: number; top: number; width: number; height: number };
type DragLayout = { itemId: string; generation: number; rect: Rect; offsetX: number };
type RectMeasurement = Partial<Rect>;
type ScrollByResult = {
  consumedX?: number;
  unconsumedX?: number;
  detail?: { consumedX?: number; unconsumedX?: number };
};
type ScrollInfo = { scrollX?: number; scrollY?: number; scrollRange?: number };
type DragState = {
  activeId: string;
  from: number;
  target: number;
  startX: number;
  pointerX: number;
  scrollLeft: number;
  scrollCompensation: number;
  lastMoveTimestamp: number;
  generation: number;
  pendingMeasurements: number;
  ready: boolean;
  dragging: boolean;
};

export interface HorizontalReorderListProps<T> {
  items: readonly T[];
  getItemKey: (item: T, index: number) => string;
  disabled?: boolean;
  readOnly?: boolean;
  id?: string;
  scrollableBoundaryId: string;
  scrollEdgeOffset?: number;
  onReorder: (fromIndex: number, toIndex: number) => void;
  onDragStateChange?: (dragging: boolean) => void;
  children: (props: {
    onScroll: (event: ScrollEvent) => void;
    dragging: boolean;
  }) => React.ReactNode;
}

interface ReorderContextValue {
  itemIds: readonly string[];
  rootId: string;
  boundaryId: string;
  disabled: boolean;
  reducedMotion: boolean;
  draggingItemId: string | null;
  dragLayout: DragLayout | null;
  onDragReady: (itemId: string, generation: number) => void;
  onScroll: (event: ScrollEvent) => void;
  onDragStart: (itemId: string, index: number, event: DragPointEvent) => void;
  onDragMove: (event: DragPointEvent) => void;
  onDragEnd: () => void;
  onDragCancel: () => void;
}
let nextHorizontalReorderListId = 0;

const ReorderContext = React.createContext<ReorderContextValue | null>(null);

function encodeIdPart(value: string) {
  "main thread";
  let encoded = "";
  for (let index = 0; index < value.length; index += 1) {
    encoded += value.charCodeAt(index).toString(16).padStart(4, "0");
  }
  return encoded || "empty";
}

function escapeSelectorId(value: string) {
  "main thread";
  return value.replace(/([!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~])/g, "\\$1");
}

function getItemDomId(rootId: string, itemId: string) {
  "main thread";
  return `${rootId}-item-${encodeIdPart(itemId)}`;
}

function getPageX(event: DragPointEvent) {
  "main thread";
  if ("touches" in event) return event.touches[0]?.pageX ?? event.detail.x;
  return event.pageX;
}

function sameIds(first: readonly string[], second: readonly string[]) {
  "main thread";
  if (first.length !== second.length) return false;
  for (let index = 0; index < first.length; index += 1) {
    if (first[index] !== second[index]) return false;
  }
  return true;
}

function encodeIdPartForBackground(value: string) {
  let encoded = "";
  for (let index = 0; index < value.length; index += 1) {
    encoded += value.charCodeAt(index).toString(16).padStart(4, "0");
  }
  return encoded || "empty";
}

function getBackgroundItemDomId(rootId: string, itemId: string) {
  return `${rootId}-item-${encodeIdPartForBackground(itemId)}`;
}

function escapeSelectorIdForBackground(value: string) {
  return value.replace(/([!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~])/g, "\\$1");
}

function setItemTransform(id: string, x: number, y = 0) {
  "main thread";
  lynx
    .querySelector(`#${escapeSelectorId(id)}`)
    ?.setStyleProperty("transform", `translate(${x}px, ${y}px)`);
}

function resetItemTransforms(rootId: string, ids: readonly string[], activeItemId: string) {
  "main thread";
  for (const itemId of ids) {
    if (itemId === activeItemId) continue;
    lynx.querySelector(`#${escapeSelectorId(getItemDomId(rootId, itemId))}`)?.setStyleProperties({
      transition: "none",
      transform: "translate(0px, 0px)",
    });
  }
}

function commitItemOrder(
  rootId: string,
  ids: readonly string[],
  fromIndex: number,
  toIndex: number,
) {
  "main thread";
  const activeId = getItemDomId(rootId, ids[fromIndex]);
  lynx
    .querySelector(`#${escapeSelectorId(`${activeId}-placeholder`)}`)
    ?.setStyleProperty("display", "none");
  for (let index = 0; index < ids.length; index += 1) {
    const element = lynx.querySelector(`#${escapeSelectorId(getItemDomId(rootId, ids[index]))}`);
    if (!element) continue;
    let order = index;
    if (index === fromIndex) order = toIndex;
    else if (fromIndex < toIndex && index > fromIndex && index <= toIndex) order -= 1;
    else if (toIndex < fromIndex && index >= toIndex && index < fromIndex) order += 1;
    element.setStyleProperties({
      transition: "none",
      order: `${order}`,
      transform: "translate(0px, 0px)",
    });
    if (index === fromIndex) {
      element.setStyleProperties({
        position: "relative",
        left: "0px",
        top: "0px",
        width: "auto",
        height: "auto",
        "z-index": "0",
      });
    }
  }
}

function setScrollEnabled(id: string, enabled: boolean) {
  "main thread";
  lynx.querySelector(`#${escapeSelectorId(id)}`)?.setAttribute("enable-scroll", enabled);
}

function getScrollAfter(result: ScrollByResult | null, previous: number) {
  "main thread";
  const consumed = result?.consumedX ?? result?.detail?.consumedX;
  return typeof consumed === "number" ? previous + consumed : null;
}

export function HorizontalReorderItem({
  itemId,
  index,
  children,
}: {
  itemId: string;
  index: number;
  children: (dragging: boolean) => React.ReactNode;
}) {
  const context = React.useContext(ReorderContext);
  if (!context)
    throw new Error("HorizontalReorderItem must be rendered inside HorizontalReorderList");
  const dragging = context.draggingItemId === itemId;
  const layout = dragging && context.dragLayout?.itemId === itemId ? context.dragLayout : null;
  const itemDomId = getBackgroundItemDomId(context.rootId, itemId);
  React.useEffect(() => {
    if (layout) runOnMainThread(context.onDragReady)(itemId, layout.generation);
  }, [context.onDragReady, itemId, layout]);
  const onDragStart = useCallback(
    (event: DragPointEvent) => {
      "main thread";
      context.onDragStart(itemId, index, event);
    },
    [context, index, itemId],
  );
  const onDragMove = useCallback(
    (event: DragPointEvent) => {
      "main thread";
      context.onDragMove(event);
    },
    [context],
  );
  const onDragEnd = useCallback(() => {
    "main thread";
    context.onDragEnd();
  }, [context]);
  const onDragCancel = useCallback(() => {
    "main thread";
    context.onDragCancel();
  }, [context]);
  return (
    <>
      {layout ? (
        <view
          key="placeholder"
          id={`${itemDomId}-placeholder`}
          accessibility-elements-hidden={true}
          style={{
            width: `${layout.rect.width}px`,
            height: `${layout.rect.height}px`,
            flexShrink: 0,
            order: index,
          }}
        />
      ) : null}
      <view
        key="item"
        id={itemDomId}
        ios-enable-simultaneous-touch={true}
        main-thread:bindlongpress={context.disabled ? undefined : onDragStart}
        main-thread:bindmouselongpress={context.disabled ? undefined : onDragStart}
        main-thread:bindtouchmove={context.disabled ? undefined : onDragMove}
        main-thread:bindtouchend={context.disabled ? undefined : onDragEnd}
        main-thread:bindtouchcancel={context.disabled ? undefined : onDragCancel}
        main-thread:bindmousemove={context.disabled ? undefined : onDragMove}
        main-thread:bindmouseup={context.disabled ? undefined : onDragEnd}
        style={{
          flexShrink: 0,
          order: index,
          overflow: "visible",
          // Keep the same item instance; a fixed view does not inherit scroll offsets.
          position: layout ? "fixed" : "relative",
          left: layout ? 0 : undefined,
          top: layout ? 0 : undefined,
          width: layout ? `${layout.rect.width}px` : "auto",
          height: layout ? `${layout.rect.height}px` : "auto",
          transition:
            context.draggingItemId !== null && !dragging && !context.reducedMotion
              ? "transform 250ms cubic-bezier(0.25, 1, 0.5, 1)"
              : "none",
          transform: layout
            ? `translate(${layout.rect.left + layout.offsetX}px, ${layout.rect.top}px)`
            : "translate(0px, 0px)",
          zIndex: layout ? 10000 : 0,
        }}
      >
        {children(dragging)}
      </view>
    </>
  );
}

export function HorizontalReorderList<T>({
  items,
  getItemKey,
  disabled = false,
  readOnly = false,
  id,
  scrollableBoundaryId,
  scrollEdgeOffset = 24,
  onReorder,
  onDragStateChange,
  children,
}: HorizontalReorderListProps<T>) {
  const [instanceId] = React.useState(() => {
    nextHorizontalReorderListId += 1;
    return nextHorizontalReorderListId;
  });
  const rootId = id ?? `attachment-reorder-${instanceId}`;
  const itemIds = React.useMemo(
    () => items.map((item, index) => getItemKey(item, index)),
    [getItemKey, items],
  );
  const boundaryId = scrollableBoundaryId;
  const state = useMainThreadRef<DragState>({
    activeId: "",
    from: -1,
    target: -1,
    startX: 0,
    pointerX: 0,
    scrollLeft: 0,
    scrollCompensation: 0,
    lastMoveTimestamp: -1,
    generation: 0,
    pendingMeasurements: 0,
    ready: false,
    dragging: false,
  });
  const rects = useMainThreadRef<Record<string, Rect>>({});
  const boundary = useMainThreadRef<Rect | null>(null);
  const activeIds = useMainThreadRef<string[]>([]);
  const autoScrollOffset = useMainThreadRef(0);
  const autoScrollActive = useMainThreadRef(false);
  const autoScrollFrame = useMainThreadRef<(() => void) | null>(null);
  const [draggingItemId, setDraggingItemId] = React.useState<string | null>(null);
  const [dragLayout, setDragLayout] = React.useState<DragLayout | null>(null);
  const dragGeneration = React.useRef(0);
  const sortingDisabled = disabled || readOnly;
  const globalProps = React.useGlobalProps() as { motion?: unknown } | undefined;
  const reducedMotion = globalProps?.motion === "reduced";
  const onDragStateChangeJS = useCallback(
    (dragging: boolean, itemId: string, generation: number) => {
      "background only";
      if (generation < dragGeneration.current) return;
      dragGeneration.current = generation;
      if (!dragging) setDragLayout(null);
      setDraggingItemId(dragging ? itemId : null);
      onDragStateChange?.(dragging);
    },
    [onDragStateChange],
  );
  const onReorderJS = useCallback(
    (fromIndex: number, toIndex: number, itemId: string, generation: number) => {
      "background only";
      try {
        onReorder(fromIndex, toIndex);
      } finally {
        onDragStateChangeJS(false, itemId, generation);
      }
    },
    [onDragStateChangeJS, onReorder],
  );
  const setDragLayoutJS = useCallback(
    (itemId: string, generation: number, rect: Rect, offsetX: number) => {
      "background only";
      if (generation === dragGeneration.current)
        setDragLayout({ itemId, generation, rect, offsetX });
    },
    [],
  );

  const stopAutoScroll = useCallback(() => {
    "main thread";
    autoScrollActive.current = false;
    autoScrollOffset.current = 0;
  }, [autoScrollActive, autoScrollOffset]);

  const finishDrag = useCallback(
    (cancelled: boolean) => {
      "main thread";
      const current = state.current;
      if (!current.dragging) return;
      const fromIndex = current.from;
      const toIndex = current.target;
      const activeItemId = current.activeId;
      const ids = activeIds.current;
      current.dragging = false;
      current.ready = false;
      current.pendingMeasurements = 0;
      current.generation += 1;
      stopAutoScroll();
      if (!cancelled && sameIds(ids, itemIds) && fromIndex !== toIndex && toIndex >= 0) {
        // Commit the visual order before the background render removes the drag layout.
        commitItemOrder(rootId, ids, fromIndex, toIndex);
        runOnBackground(onReorderJS)(fromIndex, toIndex, activeItemId, current.generation);
      } else {
        resetItemTransforms(rootId, ids, activeItemId);
        runOnBackground(onDragStateChangeJS)(false, activeItemId, current.generation);
      }
      setScrollEnabled(boundaryId, true);
      activeIds.current = [];
    },
    [
      activeIds,
      boundaryId,
      itemIds,
      onDragStateChangeJS,
      onReorderJS,
      rootId,
      state,
      stopAutoScroll,
    ],
  );

  const onMeasurementFailure = useCallback(
    (generation: number) => {
      "main thread";
      if (state.current.dragging && state.current.generation === generation) finishDrag(true);
    },
    [finishDrag, state],
  );
  const acceptMeasurement = useCallback(
    (generation: number, itemId: string, rect: Rect, isBoundary: boolean) => {
      "main thread";
      if (!state.current.dragging || state.current.generation !== generation) return;
      if (isBoundary) boundary.current = rect;
      else rects.current[itemId] = rect;
      state.current.pendingMeasurements -= 1;
      if (state.current.pendingMeasurements === 0) {
        const current = state.current;
        const activeRect = rects.current[current.activeId];
        runOnBackground(setDragLayoutJS)(
          current.activeId,
          generation,
          activeRect,
          current.pointerX - current.startX,
        );
      }
    },
    [boundary, rects, setDragLayoutJS, state],
  );
  const measureInBackground = useCallback(
    (
      generation: number,
      currentRootId: string,
      ids: readonly string[],
      currentBoundaryId: string,
    ) => {
      "background only";
      const measure = (id: string, itemId: string, isBoundary: boolean) => {
        const ref = lynx.createSelectorQuery().select(`#${escapeSelectorIdForBackground(id)}`);
        ref
          .invoke({
            method: "boundingClientRect",
            params: {},
            success: (result: RectMeasurement | null) => {
              if (
                !result ||
                typeof result.left !== "number" ||
                typeof result.top !== "number" ||
                typeof result.width !== "number" ||
                typeof result.height !== "number" ||
                result.width <= 0 ||
                result.height <= 0
              ) {
                runOnMainThread(onMeasurementFailure)(generation);
                return;
              }
              runOnMainThread(acceptMeasurement)(
                generation,
                itemId,
                {
                  left: result.left,
                  top: result.top,
                  width: result.width,
                  height: result.height,
                },
                isBoundary,
              );
            },
            fail: () => {
              runOnMainThread(onMeasurementFailure)(generation);
            },
          })
          .exec();
      };
      for (const itemId of ids)
        measure(getBackgroundItemDomId(currentRootId, itemId), itemId, false);
      measure(currentBoundaryId, "", true);
    },
    [acceptMeasurement, onMeasurementFailure],
  );
  const onScroll = useCallback(
    (event: ScrollEvent) => {
      "main thread";
      const nextScrollLeft = event.detail.scrollLeft;
      const current = state.current;
      if (current.dragging) current.scrollCompensation += nextScrollLeft - current.scrollLeft;
      current.scrollLeft = nextScrollLeft;
    },
    [state],
  );

  const applyDragPosition = useCallback(
    (pageX: number) => {
      "main thread";
      const current = state.current;
      if (!current.dragging || !current.ready || !sameIds(activeIds.current, itemIds)) return;
      const activeRect = rects.current[current.activeId];
      if (!activeRect) return;
      const deltaX = pageX - current.startX;
      const logicalOffset = deltaX + current.scrollCompensation;
      const activeCenter = activeRect.left + activeRect.width / 2 + logicalOffset;
      let target = current.from;
      if (logicalOffset > 0) {
        for (
          let candidate = current.from + 1;
          candidate < activeIds.current.length;
          candidate += 1
        ) {
          const rect = rects.current[activeIds.current[candidate]];
          if (rect && activeCenter > rect.left + rect.width / 2) target = candidate;
        }
      } else if (logicalOffset < 0) {
        for (let candidate = current.from - 1; candidate >= 0; candidate -= 1) {
          const rect = rects.current[activeIds.current[candidate]];
          if (rect && activeCenter < rect.left + rect.width / 2) target = candidate;
        }
      }
      const edgeBoundary = boundary.current;
      let offset = 0;
      if (edgeBoundary) {
        const leftEdge = edgeBoundary.left + scrollEdgeOffset;
        const rightEdge = edgeBoundary.left + edgeBoundary.width - scrollEdgeOffset;
        offset =
          pageX < leftEdge && logicalOffset < 0
            ? -12
            : pageX > rightEdge && logicalOffset > 0
              ? 12
              : 0;
      }
      autoScrollOffset.current = offset;
      autoScrollActive.current = offset !== 0;
      const targetChanged = current.target !== target;
      current.target = target;
      setItemTransform(
        getItemDomId(rootId, current.activeId),
        activeRect.left + deltaX,
        activeRect.top,
      );
      if (!targetChanged) return;
      for (let candidate = 0; candidate < activeIds.current.length; candidate += 1) {
        if (candidate === current.from) continue;
        const candidateId = activeIds.current[candidate];
        const currentRect = rects.current[candidateId];
        if (current.from < target && candidate > current.from && candidate <= target) {
          const previousRect = rects.current[activeIds.current[candidate - 1]];
          if (currentRect && previousRect)
            setItemTransform(
              getItemDomId(rootId, candidateId),
              previousRect.left - currentRect.left,
            );
        } else if (target < current.from && candidate >= target && candidate < current.from) {
          const nextRect = rects.current[activeIds.current[candidate + 1]];
          if (currentRect && nextRect)
            setItemTransform(getItemDomId(rootId, candidateId), nextRect.left - currentRect.left);
        } else {
          setItemTransform(getItemDomId(rootId, candidateId), 0);
        }
      }
    },
    [activeIds, itemIds, rects, rootId, scrollEdgeOffset, state],
  );

  const runAutoScrollFrame = useCallback(() => {
    "main thread";
    if (!autoScrollActive.current || !state.current.dragging) return;
    const offset = autoScrollOffset.current;
    if (offset === 0) {
      autoScrollActive.current = false;
      return;
    }
    const generation = state.current.generation;
    const element = lynx.querySelector(`#${escapeSelectorId(boundaryId)}`);
    if (!element) return;
    const previousScrollLeft = state.current.scrollLeft;
    element.invoke("scrollBy", { offset }).then((result: ScrollByResult | null) => {
      "main thread";
      if (!state.current.dragging || state.current.generation !== generation) return;
      const nextScrollLeft = getScrollAfter(result, previousScrollLeft);
      if (nextScrollLeft === null) {
        element.invoke("getScrollInfo").then((info: ScrollInfo | null) => {
          "main thread";
          if (!state.current.dragging || state.current.generation !== generation) return;
          const measuredScrollLeft = info?.scrollX;
          if (typeof measuredScrollLeft !== "number") {
            autoScrollActive.current = false;
            return;
          }
          const currentScrollLeft = state.current.scrollLeft;
          state.current.scrollCompensation += measuredScrollLeft - currentScrollLeft;
          state.current.scrollLeft = measuredScrollLeft;
          applyDragPosition(state.current.pointerX);
          if (autoScrollActive.current && autoScrollFrame.current)
            setTimeout(autoScrollFrame.current, 8);
        });
        return;
      }
      const currentScrollLeft = state.current.scrollLeft;
      state.current.scrollCompensation += nextScrollLeft - currentScrollLeft;
      state.current.scrollLeft = nextScrollLeft;
      applyDragPosition(state.current.pointerX);
      if (autoScrollActive.current && autoScrollFrame.current)
        setTimeout(autoScrollFrame.current, 8);
    });
  }, [applyDragPosition, boundaryId, state]);

  const onDragStart = useCallback(
    (itemId: string, index: number, event: DragPointEvent) => {
      "main thread";
      if (sortingDisabled || state.current.dragging || index < 0 || index >= itemIds.length) return;
      const generation = state.current.generation + 1;
      state.current = {
        activeId: itemId,
        from: index,
        target: index,
        startX: getPageX(event),
        pointerX: getPageX(event),
        scrollLeft: state.current.scrollLeft,
        scrollCompensation: 0,
        lastMoveTimestamp: -1,
        generation,
        pendingMeasurements: itemIds.length + 1,
        ready: false,
        dragging: true,
      };
      activeIds.current = [...itemIds];
      rects.current = {};
      boundary.current = null;
      autoScrollActive.current = false;
      setScrollEnabled(boundaryId, false);
      runOnBackground(onDragStateChangeJS)(true, itemId, generation);
      runOnBackground(measureInBackground)(generation, rootId, itemIds, boundaryId);
    },
    [
      activeIds,
      boundaryId,
      itemIds,
      measureInBackground,
      onDragStateChangeJS,
      rects,
      rootId,
      sortingDisabled,
      state,
    ],
  );

  const onDragMove = useCallback(
    (event: DragPointEvent) => {
      "main thread";
      const current = state.current;
      if (!current.dragging || event.timestamp === current.lastMoveTimestamp) return;
      current.lastMoveTimestamp = event.timestamp;
      current.pointerX = getPageX(event);
      autoScrollFrame.current = runAutoScrollFrame;
      const wasAutoScrolling = autoScrollActive.current;
      applyDragPosition(current.pointerX);
      if (!wasAutoScrolling && autoScrollActive.current) setTimeout(runAutoScrollFrame, 8);
    },
    [applyDragPosition, autoScrollFrame, runAutoScrollFrame, state],
  );
  const onDragReady = useCallback(
    (itemId: string, generation: number) => {
      "main thread";
      const current = state.current;
      if (
        !current.dragging ||
        current.ready ||
        current.activeId !== itemId ||
        current.generation !== generation ||
        current.pendingMeasurements !== 0
      )
        return;
      current.ready = true;
      autoScrollFrame.current = runAutoScrollFrame;
      applyDragPosition(current.pointerX);
      if (autoScrollActive.current) setTimeout(runAutoScrollFrame, 8);
    },
    [applyDragPosition, autoScrollActive, autoScrollFrame, runAutoScrollFrame, state],
  );
  const onDragEnd = useCallback(() => {
    "main thread";
    finishDrag(false);
  }, [finishDrag]);
  const onDragCancel = useCallback(() => {
    "main thread";
    finishDrag(true);
  }, [finishDrag]);
  React.useEffect(() => {
    if (sortingDisabled) runOnMainThread(finishDrag)(true);
  }, [finishDrag, sortingDisabled]);
  React.useEffect(
    () => () => {
      runOnMainThread(finishDrag)(true);
    },
    [],
  );

  const contextValue = React.useMemo<ReorderContextValue>(
    () => ({
      itemIds,
      rootId,
      boundaryId,
      disabled: sortingDisabled,
      reducedMotion,
      draggingItemId,
      dragLayout,
      onDragReady,
      onScroll,
      onDragStart,
      onDragMove,
      onDragEnd,
      onDragCancel,
    }),
    [
      boundaryId,
      draggingItemId,
      dragLayout,
      onDragReady,
      itemIds,
      onDragCancel,
      onDragEnd,
      onDragMove,
      onDragStart,
      onScroll,
      rootId,
      reducedMotion,
      sortingDisabled,
    ],
  );

  return (
    <ReorderContext.Provider value={contextValue}>
      <view
        id={rootId}
        main-thread:global-bindtouchmove={sortingDisabled ? undefined : onDragMove}
        main-thread:global-bindtouchend={sortingDisabled ? undefined : onDragEnd}
        main-thread:global-bindtouchcancel={sortingDisabled ? undefined : onDragCancel}
        main-thread:global-bindmousemove={sortingDisabled ? undefined : onDragMove}
        main-thread:global-bindmouseup={sortingDisabled ? undefined : onDragEnd}
        main-thread:bindmouseleave={sortingDisabled ? undefined : onDragCancel}
        style={{ display: "flex", flexDirection: "row", flexShrink: 0 }}
      >
        {children({ onScroll, dragging: draggingItemId !== null })}
      </view>
    </ReorderContext.Provider>
  );
}
