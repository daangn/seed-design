import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
} from "@lynx-js/react";
import type { BaseEvent, IntrinsicElements, NodesRef } from "@lynx-js/types";
import type { Placement, Position, Rect } from "@seed-design/lynx-react-floating";
import { useControllableState } from "@seed-design/lynx-react-use-controllable-state";

type ViewProps = IntrinsicElements["view"];

/**
 * 열림 상태가 바뀐 원인입니다.
 *
 * - `"trigger"`: Trigger를 탭했습니다.
 * - `"interactOutside"`: 메뉴 바깥(backdrop)을 탭했습니다.
 * - `"itemClick"`: 활성 항목을 탭했습니다.
 * - `"dismiss"`: `container`를 지정한 native overlay가 닫힘을 요청했습니다. Android 뒤로 가기가 해당합니다.
 */
export type MenuOpenChangeReason = "trigger" | "interactOutside" | "itemClick" | "dismiss";

export interface MenuOpenChangeDetails {
  reason: MenuOpenChangeReason;
  event: BaseEvent;
}

/** Trigger가 등록하는 tap handler입니다. 열린 동안 Positioner가 Trigger 위치의 탭 영역에 연결합니다. */
export type MenuTriggerHandlers = Pick<ViewProps, "bindtap" | "main-thread:bindtap">;

export interface UseMenuProps {
  open?: boolean;

  defaultOpen?: boolean;

  /** 사용자 동작으로 열림 상태를 바꿀 때 호출합니다. controlled 상태에서도 호출합니다. */
  onOpenChange?: (open: boolean, details: MenuOpenChangeDetails) => void;

  /** `true`이면 열 수 없습니다. 이미 열린 메뉴는 닫을 수 있습니다. @default false */
  disabled?: boolean;

  /** @default "bottom" */
  placement?: Placement;

  /** 기준 요소와 콘텐츠 사이 간격(px)입니다. @default 8 */
  gutter?: number;

  /** 화면 가장자리와 유지할 최소 간격(px)입니다. @default 8 */
  overflowPadding?: number;

  /** `true`이면 콘텐츠 너비를 기준 요소(Anchor 또는 Trigger) 너비에 맞춥니다. @default false */
  matchReferenceWidth?: boolean;
}

export interface UseMenuReturn {
  open: boolean;
  /** Positioner를 렌더링하는 동안 `true`입니다. 닫힘 전환이 끝날 때까지 유지합니다. */
  mounted: boolean;
  /** 현재 열림에서 위치 계산을 마쳤으면 `true`입니다. 그 전에는 `MenuContent`가 콘텐츠를 숨깁니다. */
  positioned: boolean;
  disabled: boolean;
  placement: Placement;
  gutter: number;
  overflowPadding: number;
  matchReferenceWidth: boolean;
  /** `boundingClientRect`의 `relativeTo: "screen"` 좌표입니다. 아래 rect도 같은 좌표계입니다. */
  position: Position | null;
  /** Positioner 레이어의 rect입니다. 콘텐츠는 이 rect를 뺀 레이어 기준 좌표로 배치합니다. */
  layerRect: Rect | null;
  triggerRect: Rect | null;
  /** 열릴 때마다 1씩 늘어납니다. 늦게 끝난 측정을 버리는 데 씁니다. */
  openEpoch: number;
  setOpen: (open: boolean, details: MenuOpenChangeDetails) => void;
  /**
   * 닫힘 전환이 끝났을 때 호출해 Positioner를 unmount합니다. 호출하지 않으면 `MenuContent`가 닫힌 뒤
   * 200ms에 호출합니다. `immediate`이면 열림 상태와 관계없이 즉시 unmount합니다.
   */
  finishClose: (immediate?: boolean) => void;
  setPosition: (position: Position, layerRect: Rect, triggerRect: Rect | null) => void;
  resetPosition: () => void;
  triggerHandlers: MenuTriggerHandlers;
  setTriggerHandlers: (handlers: MenuTriggerHandlers) => void;
  anchorRef: MutableRefObject<NodesRef | null>;
  triggerRef: MutableRefObject<NodesRef | null>;
  layerRef: MutableRefObject<NodesRef | null>;
  isOpenRef: MutableRefObject<boolean>;
  openEpochRef: MutableRefObject<number>;
}

/**
 * @platform Lynx
 *
 * Menu의 열림 상태, 닫힘 전환 동안의 mount, 열림마다 바뀌는 측정 epoch와 위치 결과를 관리하는
 * headless 훅입니다. native 측정은 `MenuContent`가 하고 결과를 `setPosition`으로 저장합니다.
 */
export function useMenu(props: UseMenuProps = {}): UseMenuReturn {
  const {
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    disabled = false,
    placement = "bottom",
    gutter = 8,
    overflowPadding = 8,
    matchReferenceWidth = false,
  } = props;
  const [open, setOpenState] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
  });
  const [mounted, setMounted] = useState(open);
  const [positionedEpoch, setPositionedEpoch] = useState<number | null>(null);
  const [position, setPositionState] = useState<Position | null>(null);
  const [layerRect, setLayerRect] = useState<Rect | null>(null);
  const [triggerRect, setTriggerRect] = useState<Rect | null>(null);
  const [triggerHandlers, setTriggerHandlers] = useState<MenuTriggerHandlers>({});
  const isOpenRef = useRef(open);
  const openEpochRef = useRef(0);
  const anchorRef = useRef<NodesRef | null>(null);
  const triggerRef = useRef<NodesRef | null>(null);
  const layerRef = useRef<NodesRef | null>(null);

  if (open && !isOpenRef.current) openEpochRef.current += 1;
  isOpenRef.current = open;
  const openEpoch = openEpochRef.current;
  const positioned = positionedEpoch === openEpoch;

  useEffect(() => {
    "background only";
    if (open) {
      setMounted(true);
      return;
    }
    if (!positioned) setMounted(false);
  }, [open, positioned]);

  const setOpen = useCallback(
    (nextOpen: boolean, details: MenuOpenChangeDetails) => {
      "background only";
      if (disabled && nextOpen) return;
      if (nextOpen === open) return;
      setOpenState(nextOpen);
      onOpenChange?.(nextOpen, details);
    },
    [disabled, onOpenChange, open, setOpenState],
  );
  const finishClose = useCallback((immediate = false) => {
    "background only";
    if (!immediate && isOpenRef.current) return;
    setMounted(false);
    setPositionedEpoch(null);
  }, []);
  const setPosition = useCallback(
    (nextPosition: Position, nextLayerRect: Rect, nextTriggerRect: Rect | null) => {
      setPositionState((previous) =>
        previous?.left === nextPosition.left &&
        previous.top === nextPosition.top &&
        previous.width === nextPosition.width &&
        previous.height === nextPosition.height &&
        previous.placement === nextPosition.placement
          ? previous
          : nextPosition,
      );
      setLayerRect(nextLayerRect);
      setTriggerRect(nextTriggerRect);
      setPositionedEpoch(openEpochRef.current);
    },
    [],
  );
  const resetPosition = useCallback(() => {
    setPositionState(null);
    setLayerRect(null);
    setTriggerRect(null);
    setPositionedEpoch(null);
  }, []);

  return useMemo(
    () => ({
      open,
      mounted,
      positioned,
      disabled,
      placement,
      gutter,
      overflowPadding,
      matchReferenceWidth,
      position,
      layerRect,
      triggerRect,
      openEpoch,
      setOpen,
      finishClose,
      setPosition,
      resetPosition,
      triggerHandlers,
      setTriggerHandlers,
      anchorRef,
      triggerRef,
      layerRef,
      isOpenRef,
      openEpochRef,
    }),
    [
      open,
      mounted,
      positioned,
      disabled,
      placement,
      gutter,
      overflowPadding,
      matchReferenceWidth,
      position,
      layerRect,
      triggerRect,
      openEpoch,
      setOpen,
      finishClose,
      setPosition,
      resetPosition,
      triggerHandlers,
    ],
  );
}
