import * as React from "@lynx-js/react";
import { runOnBackground, runOnMainThread, useMainThreadRef } from "@lynx-js/react";
import type { IntrinsicElements, MainThread } from "@lynx-js/types";
import { useControllableState } from "@seed-design/lynx-react-use-controllable-state";

type ViewProps = IntrinsicElements["view"];
type TouchEvent = Parameters<NonNullable<ViewProps["main-thread:catchtouchstart"]>>[0];

const VERTICAL_SLIDE_EVENT_ANGLES: [number, number][] = [
  [-135, -45],
  [45, 135],
];
const DRAG_SLOP = 8;
const VELOCITY_WINDOW_MS = 100;
const VELOCITY_MAX_AGE_MS = 80;
const PROJECTION_MS = 325;
const SNAP_TIME_CONSTANT_MS = 100;
const MIN_FLING_TIME_CONSTANT_MS = 100;
const MAX_FLING_TIME_CONSTANT_MS = 650;
const MIN_FLING_VELOCITY = 0.05;
const SETTLE_DISTANCE = 0.5;
const RUBBER_BAND_COEFFICIENT = 0.55;
const WINDOW_OVERSCAN = 8;
const WINDOW_SHIFT_THRESHOLD = 4;
const SELECTED_ITEM_CLASS_NAME = "seed-loop-scroll__item seed-loop-scroll__item--selected";
const ITEM_CLASS_NAME = "seed-loop-scroll__item";

export interface LoopScrollItem {
  /** `0`부터 `itemCount - 1`까지의 항목 index입니다. */
  index: number;
  /** 끝없는 track에서의 위치입니다. loop에서는 음수이거나 `itemCount` 이상일 수 있습니다. */
  virtualIndex: number;
  /** 같은 index 중 렌더 창 중심에서 가장 가까운 항목만 `false`입니다. 나머지는 스크린 리더에서 숨깁니다. */
  isClone: boolean;
}

export interface LoopScrollIndexChangeDetails {
  /**
   * 직전에 정착한 항목에서 새 항목까지 이동한 칸 수입니다. 뒤 항목으로 이동하면 양수, 앞 항목으로 이동하면 음수입니다.
   * loop에서는 한 바퀴 넘게 돌면 절댓값이 `itemCount`보다 클 수 있습니다.
   */
  stepDelta: number;
}

export interface LoopScrollRootProps extends Omit<ViewProps, "children"> {
  /** 항목 개수입니다. */
  itemCount: number;
  /** 스크롤 방향의 항목 크기(px)입니다. 모든 항목이 같은 크기를 가집니다. */
  itemSize: number;
  /**
   * viewport에 보이는 항목 수입니다. Root 높이(`visibleItemCount × itemSize`)와 렌더 창 크기를 정합니다.
   */
  visibleItemCount: number;
  /**
   * 마지막 항목 다음에 첫 항목이 이어지게 반복합니다. 항목이 2개 미만이면 반복하지 않습니다.
   * `false`면 양 끝에서 멈추고, 끝을 넘겨 끌면 저항을 주다가 놓으면 돌아옵니다.
   * @default true
   */
  loop?: boolean;
  /** 가운데에 정착한 항목 index입니다. 범위를 벗어나면 가까운 끝으로 맞춥니다. */
  index?: number;
  /** @default 0 */
  defaultIndex?: number;
  /**
   * 사용자 조작이 끝나 다른 항목에 정착했을 때 한 번 호출합니다. `index`가 바뀌어 이동할 때는 호출하지 않습니다.
   */
  onIndexChange?: (index: number, details: LoopScrollIndexChangeDetails) => void;
  /**
   * 사용자 조작 중 가운데 항목이 바뀔 때마다 지나간 index를 순서대로 전달합니다. `index`가 바뀌어 이동할 때는 호출하지 않습니다.
   */
  onActiveIndexChange?: (index: number) => void;
  /**
   * `index`가 바뀌었을 때 이동 방식입니다. loop에서는 더 가까운 방향으로 이동합니다. 사용자가 조작하는 중에는 이동하지 않습니다.
   * @default "instant"
   */
  indexChangeBehavior?: "instant" | "smooth";
  /**
   * 터치로 스크롤하지 않고, 세로 끌기를 바깥 native 스크롤(`<scroll-view>` 등)에 넘깁니다. 조작 중에 켜지면 직전에 정착한 항목으로 돌아갑니다.
   * @default false
   */
  disabled?: boolean;
  children?: React.ReactNode;
}

export interface LoopScrollTrackProps extends Omit<ViewProps, "children"> {
  /** 항목 내용을 렌더링합니다. Track이 항목마다 `itemSize` 높이의 `<view>`로 감쌉니다. */
  children: (item: LoopScrollItem) => React.ReactNode;
}

export interface LoopScrollHighlightProps extends Omit<ViewProps, "children"> {
  /** 창 안에 그릴 `LoopScroll.Track`입니다. 창 밖의 Track과 같은 위치로 함께 움직입니다. */
  children?: React.ReactNode;
}

type Phase = "idle" | "pending" | "dragging" | "ignored";

interface EngineState {
  offset: number;
  phase: Phase;
  startX: number;
  startY: number;
  startOffset: number;
  /** `[time, y, time, y, ...]` */
  samples: number[];
  frame: number;
  token: number;
  target: number | null;
  userDriven: boolean;
  settledVirtual: number;
  activeVirtual: number;
  /** 항목 touchstart를 Root에서 한 번 소비합니다. 음수 가상 위치도 유효합니다. */
  pressedVirtualIndex: number | null;
  tapVirtualIndex: number | null;
  windowCenter: number;
  pendingMotion: { target: number; timeConstant: number; instant: boolean } | null;
}

interface EngineConfig {
  count: number;
  itemSize: number;
  windowRadius: number;
  loop: boolean;
  maxIndex: number;
  viewportSize: number;
  notifyActive: boolean;
  interactive: boolean;
}

interface RenderWindow {
  start: number;
  end: number;
  center: number;
  motionToken: number | null;
}

function windowAround(center: number, config: EngineConfig): RenderWindow {
  "main thread";
  return {
    start: config.loop ? center - config.windowRadius : Math.max(0, center - config.windowRadius),
    end: config.loop
      ? center + config.windowRadius
      : Math.min(config.maxIndex, center + config.windowRadius),
    center,
    motionToken: null,
  };
}

interface LoopScrollContextValue {
  items: readonly LoopScrollItem[];
  stateRef: React.RefObject<EngineState>;
  selectedIndex: number;
  moverRef: React.RefObject<MainThread.Element>;
  /** `LoopScroll.Highlight` 안 Track의 mover입니다. */
  highlightMoverRef: React.RefObject<MainThread.Element>;
  itemSize: number;
  /** 가운데 항목 칸의 위쪽 끝(px)입니다. */
  highlightTop: string;
  /** 확정된 위치의 transform입니다. Track은 mount할 때 한 번만 읽습니다. */
  getSettledTransform: () => string;
}

const LoopScrollContext = React.createContext<LoopScrollContextValue | null>(null);

function useLoopScrollContext(part: string) {
  const context = React.useContext(LoopScrollContext);
  if (!context) throw new Error(`LoopScroll.${part} must be used within a LoopScroll.Root`);
  return context;
}

/** `LoopScroll.Highlight` 안이면 `true`입니다. Track이 움직일 mover를 고릅니다. */
const LoopScrollHighlightContext = React.createContext(false);

function toPx(value: number) {
  return `${Math.round(value * 100) / 100 + 0}px`;
}

function wrap(value: number, length: number) {
  "main thread";
  const remainder = value % length;
  return remainder < 0 ? remainder + length : remainder;
}

function clampNumber(value: number, min: number, max: number) {
  "main thread";
  return Math.min(Math.max(value, min), max);
}

function nearestVirtualIndex(offset: number, config: EngineConfig) {
  "main thread";
  const virtual = Math.round(offset / config.itemSize);
  return config.loop ? virtual : clampNumber(virtual, 0, config.maxIndex);
}

/** loop에서는 `fromOffset`에서 가장 가까운 `index` 위치를, 아니면 `index` 위치를 virtual index로 반환합니다. */
function virtualTargetFor(index: number, fromOffset: number, config: EngineConfig) {
  "main thread";
  if (!config.loop) return clampNumber(index, 0, config.maxIndex);
  const current = Math.round(fromOffset / config.itemSize);
  let delta = wrap(index - wrap(current, config.count), config.count);
  if (delta > config.count / 2) delta -= config.count;
  return current + delta;
}

function rubberBand(offset: number, maxOffset: number, dimension: number) {
  "main thread";
  const overflow = offset < 0 ? -offset : offset > maxOffset ? offset - maxOffset : 0;
  if (overflow === 0) return offset;
  const resisted = (1 - 1 / ((overflow * RUBBER_BAND_COEFFICIENT) / dimension + 1)) * dimension;
  return offset < 0 ? -resisted : maxOffset + resisted;
}

function pushSample(samples: number[], time: number, y: number) {
  "main thread";
  samples.push(time, y);
  while (samples.length > 4 && time - (samples[0] ?? time) > VELOCITY_WINDOW_MS) {
    samples.splice(0, 2);
  }
}

/** 손가락 sample로 offset 속도(px/ms)를 계산합니다. 손가락이 멈춘 뒤 놓았으면 `0`입니다. */
function releaseVelocity(samples: number[], now: number) {
  "main thread";
  const last = samples.length - 2;
  if (last < 2) return 0;
  const lastTime = samples[last] ?? 0;
  if (now - lastTime > VELOCITY_MAX_AGE_MS) return 0;
  let first = last;
  while (first >= 2 && lastTime - (samples[first - 2] ?? 0) <= VELOCITY_WINDOW_MS) first -= 2;
  const elapsed = lastTime - (samples[first] ?? lastTime);
  if (elapsed <= 0) return 0;
  return -((samples[last + 1] ?? 0) - (samples[first + 1] ?? 0)) / elapsed;
}

function chainMainThreadTouch(
  user: ((event: TouchEvent) => void) | undefined,
  own: (event: TouchEvent) => void,
) {
  if (!user) return own;
  return (event: TouchEvent) => {
    "main thread";
    user(event);
    own(event);
  };
}

/**
 * 항목을 세로로 끌고 놓아 한 칸 단위로 정착시키는 viewport `<view>`입니다. `loop`이면 끝없이 반복합니다.
 * 끌지 않고 항목을 눌렀다 놓으면 그 항목을 가운데로 옮겨 선택합니다. 움직이는 중에 누르면 멈추기만 합니다.
 * 위치 계산·관성·정착은 Main Thread에서 처리하고, Background에는 정착한 항목과 지나간 항목만 알립니다.
 * touch 이벤트는 `disabled`여도 `main-thread:catchtouch*`로 받아 Lynx 부모(예: BottomSheet 드래그)로 전파하지 않습니다.
 * `LoopScroll.Track`을 자식으로 렌더링합니다.
 */
export const LoopScrollRoot = React.forwardRef<unknown, LoopScrollRootProps>((props, ref) => {
  const {
    itemCount,
    itemSize,
    visibleItemCount,
    loop = true,
    index: indexProp,
    defaultIndex = 0,
    onIndexChange,
    onActiveIndexChange,
    indexChangeBehavior = "instant",
    disabled = false,
    "consume-slide-event": consumeSlideEvent = VERTICAL_SLIDE_EVENT_ANGLES,
    style,
    children,
    "main-thread:catchtouchstart": userTouchStart,
    "main-thread:catchtouchmove": userTouchMove,
    "main-thread:catchtouchend": userTouchEnd,
    "main-thread:catchtouchcancel": userTouchCancel,
    ...nativeProps
  } = props;

  if (
    process.env.NODE_ENV !== "production" &&
    (!(itemSize > 0) || !Number.isInteger(visibleItemCount) || visibleItemCount < 1)
  ) {
    console.warn(
      "LoopScroll.Root requires a positive `itemSize` and a positive integer `visibleItemCount`.",
    );
  }

  const count = Math.max(0, Math.floor(itemCount));
  const maxIndex = Math.max(count - 1, 0);
  const loopEnabled = loop && count > 1;
  const windowRadius = Math.ceil(visibleItemCount / 2) + WINDOW_OVERSCAN;
  const viewportSize = visibleItemCount * itemSize;
  const interactive = !disabled && count > 0 && itemSize > 0;

  const detailsRef = React.useRef<LoopScrollIndexChangeDetails>({ stepDelta: 0 });
  const [indexState, setIndex] = useControllableState({
    value: indexProp,
    defaultValue: defaultIndex,
    onChange: (next) => onIndexChange?.(next, detailsRef.current),
  });
  const index = Number.isFinite(indexState)
    ? Math.min(Math.max(Math.round(indexState), 0), maxIndex)
    : 0;
  // Index the main thread last confirmed. The main thread owns the transform after mount, so the
  // background thread only compares requested indices against this position.
  const [positionVirtual, setPositionVirtual] = React.useState(index);
  const settledPosition = loopEnabled
    ? positionVirtual
    : Math.min(Math.max(positionVirtual, 0), maxIndex);
  const settledIndex = loopEnabled ? ((settledPosition % count) + count) % count : settledPosition;
  // Re-runs the index sync effect when the main thread finished an interaction that deferred it.
  const [syncRequest, setSyncRequest] = React.useState(0);
  // `index` the sync effect last saw. A user settle updates it first so the resulting `index`
  // change is not sent back to the main thread that produced it.
  const previousIndexRef = React.useRef(index);

  const onActiveIndexChangeRef = React.useRef(onActiveIndexChange);
  onActiveIndexChangeRef.current = onActiveIndexChange;
  const settledTransformRef = React.useRef("");
  settledTransformRef.current = `translateY(${toPx(-(0.5 + settledPosition) * itemSize)})`;
  // Depend on presence only: `reportActiveJS` reads the latest listener from the ref, so a new
  // listener identity must not recreate the main-thread handlers mid-drag.
  const notifyActive = onActiveIndexChange !== undefined;

  const config = React.useMemo<EngineConfig>(
    () => ({
      count,
      itemSize,
      windowRadius,
      loop: loopEnabled,
      maxIndex,
      viewportSize,
      notifyActive,
      interactive,
    }),
    [windowRadius, count, interactive, itemSize, loopEnabled, maxIndex, notifyActive, viewportSize],
  );
  const [renderWindow, setRenderWindow] = React.useState<RenderWindow>(() => ({
    start: loopEnabled ? index - windowRadius : Math.max(0, index - windowRadius),
    end: loopEnabled ? index + windowRadius : Math.min(maxIndex, index + windowRadius),
    center: index,
    motionToken: null,
  }));

  const stateRef = useMainThreadRef<EngineState>({
    offset: settledPosition * itemSize,
    phase: "idle",
    startX: 0,
    startY: 0,
    startOffset: 0,
    samples: [],
    frame: 0,
    token: 0,
    target: null,
    userDriven: false,
    settledVirtual: settledPosition,
    activeVirtual: settledPosition,
    pressedVirtualIndex: null,
    tapVirtualIndex: null,
    windowCenter: index,
    pendingMotion: null,
  });
  const moverRef = useMainThreadRef<MainThread.Element>(null);
  const highlightMoverRef = useMainThreadRef<MainThread.Element>(null);

  const reportSettledJS = React.useCallback(
    (
      virtual: number,
      settledIndex: number,
      stepDelta: number,
      userDriven: boolean,
      nextWindow: RenderWindow,
    ) => {
      "background only";
      setPositionVirtual(virtual);
      setRenderWindow(nextWindow);
      if (stepDelta === 0) {
        // The position did not change, so only a deferred `index` change remains to sync.
        setSyncRequest((request) => request + 1);
        return;
      }
      if (!userDriven) return;
      detailsRef.current = { stepDelta };
      previousIndexRef.current = settledIndex;
      setIndex(settledIndex);
    },
    [setIndex],
  );
  const reportActiveJS = React.useCallback((indices: number[]) => {
    "background only";
    const listener = onActiveIndexChangeRef.current;
    if (!listener) return;
    for (const activeIndex of indices) listener(activeIndex);
  }, []);

  const reportWindowJS = React.useCallback((next: RenderWindow) => {
    "background only";
    setRenderWindow(next);
  }, []);

  const applyOffset = React.useCallback(
    (offset: number) => {
      "main thread";
      const state = stateRef.current;
      state.offset = offset;
      const center = nearestVirtualIndex(offset, config);
      // 목표가 정해진 이동은 전체 구간을 미리 준비하므로 중간에 창을 줄이지 않습니다.
      if (
        state.target === null &&
        state.pendingMotion === null &&
        Math.abs(center - state.windowCenter) >= WINDOW_SHIFT_THRESHOLD
      ) {
        const next = windowAround(center, config);
        state.windowCenter = center;
        runOnBackground(reportWindowJS)(next);
      }
      const translate = -(0.5 * config.itemSize + offset);
      const transform = `translateY(${Math.round(translate * 100) / 100 + 0}px)`;
      moverRef.current?.setStyleProperty("transform", transform);
      highlightMoverRef.current?.setStyleProperty("transform", transform);
      if (!state.userDriven) return;
      if (center === state.activeVirtual) return;
      const previousActive = state.activeVirtual;
      state.activeVirtual = center;
      if (!config.notifyActive) return;
      const passed: number[] = [];
      const step = center > previousActive ? 1 : -1;
      for (let virtual = previousActive + step; virtual !== center + step; virtual += step) {
        passed.push(config.loop ? wrap(virtual, config.count) : virtual);
      }
      runOnBackground(reportActiveJS)(passed);
    },
    [config, highlightMoverRef, moverRef, reportActiveJS, reportWindowJS, stateRef],
  );

  const stopMotion = React.useCallback(() => {
    "main thread";
    const state = stateRef.current;
    state.token += 1;
    state.target = null;
    state.pendingMotion = null;
    if (state.frame !== 0) {
      cancelAnimationFrame(state.frame);
      state.frame = 0;
    }
  }, [stateRef]);

  const finishMotion = React.useCallback(() => {
    "main thread";
    const state = stateRef.current;
    const virtual = nearestVirtualIndex(state.offset, config);
    const settledIndex = config.loop ? wrap(virtual, config.count) : virtual;
    const stepDelta = virtual - state.settledVirtual;
    const userDriven = state.userDriven;
    state.settledVirtual = virtual;
    state.activeVirtual = virtual;
    const next = windowAround(virtual, config);
    state.windowCenter = virtual;
    state.target = null;
    state.userDriven = false;
    runOnBackground(reportSettledJS)(virtual, settledIndex, stepDelta, userDriven, next);
  }, [config, reportSettledJS, stateRef]);

  /** instant/reset은 창 커밋 뒤, 애니메이션은 창 요청 직후 시작합니다. */
  const beginPreparedMotion = React.useCallback(
    (token: number) => {
      "main thread";
      const state = stateRef.current;
      const motion = state.pendingMotion;
      if (state.token !== token || motion === null) return;
      state.pendingMotion = null;
      const { target, timeConstant, instant } = motion;
      const distance = target - state.offset;
      if (instant || Math.abs(distance) < SETTLE_DISTANCE) {
        applyOffset(target);
        finishMotion();
        return;
      }
      state.target = target;
      const startedAt = Date.now();
      const step = () => {
        const current = stateRef.current;
        if (current.token !== token) return;
        const remaining = distance * Math.exp(-(Date.now() - startedAt) / timeConstant);
        if (Math.abs(remaining) < SETTLE_DISTANCE) {
          current.frame = 0;
          applyOffset(target);
          finishMotion();
          return;
        }
        applyOffset(target - remaining);
        current.frame = requestAnimationFrame(step);
      };
      state.frame = requestAnimationFrame(step);
    },
    [applyOffset, finishMotion, stateRef],
  );

  React.useEffect(() => {
    if (renderWindow.motionToken !== null) {
      runOnMainThread(beginPreparedMotion)(renderWindow.motionToken);
    }
  }, [beginPreparedMotion, renderWindow]);

  const prepareMotion = React.useCallback(
    (target: number, timeConstant: number, userDriven: boolean, instant = false) => {
      "main thread";
      stopMotion();
      const state = stateRef.current;
      state.userDriven = userDriven;
      state.target = target;
      state.pendingMotion = { target, timeConstant, instant };
      const center = nearestVirtualIndex(state.offset, config);
      const destination = nearestVirtualIndex(target, config);
      const from = windowAround(center, config);
      const to = windowAround(destination, config);
      const next: RenderWindow = {
        start: instant ? to.start : Math.min(from.start, to.start),
        end: instant ? to.end : Math.max(from.end, to.end),
        center: destination,
        motionToken: instant ? state.token : null,
      };
      state.windowCenter = destination;
      runOnBackground(reportWindowJS)(next);
      if (!instant) beginPreparedMotion(state.token);
    },
    [beginPreparedMotion, config, reportWindowJS, stateRef, stopMotion],
  );

  /** 놓을 때 속도로 멈출 위치를 예측하고 가장 가까운 항목에 맞춰 한 번에 감속합니다. */
  const release = React.useCallback(
    (velocity: number) => {
      "main thread";
      const offset = stateRef.current.offset;
      const target =
        nearestVirtualIndex(offset + velocity * PROJECTION_MS, config) * config.itemSize;
      const distance = target - offset;
      const timeConstant =
        distance * velocity > 0 && Math.abs(velocity) > MIN_FLING_VELOCITY
          ? clampNumber(distance / velocity, MIN_FLING_TIME_CONSTANT_MS, MAX_FLING_TIME_CONSTANT_MS)
          : SNAP_TIME_CONSTANT_MS;
      prepareMotion(target, timeConstant, true);
    },
    [prepareMotion, config, stateRef],
  );

  /** 누른 가상 위치로 이동하므로 loop 경계에서도 보이는 방향을 유지합니다. */
  const selectVirtualIndex = React.useCallback(
    (virtualIndex: number) => {
      "main thread";
      const target = config.loop ? virtualIndex : clampNumber(virtualIndex, 0, config.maxIndex);
      prepareMotion(target * config.itemSize, SNAP_TIME_CONSTANT_MS, true);
    },
    [prepareMotion, config],
  );

  const handleTouchStart = React.useCallback(
    (event: TouchEvent) => {
      "main thread";
      const state = stateRef.current;
      // An item's touchstart runs first while the event bubbles. Consume it so a later touch outside
      // the items cannot reuse it.
      const pressedVirtualIndex = state.pressedVirtualIndex;
      state.pressedVirtualIndex = null;
      state.tapVirtualIndex = null;
      if (!config.interactive || (event.touches?.length ?? 1) > 1) return;
      // A touch that stops a running motion only stops it.
      if (state.target === null) state.tapVirtualIndex = pressedVirtualIndex;
      stopMotion();
      state.phase = "pending";
      state.userDriven = true;
      state.startX = event.detail.x;
      state.startY = event.detail.y;
      state.startOffset = state.offset;
      state.samples = [Date.now(), event.detail.y];
      state.activeVirtual = nearestVirtualIndex(state.offset, config);
    },
    [config, stateRef, stopMotion],
  );

  const handleTouchMove = React.useCallback(
    (event: TouchEvent) => {
      "main thread";
      const state = stateRef.current;
      if (state.phase !== "pending" && state.phase !== "dragging") return;
      const deltaY = event.detail.y - state.startY;
      if (state.phase === "pending") {
        const deltaX = event.detail.x - state.startX;
        if (deltaX * deltaX + deltaY * deltaY < DRAG_SLOP * DRAG_SLOP) return;
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          state.phase = "ignored";
          return;
        }
        state.phase = "dragging";
      }
      const offset = state.startOffset - deltaY;
      applyOffset(
        config.loop
          ? offset
          : rubberBand(offset, config.maxIndex * config.itemSize, config.viewportSize),
      );
      pushSample(state.samples, Date.now(), event.detail.y);
    },
    [applyOffset, config, stateRef],
  );

  const endTouch = React.useCallback(
    (cancelled: boolean) => {
      "main thread";
      const state = stateRef.current;
      const phase = state.phase;
      if (phase === "idle") return;
      state.phase = "idle";
      const tapVirtualIndex = state.tapVirtualIndex;
      state.tapVirtualIndex = null;
      if (phase === "pending" && !cancelled && tapVirtualIndex !== null) {
        selectVirtualIndex(tapVirtualIndex);
        return;
      }
      release(phase === "dragging" && !cancelled ? releaseVelocity(state.samples, Date.now()) : 0);
    },
    [release, selectVirtualIndex, stateRef],
  );

  const handleTouchEnd = React.useCallback(() => {
    "main thread";
    endTouch(false);
  }, [endTouch]);

  const handleTouchCancel = React.useCallback(() => {
    "main thread";
    endTouch(true);
  }, [endTouch]);

  const scrollToIndex = React.useCallback(
    (nextIndex: number, smooth: boolean) => {
      "main thread";
      const state = stateRef.current;
      if (config.count === 0) return;
      if (state.phase !== "idle" || (state.userDriven && state.target !== null)) {
        return;
      }
      const target =
        virtualTargetFor(nextIndex, state.target ?? state.offset, config) * config.itemSize;
      if (state.target === target) return;
      prepareMotion(target, SNAP_TIME_CONSTANT_MS, false, !smooth);
    },
    [prepareMotion, config, stateRef],
  );

  const resetToIndex = React.useCallback(
    (nextIndex: number) => {
      "main thread";
      const state = stateRef.current;
      state.phase = "idle";
      state.settledVirtual = nextIndex;
      state.activeVirtual = nextIndex;
      prepareMotion(nextIndex * config.itemSize, SNAP_TIME_CONSTANT_MS, false, true);
    },
    [prepareMotion, config, stateRef],
  );

  const cancelInteraction = React.useCallback(() => {
    "main thread";
    const state = stateRef.current;
    if (state.phase === "idle" && !(state.userDriven && state.target !== null)) return;
    state.phase = "idle";
    prepareMotion(state.settledVirtual * config.itemSize, SNAP_TIME_CONSTANT_MS, false);
  }, [prepareMotion, config, stateRef]);

  // Runs before the index sync below so a layout change and an `index` change in the same commit reset
  // the main thread first and then move to the requested index.
  const layoutKey = `${count}:${itemSize}:${loopEnabled}:${windowRadius}`;
  const previousLayoutKeyRef = React.useRef(layoutKey);
  React.useEffect(() => {
    if (previousLayoutKeyRef.current === layoutKey) return;
    previousLayoutKeyRef.current = layoutKey;
    setPositionVirtual(settledPosition);
    runOnMainThread(resetToIndex)(settledPosition);
  }, [layoutKey, resetToIndex, settledPosition]);

  React.useEffect(() => {
    // A changed `index` is always forwarded: it may retarget a running move even when it equals the
    // last confirmed position. The main thread ignores requests that are already satisfied.
    const indexChanged = previousIndexRef.current !== index;
    previousIndexRef.current = index;
    if (!indexChanged && index === settledIndex) return;
    runOnMainThread(scrollToIndex)(index, indexChangeBehavior === "smooth");
  }, [index, indexChangeBehavior, scrollToIndex, settledIndex, syncRequest]);

  React.useEffect(() => {
    if (disabled) runOnMainThread(cancelInteraction)();
  }, [cancelInteraction, disabled]);

  React.useEffect(
    () => () => {
      runOnMainThread(stopMotion)();
    },
    [stopMotion],
  );

  const items = React.useMemo<LoopScrollItem[]>(() => {
    if (count === 0) return [];
    const start = loopEnabled ? renderWindow.start : Math.max(0, renderWindow.start);
    const end = loopEnabled ? renderWindow.end : Math.min(maxIndex, renderWindow.end);
    return Array.from({ length: Math.max(0, end - start + 1) }, (_, offset) => {
      const virtualIndex = start + offset;
      const index = loopEnabled ? ((virtualIndex % count) + count) % count : virtualIndex;
      const accessibleVirtual = index + Math.round((renderWindow.center - index) / count) * count;
      return {
        index,
        virtualIndex,
        isClone: loopEnabled && virtualIndex !== accessibleVirtual,
      };
    });
  }, [count, loopEnabled, maxIndex, renderWindow]);

  const getSettledTransform = React.useCallback(() => settledTransformRef.current, []);
  const contextValue = React.useMemo<LoopScrollContextValue>(
    () => ({
      items,
      stateRef,
      selectedIndex: index,
      moverRef,
      highlightMoverRef,
      itemSize,
      highlightTop: toPx((viewportSize - itemSize) / 2),
      getSettledTransform,
    }),
    [
      getSettledTransform,
      highlightMoverRef,
      index,
      itemSize,
      stateRef,
      items,
      moverRef,
      viewportSize,
    ],
  );

  const height = toPx(viewportSize);
  const rootStyle = React.useMemo(
    () =>
      typeof style === "string"
        ? `height:${height};overflow:hidden;${style}`
        : { height, overflow: "hidden", ...style },
    [height, style],
  );

  return (
    <view
      consume-slide-event={interactive ? consumeSlideEvent : undefined}
      {...nativeProps}
      {...(ref ? { ref: ref as ViewProps["ref"] } : {})}
      main-thread:catchtouchstart={chainMainThreadTouch(userTouchStart, handleTouchStart)}
      main-thread:catchtouchmove={chainMainThreadTouch(userTouchMove, handleTouchMove)}
      main-thread:catchtouchend={chainMainThreadTouch(userTouchEnd, handleTouchEnd)}
      main-thread:catchtouchcancel={chainMainThreadTouch(userTouchCancel, handleTouchCancel)}
      style={rootStyle}
    >
      <LoopScrollContext.Provider value={contextValue}>{children}</LoopScrollContext.Provider>
    </view>
  );
});
LoopScrollRoot.displayName = "LoopScrollRoot";

/**
 * 가운데를 기준으로 화면 주변 항목만 절대 위치에 배치하는 `<view>`입니다.
 * Root 바로 아래와 `LoopScroll.Highlight` 안에 각각 하나씩 둘 수 있으며, 두 Track은 같은 위치로 움직입니다.
 * 항목을 감싼 `<view>`에는 `seed-loop-scroll__item` class를, 선택한 `index`의 항목에는
 * `seed-loop-scroll__item--selected` class를 더합니다. 선택 class는 사용자 조작이 정착하거나 `index`가 바뀔 때 옮겨집니다.
 * 항목을 감싼 안쪽 `<view>`의 `transform`은 첫 화면에만 inline style로 그리고, 이후에는 Main Thread만 갱신합니다.
 */
export const LoopScrollTrack = React.forwardRef<unknown, LoopScrollTrackProps>((props, ref) => {
  const { children, style, ...nativeProps } = props;
  const context = useLoopScrollContext("Track");
  const inHighlight = React.useContext(LoopScrollHighlightContext);
  // Frozen for the lifetime of the mover so background renders never overwrite the main-thread position.
  const [moverStyle] = React.useState(() => ({ transform: context.getSettledTransform() }));
  const trackStyle = React.useMemo(
    () =>
      typeof style === "string"
        ? `position:absolute;top:50%;left:0px;right:0px;${style}`
        : { position: "absolute" as const, top: "50%", left: "0px", right: "0px", ...style },
    [style],
  );

  return (
    <view {...nativeProps} {...(ref ? { ref: ref as ViewProps["ref"] } : {})} style={trackStyle}>
      <view
        main-thread:ref={inHighlight ? context.highlightMoverRef : context.moverRef}
        implicit-animation={false}
        style={moverStyle}
      >
        {context.items.map((item) => (
          <LoopScrollTrackItem key={item.virtualIndex} item={item} context={context}>
            {children(item)}
          </LoopScrollTrackItem>
        ))}
      </view>
    </view>
  );
});
LoopScrollTrack.displayName = "LoopScrollTrack";

function LoopScrollTrackItem({
  item,
  context,
  children,
}: {
  item: LoopScrollItem;
  context: LoopScrollContextValue;
  children: React.ReactNode;
}) {
  const { virtualIndex } = item;
  const { stateRef, itemSize } = context;
  const handleTouchStart = React.useCallback(() => {
    "main thread";
    stateRef.current.pressedVirtualIndex = virtualIndex;
  }, [stateRef, virtualIndex]);
  const style = React.useMemo(
    () => ({
      position: "absolute" as const,
      top: toPx(virtualIndex * itemSize),
      left: "0px",
      right: "0px",
      height: toPx(itemSize),
    }),
    [itemSize, virtualIndex],
  );
  return (
    <view
      className={item.index === context.selectedIndex ? SELECTED_ITEM_CLASS_NAME : ITEM_CLASS_NAME}
      style={style}
      accessibility-elements-hidden={item.isClone ? true : undefined}
      main-thread:bindtouchstart={handleTouchStart}
    >
      {children}
    </view>
  );
}

/**
 * 가운데 항목 한 칸(`itemSize`) 높이로 안쪽 `LoopScroll.Track`을 잘라 보여주는 `<view>`입니다.
 * 창 안과 밖의 Track에 다른 스타일을 주면 칸 경계를 지나는 항목도 창 안쪽 부분만 다르게 보입니다.
 * 창 밖 Track보다 뒤에 렌더링해 위에 겹치게 합니다. 같은 내용을 한 번 더 그리므로 스크린 리더에서는 숨깁니다.
 * 창 안 항목을 눌러도 같은 항목을 선택합니다.
 */
export const LoopScrollHighlight = React.forwardRef<unknown, LoopScrollHighlightProps>(
  (props, ref) => {
    const { children, style, ...nativeProps } = props;
    const { highlightTop, itemSize } = useLoopScrollContext("Highlight");
    const height = toPx(itemSize);
    const highlightStyle = React.useMemo(
      () =>
        typeof style === "string"
          ? `position:absolute;top:${highlightTop};left:0px;right:0px;height:${height};overflow:hidden;${style}`
          : {
              position: "absolute" as const,
              top: highlightTop,
              left: "0px",
              right: "0px",
              height,
              overflow: "hidden" as const,
              ...style,
            },
      [height, highlightTop, style],
    );

    return (
      <view
        accessibility-elements-hidden
        {...nativeProps}
        {...(ref ? { ref: ref as ViewProps["ref"] } : {})}
        style={highlightStyle}
      >
        <LoopScrollHighlightContext.Provider value={true}>
          {children}
        </LoopScrollHighlightContext.Provider>
      </view>
    );
  },
);
LoopScrollHighlight.displayName = "LoopScrollHighlight";
