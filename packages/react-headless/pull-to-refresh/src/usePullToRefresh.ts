import { useCallbackRef } from "@radix-ui/react-use-callback-ref";
import { dataAttr, elementProps } from "@seed-design/dom-utils";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  getClientY,
  isLeftPress,
  touchCancel,
  touchEnd,
  touchMove,
  touchStart,
} from "./normalize-event";
import { Store } from "./store";
import { findScroller, isPullPrevented } from "./dom";

interface UsePullToRefreshStateProps {
  /**
   * The threshold value to trigger the refresh. (px)
   * @default 44
   */
  threshold?: number;

  /**
   * The multiplier to calculate displacement from the touch movement.
   * @default 0.5
   */
  displacementMultiplier?: number;

  /**
   * Callback when the pull-to-refresh has started to pull.
   */
  onPtrPullStart?: (ctx: PullToRefreshContext) => void;

  /**
   * Callback when the pull-to-refresh is moving during the pull.
   */
  onPtrPullMove?: (ctx: PullToRefreshContext) => void;

  /**
   * Callback when the pull-to-refresh is released.
   * It does not matter if it is ready or not. If you want to handle the refresh, use `onPtrRefresh`.
   *
   * The context depends on how the pull ended. Releasing the pointer reports the
   * final coordinates, while a pull aborted by `touchcancel`/`pointercancel` or by
   * `disabled` flipping on reports the already reset context (`y: -1`,
   * `displacement: 0`), so an interrupted pull never surfaces a stale displacement.
   */
  onPtrPullEnd?: (ctx: PullToRefreshContext) => void;

  /**
   * Callback when the pull-to-refresh is pulled over the threshold.
   */
  onPtrReady?: () => void;

  /**
   * Callback when the pull-to-refresh is released after ready.
   */
  onPtrRefresh?: () => Promise<void>;

  /**
   * Whether to disable the pull-to-refresh.
   * @default false
   */
  disabled?: boolean;
}

interface PullToRefreshContext {
  y0: number;

  y: number;

  displacement: number;

  displacementRatio: number;
}

export type PullToRefreshState = "idle" | "pulling" | "ready" | "loading";

function usePullToRefreshState(props: UsePullToRefreshStateProps) {
  const threshold = props.threshold ?? 44;
  const displacementMultiplier = props.displacementMultiplier ?? 0.5;
  const disabled = props.disabled ?? false;

  // We use useSyncExternalStore to only re-render indicator area on drag
  const [contextStore] = useState(
    new Store<PullToRefreshContext>({
      y0: 0,
      y: -1,
      displacement: 0,
      displacementRatio: 0,
    }),
  );

  const [state, setState] = useState<PullToRefreshState>("idle");
  const rootRef = useRef<HTMLDivElement | null>(null);

  /**
   * Where the finger currently in contact landed, and the element its scrolling
   * belongs to. Null between gestures: every contact writes it and every release
   * clears it — including while `disabled`, where the rest of the handlers bail
   * out — so a pull can only ever start from a point this same gesture reported.
   */
  const originRef = useRef<{ y: number; scroller: Element } | null>(null);

  const setContext = useCallback(
    ({ y0, y, displacement }: Omit<PullToRefreshContext, "displacementRatio">) => {
      contextStore.setState({
        y0,
        y,
        displacement,
        displacementRatio: Math.min(displacement / threshold, 1),
      });
      rootRef.current?.style.setProperty("--ptr-displacement", `${displacement}px`);
    },
    [contextStore, threshold],
  );

  const onPtrPullStart = useCallbackRef(props.onPtrPullStart);
  const onPtrPullMove = useCallbackRef(props.onPtrPullMove);
  const onPtrPullEnd = useCallbackRef(props.onPtrPullEnd);
  const onPtrReady = useCallbackRef(props.onPtrReady);
  const onPtrRefresh = useCallbackRef(props.onPtrRefresh);
  const isPtrRefreshProvided = !!props.onPtrRefresh;

  /**
   * Ends a pull without refreshing. The context is reset before `onPtrPullEnd`
   * so that a cancelled pull never reports a stale or negative displacement.
   */
  const abortPull = useCallback(() => {
    setState("idle");
    setContext({ y0: 0, y: -1, displacement: 0 });
    onPtrPullEnd?.(contextStore.getState());
  }, [contextStore, setContext, onPtrPullEnd]);

  const startEvent = useCallback((origin: { y: number; scroller: Element }) => {
    originRef.current = origin;
  }, []);

  const moveEvent = useCallback(
    ({ y }: { y: number }) => {
      if (disabled) return;

      const origin = originRef.current;

      if (state === "idle") {
        if (!origin) return;
        if (origin.scroller.scrollTop > 0) return;
        if (y <= origin.y) return;

        setContext({ y0: y, y, displacement: 0 });
        onPtrPullStart?.(contextStore.getState());
        setState("pulling");
        return;
      }

      if (state === "pulling" || state === "ready") {
        const { y0 } = contextStore.getState();
        const displacement = (y - y0) * displacementMultiplier;

        if (displacement <= 0) {
          // Let the pull origin follow the finger while it sits at or above where
          // the pull began. A negative displacement would slide the content up and
          // animate back on release, and pinning the origin instead of tracking it
          // would make the user retrace the whole overshoot before the indicator
          // moved again.
          setContext({ y0: y, y, displacement: 0 });
          onPtrPullMove?.(contextStore.getState());
          setState("pulling");
          return;
        }

        setContext({ y0, y, displacement });
        onPtrPullMove?.(contextStore.getState());

        if (displacement > threshold) {
          setState("ready");
          onPtrReady?.();
        } else {
          setState("pulling");
        }
      }
    },
    [
      state,
      contextStore,
      displacementMultiplier,
      threshold,
      disabled,
      setContext,
      onPtrPullStart,
      onPtrPullMove,
      onPtrReady,
    ],
  );

  const endEvent = useCallback(() => {
    // Ahead of every guard below: the origin must not outlive the contact that
    // reported it, or the next gesture could measure its first move against it.
    originRef.current = null;

    if (disabled) return;
    // While loading, props.onPtrRefresh owns the state and the context.
    if (state === "loading") return;

    if (state === "pulling" || state === "ready") {
      onPtrPullEnd?.(contextStore.getState());
    }
    if (state === "ready" && isPtrRefreshProvided) {
      setState("loading");
      setContext({ y0: 0, y: -1, displacement: threshold });
      // Settle on rejection too. `end` and `cancel` both no-op while loading, so
      // an unhandled rejection would leave the state stuck at `loading` forever.
      function settle() {
        setState("idle");
        setContext({ y0: 0, y: -1, displacement: 0 });
      }
      onPtrRefresh().then(settle, settle);
      return;
    }
    if (state === "ready" || state === "pulling") {
      setState("idle");
      setContext({ y0: 0, y: -1, displacement: 0 });
    }
  }, [
    state,
    contextStore,
    threshold,
    disabled,
    isPtrRefreshProvided,
    setContext,
    onPtrPullEnd,
    onPtrRefresh,
  ]);

  const cancelEvent = useCallback(() => {
    originRef.current = null;

    if (disabled) return;
    if (state === "loading") return;

    if (state === "pulling" || state === "ready") {
      abortPull();
    }
  }, [state, disabled, abortPull]);

  const disableEvent = useCallback(() => {
    if (!disabled) return;

    // If loading, we let props.onPtrRefresh handle the state change.
    if (state === "pulling" || state === "ready") {
      abortPull();
    }
  }, [disabled, state, abortPull]);

  const events = {
    start: startEvent,
    move: moveEvent,
    end: endEvent,
    cancel: cancelEvent,
    disable: disableEvent,
  };

  useEffect(() => {
    if (disabled) {
      events.disable();
    }
  }, [disabled, events.disable]);

  return {
    state,
    threshold,
    refs: { root: rootRef },
    events,
    contextStore,
  };
}

export interface UsePullToRefreshProps extends UsePullToRefreshStateProps {}

export interface PullToRefreshIndicatorRenderProps {
  minValue: number;
  maxValue: number;
  value: number | undefined;
}

export type UsePullToRefreshReturn = ReturnType<typeof usePullToRefresh>;

export function usePullToRefresh(props: UsePullToRefreshProps) {
  const { state, threshold, refs, events, contextStore } = usePullToRefreshState(props);

  const isDragging = state === "pulling" || state === "ready";
  const stateProps = elementProps({
    "data-ptr-state": state,
    "data-ptr-dragging": dataAttr(isDragging),
  });

  return {
    state,

    refs,
    stateProps,
    rootProps: elementProps({
      ...stateProps,
      [touchStart]: (e: React.TouchEvent | React.PointerEvent) => {
        if (e.defaultPrevented) return;
        if (!isLeftPress(e)) return;
        if (!(e.target instanceof HTMLElement)) return;
        if (isPullPrevented(e.target)) return;

        events.start({
          y: getClientY(e),
          scroller: findScroller(e.target, e.currentTarget),
        });
      },
      [touchMove]: (e: React.TouchEvent | React.PointerEvent) => {
        if (e.defaultPrevented) return;
        if (!isLeftPress(e)) return;
        if (e.target instanceof HTMLElement && isPullPrevented(e.target)) return;

        events.move({ y: getClientY(e) });
      },
      [touchEnd]: () => {
        events.end();
      },
      [touchCancel]: () => {
        events.cancel();
      },
      style: {
        overscrollBehaviorY: "none",
        overflowY: "auto",
      },
    }),
    indicatorProps: elementProps({
      ...stateProps,
      style: {
        pointerEvents: "none",
        touchAction: "none",
        position: "relative",
        top: 0,
        left: 0,
        width: "100%",
        height: `var(--ptr-size, ${threshold}px)`,
        marginBottom: `calc(var(--ptr-size, ${threshold}px) * -1)`,
      },
    }),
    getIndicatorRenderProps: () => {
      const ctx = useSyncExternalStore(
        (listener) => contextStore.subscribe(listener),
        () => contextStore.getState(),
        () => contextStore.getState(),
      );
      return {
        minValue: 0,
        maxValue: 100,
        value: state === "loading" ? undefined : ctx.displacementRatio * 100,
        style: {
          opacity: ctx.displacementRatio,
        },
      };
    },
    contentProps: elementProps({
      ...stateProps,
      style: {
        transform: state === "idle" ? undefined : "translateY(var(--ptr-displacement, 0))",
        transition: isDragging ? "none" : "transform var(--ptr-transition-duration, 0.3s)",
      },
    }),
  };
}
