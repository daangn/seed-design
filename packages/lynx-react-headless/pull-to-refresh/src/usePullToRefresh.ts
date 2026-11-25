import * as React from "@lynx-js/react";
import {
  runOnBackground,
  runOnMainThread,
  useMainThreadRef,
  type MainThreadRef,
} from "@lynx-js/react";
import { NativeGesture, useGesture } from "@lynx-js/gesture-runtime";
import type { IntrinsicElements, MainThread } from "@lynx-js/types";
import {
  beginPull,
  cancelPull,
  createPullEngine,
  ease,
  endPull,
  movePull,
  settlePull,
} from "./engine" with { runtime: "shared" };
import type { PullEffect, PullToRefreshContext, PullToRefreshState } from "./engine";

export interface MainThreadProgress {
  value: number;
  onChange?: (value: number) => void;
}

/** 방향 판정 전 손가락이 움직여야 하는 거리(px)입니다. 첫 몇 px의 흔들림으로 가로 스와이프를 가져가지 않습니다. */
const DIRECTION_SLOP = 10;

type ContactDecision = "pending" | "accepted" | "rejected";

export interface UsePullToRefreshProps {
  /** 새로고침 준비 기준(px). @default 88 */
  threshold?: number;
  /** 저항 적용 전 손가락 이동에 곱할 변위 배율. @default 0.75 */
  displacementMultiplier?: number;
  onPtrPullStart?: (context: PullToRefreshContext) => void;
  onPtrPullMove?: (context: PullToRefreshContext) => void;
  /** 취소·disabled 중단이면 리셋한 context를 받습니다. */
  onPtrPullEnd?: (context: PullToRefreshContext) => void;
  onPtrReady?: () => void;
  onPtrRefresh?: () => Promise<void>;
  disabled?: boolean;
}

export interface PullToRefreshIndicatorRenderProps {
  minValue: number;
  maxValue: number;
  value: number | undefined;
  mainThreadProgress: MainThreadRef<MainThreadProgress>;
}

/** scroll-view와 list의 scroll 계열 이벤트가 공통으로 보내는 `detail.scrollTop`만 사용합니다. */
type ScrollEvent =
  | Parameters<NonNullable<IntrinsicElements["scroll-view"]["bindscroll"]>>[0]
  | Parameters<NonNullable<IntrinsicElements["list"]["bindscroll"]>>[0]
  | Parameters<NonNullable<IntrinsicElements["list"]["bindscrolltoupper"]>>[0];
type LayoutEvent = Parameters<
  NonNullable<IntrinsicElements["view"]["main-thread:bindlayoutchange"]>
>[0];

export interface UsePullToRefreshContext {
  state: PullToRefreshState;
  threshold: number;
  contentRef: MainThreadRef<MainThread.Element | null>;
  indicatorRef: MainThreadRef<MainThread.Element | null>;
  indicatorSize: MainThreadRef<number>;
  prevented: MainThreadRef<boolean>;
  mainThreadProgress: MainThreadRef<MainThreadProgress>;
  gesture: NativeGesture;
  resetContact: () => void;
  /** scroll-view Content용입니다. 경계 이탈을 `scrollTo`로 되돌립니다. */
  handleScroll: (event: ScrollEvent) => void;
  /** list Content용입니다. list에는 `scrollTo`가 없어(Android) `scrollToPosition`으로 되돌립니다. */
  handleListScroll: (event: ScrollEvent) => void;
  handleIndicatorLayout: (event: LayoutEvent) => void;
}

export function usePullToRefresh(props: UsePullToRefreshProps): UsePullToRefreshContext {
  const {
    threshold = 88,
    displacementMultiplier = 0.75,
    disabled = false,
    onPtrPullStart,
    onPtrPullMove,
    onPtrPullEnd,
    onPtrReady,
    onPtrRefresh,
  } = props;
  const currentCallbacks = {
    onPtrPullStart,
    onPtrPullMove,
    onPtrPullEnd,
    onPtrReady,
    onPtrRefresh,
  };
  const callbacks = React.useRef(currentCallbacks);
  callbacks.current = currentCallbacks;
  const [state, setState] = React.useState<PullToRefreshState>("idle");
  const engine = useMainThreadRef(createPullEngine());
  const contentRef = useMainThreadRef<MainThread.Element>(null);
  const indicatorRef = useMainThreadRef<MainThread.Element>(null);
  const indicatorSize = useMainThreadRef(0);
  const prevented = useMainThreadRef(false);
  const scrollTop = useMainThreadRef(0);
  /** `touching`은 같은 터치에서 native gesture가 다시 begin했는지 가리기 위해 touchstart마다 끕니다. */
  const contact = useMainThreadRef<{
    x: number;
    y: number;
    decision: ContactDecision;
    touching: boolean;
  }>({
    x: 0,
    y: 0,
    decision: "rejected",
    touching: false,
  });
  const visual = useMainThreadRef({ displacement: 0, frame: 0, from: 0, target: 0, start: 0 });
  const mainThreadProgress = useMainThreadRef<MainThreadProgress>({ value: 0 });
  const currentConfig = {
    threshold,
    displacementMultiplier,
    indicatorSize: 0,
    disabled,
    hasRefresh: !!onPtrRefresh,
    hasPullStart: !!onPtrPullStart,
    hasPullMove: !!onPtrPullMove,
    hasPullEnd: !!onPtrPullEnd,
    hasReady: !!onPtrReady,
  };
  const config = useMainThreadRef(currentConfig);
  const gesture = useGesture(NativeGesture);

  function apply(displacement: number) {
    "main thread";
    visual.current.displacement = displacement;
    contentRef.current?.setStyleProperty("transform", `translateY(${displacement}px)`);
    indicatorRef.current?.setStyleProperty(
      "transform",
      `translateY(${Math.min(displacement - (indicatorSize.current || config.current.threshold), 0)}px)`,
    );
  }

  function applyRatio() {
    "main thread";
    const ratio = engine.current.context.displacementRatio;
    indicatorRef.current?.setStyleProperty("opacity", `${ratio}`);
    mainThreadProgress.current.value = ratio * 100;
    mainThreadProgress.current.onChange?.(ratio * 100);
  }

  function stopAnimation() {
    "main thread";
    if (visual.current.frame) cancelAnimationFrame(visual.current.frame);
    visual.current.frame = 0;
  }

  function frame() {
    "main thread";
    const animation = visual.current;
    const elapsed = Date.now() - animation.start;
    apply(animation.from + (animation.target - animation.from) * ease(elapsed / 300));
    if (elapsed >= 300) animation.frame = 0;
    else animation.frame = requestAnimationFrame(frame);
  }

  function animate() {
    "main thread";
    stopAnimation();
    visual.current.from = visual.current.displacement;
    visual.current.target = engine.current.context.displacement;
    visual.current.start = Date.now();
    if (visual.current.from === visual.current.target) return;
    visual.current.frame = requestAnimationFrame(frame);
  }

  function settle() {
    "main thread";
    if (engine.current.state !== "loading") return;
    settlePull(engine.current);
    runOnBackground(setState)("idle");
    applyRatio();
    animate();
  }

  const refresh = React.useCallback(async () => {
    "background only";
    try {
      await callbacks.current.onPtrRefresh?.();
    } catch {
      /* 새로고침 실패도 같은 복귀 전이를 사용합니다. */
    } finally {
      runOnMainThread(settle)();
    }
  }, []);

  const notify = React.useCallback((effect: PullEffect) => {
    "background only";
    if (effect.type === "start") callbacks.current.onPtrPullStart?.(effect.context);
    else if (effect.type === "move") callbacks.current.onPtrPullMove?.(effect.context);
    else if (effect.type === "end") callbacks.current.onPtrPullEnd?.(effect.context);
    else if (effect.type === "ready") callbacks.current.onPtrReady?.();
  }, []);

  function emit(effects: PullEffect[], previous: PullToRefreshState) {
    "main thread";
    for (const effect of effects) {
      if (
        (effect.type === "start" && config.current.hasPullStart) ||
        (effect.type === "move" && config.current.hasPullMove) ||
        (effect.type === "end" && config.current.hasPullEnd) ||
        (effect.type === "ready" && config.current.hasReady)
      ) {
        runOnBackground(notify)(effect);
      }
    }
    if (previous !== engine.current.state) runOnBackground(setState)(engine.current.state);
    applyRatio();
    for (const effect of effects) {
      if (effect.type === "refresh") runOnBackground(refresh)();
    }
  }

  function resetContact() {
    "main thread";
    prevented.current = false;
    contact.current.touching = false;
  }

  /** 판정 전에 끝난 contact는 같은 터치의 다음 begin에서 판정을 이어가도록 pending으로 둡니다. */
  function releaseContact() {
    "main thread";
    if (contact.current.decision === "accepted") contact.current.decision = "rejected";
  }

  /** 수락한 당김 중 native 스크롤이 경계를 벗어났으면 false를 반환합니다. */
  function trackScroll(event: ScrollEvent): boolean {
    "main thread";
    const nextScrollTop = event.detail.scrollTop;
    if (contact.current.decision === "accepted" && nextScrollTop > 0) {
      scrollTop.current = 0;
      return false;
    }
    scrollTop.current = nextScrollTop;
    return true;
  }

  function handleScroll(event: ScrollEvent) {
    "main thread";
    if (trackScroll(event)) return;
    contentRef.current?.invoke("scrollTo", { offset: 0, index: 0, smooth: false }).catch(() => {});
  }

  function handleListScroll(event: ScrollEvent) {
    "main thread";
    if (trackScroll(event)) return;
    contentRef.current
      ?.invoke("scrollToPosition", { position: 0, alignTo: "top", offset: 0, smooth: false })
      .catch(() => {});
  }

  function handleIndicatorLayout(event: LayoutEvent) {
    "main thread";
    indicatorSize.current = event.detail.height;
    config.current.indicatorSize = event.detail.height;
    apply(visual.current.displacement);
  }

  gesture.onBegin((event) => {
    "main thread";
    // 터치 중에 끝난 NativeGesture는 다음 touchmove에서 다시 begin합니다(iOS에서 관찰). 같은 터치면 처음 contact를 이어갑니다.
    if (event.params.type !== "touchmove" || !contact.current.touching) {
      contact.current = {
        x: event.params.clientX,
        y: event.params.clientY,
        decision: "pending",
        touching: true,
      };
    }
    beginPull(engine.current, contact.current.y);
  });
  gesture.onUpdate((event, manager) => {
    "main thread";
    const touch = contact.current;
    if (touch.decision === "pending") {
      const dx = event.params.clientX - touch.x;
      const dy = event.params.clientY - touch.y;
      if (Math.hypot(dx, dy) < DIRECTION_SLOP) return;
      const accepted =
        !config.current.disabled &&
        !prevented.current &&
        engine.current.state === "idle" &&
        scrollTop.current <= 0 &&
        dy > 0 &&
        Math.abs(dy) > Math.abs(dx);
      touch.decision = accepted ? "accepted" : "rejected";
      manager.interceptGesture(accepted);
    }
    if (touch.decision !== "accepted") return;
    stopAnimation();
    const previous = engine.current.state;
    const effects = movePull(
      engine.current,
      config.current,
      event.params.clientY,
      scrollTop.current,
      prevented.current,
    );
    emit(effects, previous);
    apply(engine.current.context.displacement);
  });
  gesture.onEnd(() => {
    "main thread";
    const previous = engine.current.state;
    const effects = endPull(engine.current, config.current);
    releaseContact();
    if (!effects.length) return;
    emit(effects, previous);
    animate();
  });
  gesture.onTouchesCancel(() => {
    "main thread";
    const previous = engine.current.state;
    const effects = cancelPull(engine.current);
    releaseContact();
    if (!effects.length) return;
    emit(effects, previous);
    animate();
  });

  function syncConfig(next: typeof currentConfig) {
    "main thread";
    next.indicatorSize = indicatorSize.current;
    config.current = next;
    if (!next.disabled) return;
    const previous = engine.current.state;
    const effects = cancelPull(engine.current);
    releaseContact();
    if (!effects.length) return;
    emit(effects, previous);
    animate();
  }
  React.useEffect(() => {
    runOnMainThread(syncConfig)(currentConfig);
  }, [
    threshold,
    displacementMultiplier,
    disabled,
    currentConfig.hasRefresh,
    currentConfig.hasPullStart,
    currentConfig.hasPullMove,
    currentConfig.hasPullEnd,
    currentConfig.hasReady,
  ]);
  React.useEffect(
    () => () => {
      runOnMainThread(stopAnimation)();
    },
    [],
  );

  return React.useMemo(
    () => ({
      state,
      threshold,
      contentRef,
      indicatorRef,
      indicatorSize,
      prevented,
      mainThreadProgress,
      gesture,
      resetContact,
      handleScroll,
      handleListScroll,
      handleIndicatorLayout,
    }),
    [
      state,
      threshold,
      contentRef,
      indicatorRef,
      indicatorSize,
      prevented,
      mainThreadProgress,
      gesture,
      resetContact,
      handleScroll,
      handleListScroll,
      handleIndicatorLayout,
    ],
  );
}
