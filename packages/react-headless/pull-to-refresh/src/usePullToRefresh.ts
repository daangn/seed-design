import { dataAttr, elementProps } from "@seed-design/dom-utils";
import { useRef, useState, useSyncExternalStore } from "react";
import { getClientY, isLeftPress, touchEnd, touchMove } from "./normalize-event";
import { Store } from "./store";

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

  function setContext({ y0, y, displacement }: Omit<PullToRefreshContext, "displacementRatio">) {
    contextStore.setState({
      y0,
      y,
      displacement,
      displacementRatio: Math.min(displacement / threshold, 1),
    });
    rootRef.current?.style.setProperty("--ptr-displacement", `${displacement}px`);
  }

  const events = {
    move: ({ y, scrollTop }: { y: number; scrollTop: number }) => {
      if (state === "idle") {
        const ctx = contextStore.getState();
        if (scrollTop <= 0 && ctx.y !== -1 && y > ctx.y) {
          setContext({ y0: y, y, displacement: 0 });
          props.onPtrPullStart?.(contextStore.getState());
          setState("pulling");
        } else {
          contextStore.setState({ ...ctx, y });
        }
      }
      if (state === "pulling" || state === "ready") {
        const { y0 } = contextStore.getState();
        const displacement = (y - y0) * displacementMultiplier;
        setContext({ y0, y, displacement });
        props.onPtrPullMove?.(contextStore.getState());

        if (displacement > threshold) {
          setState("ready");
          props.onPtrReady?.();
        } else {
          setState("pulling");
        }
      }
    },
    end: () => {
      if (state === "pulling" || state === "ready") {
        props.onPtrPullEnd?.(contextStore.getState());
      }
      if (state === "ready" && props.onPtrRefresh) {
        setState("loading");
        setContext({ y0: 0, y: -1, displacement: threshold });
        props.onPtrRefresh().then(() => {
          setState("idle");
          setContext({ y0: 0, y: -1, displacement: 0 });
        });
      } else if (state === "ready" || state === "pulling") {
        setState("idle");
        setContext({ y0: 0, y: -1, displacement: 0 });
      }
    },
  };

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
      [touchMove]: (e: React.TouchEvent | React.PointerEvent) => {
        if (e.defaultPrevented) return;
        if (!isLeftPress(e)) return;
        events.move({ y: getClientY(e), scrollTop: e.currentTarget.scrollTop });
      },
      [touchEnd]: () => {
        events.end();
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
