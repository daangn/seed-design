import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
} from "@lynx-js/react";
import type { NodesRef } from "@lynx-js/types";
import type { Placement, Position, Rect, Side } from "@seed-design/lynx-react-floating";
import { useControllableState } from "@seed-design/lynx-react-use-controllable-state";

export interface UsePopoverProps {
  open?: boolean;

  defaultOpen?: boolean;

  /** 사용자 동작으로 열림 상태를 바꿀 때 호출합니다. controlled 상태에서도 호출합니다. */
  onOpenChange?: (open: boolean) => void;

  /** @default "bottom" */
  placement?: Placement;

  /** 기준 요소와 콘텐츠 사이 간격(px)입니다. 화살표 돌출 길이는 여기에 더합니다. @default 0 */
  gutter?: number;

  /** 화면 가장자리와 유지할 최소 간격(px)입니다. @default 8 */
  overflowPadding?: number;

  /** 화살표와 콘텐츠 모서리 사이의 최소 간격(px)입니다. @default 4 */
  arrowPadding?: number;

  /** 공간이 부족할 때 반대 방향으로 뒤집을지 정합니다. @default true */
  flip?:
    | boolean
    | {
        fallbackStrategy?: "bestFit" | "initialPlacement";
        fallbackPlacements?: Placement[];
      };

  /**
   * `true`이면 기준 요소와 콘텐츠 밖을 탭했을 때 닫습니다. 탭을 가로채지 않으므로 그 탭은 아래 요소에도
   * 그대로 전달됩니다. 페이지의 탭을 `global-bindtap`으로 받아 탭 좌표로 판정합니다.
   * @default true
   */
  closeOnInteractOutside?: boolean;
}

/** `PopoverArrow`가 위치 계산에 등록하는 화살표 크기입니다. */
export interface PopoverArrowGeometry {
  /** 회전하는 정사각형 화살표 컨테이너의 한 변(px)입니다. */
  size: number;
  /** 콘텐츠 가장자리에서 화살표 끝이 튀어나온 길이(px)입니다. `gutter`에 더합니다. */
  tipHeight: number;
}

export interface UsePopoverReturn {
  open: boolean;
  /** Positioner를 렌더링하는 동안 `true`입니다. 닫힘 전환이 끝날 때까지 유지합니다. */
  mounted: boolean;
  /** 현재 열림에서 위치 계산을 마쳤으면 `true`입니다. 그 전에는 콘텐츠를 숨기세요. */
  positioned: boolean;
  /** 계산된 배치의 방향입니다. 계산 전에는 `placement`의 방향입니다. */
  side: Side;
  /** `boundingClientRect`의 `relativeTo: "screen"` 좌표입니다. 아래 rect도 같은 좌표계입니다. */
  position: Position | null;
  referenceRect: Rect | null;
  /** 측정 경계로 쓴 Lynx root의 rect입니다. 탭 좌표(page 기준)를 같은 좌표계로 바꾸는 데 씁니다. */
  rootRect: Rect | null;
  /** overlay 모드 레이어의 rect입니다. view 모드에서는 `null`입니다. */
  layerRect: Rect | null;
  closeOnInteractOutside: boolean;
  placement: Placement;
  gutter: number;
  overflowPadding: number;
  arrowPadding: number;
  flip: NonNullable<UsePopoverProps["flip"]>;
  setOpen: (open: boolean) => void;
  /**
   * 닫힘 전환이 끝났을 때 호출해 Positioner를 unmount합니다. 호출하지 않으면 `PopoverContent`가
   * 닫힌 뒤 200ms에 호출합니다.
   */
  finishClose: () => void;
  /** 기준 요소의 크기·위치가 바뀌었을 때 다시 측정하도록 요청합니다. */
  requestPositionUpdate: () => void;
  /** 열릴 때마다 1씩 늘어납니다. 늦게 끝난 측정을 버리는 데 씁니다. */
  openEpoch: number;
  positionRevision: number;
  anchorRef: MutableRefObject<NodesRef | null>;
  triggerRef: MutableRefObject<NodesRef | null>;
  layerRef: MutableRefObject<NodesRef | null>;
  arrowRef: MutableRefObject<PopoverArrowGeometry | null>;
  isOpenRef: MutableRefObject<boolean>;
  openEpochRef: MutableRefObject<number>;
  positionRevisionRef: MutableRefObject<number>;
  setPosition: (
    position: Position,
    referenceRect: Rect,
    rootRect: Rect,
    layerRect: Rect | null,
  ) => void;
  resetPosition: () => void;
}

function isSameRect(left: Rect | null, right: Rect | null) {
  return (
    left !== null &&
    right !== null &&
    left.left === right.left &&
    left.top === right.top &&
    left.right === right.right &&
    left.bottom === right.bottom &&
    left.width === right.width &&
    left.height === right.height
  );
}

function isSamePosition(left: Position | null, right: Position) {
  return (
    left !== null &&
    left.left === right.left &&
    left.top === right.top &&
    left.width === right.width &&
    left.height === right.height &&
    left.placement === right.placement &&
    left.transformOrigin === right.transformOrigin &&
    left.availableWidth === right.availableWidth &&
    left.availableHeight === right.availableHeight &&
    left.arrow?.left === right.arrow?.left &&
    left.arrow?.top === right.arrow?.top &&
    left.arrow?.centerOffset === right.arrow?.centerOffset
  );
}

/**
 * @platform Lynx
 *
 * Popover의 열림 상태, 닫힘 전환 동안의 mount, 열림마다 바뀌는 측정 epoch와 위치 결과를 관리하는
 * headless 훅입니다. native 측정은 `PopoverContent`가 하고, 결과를 `setPosition`으로 저장합니다.
 */
export function usePopover(props: UsePopoverProps = {}): UsePopoverReturn {
  const {
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    placement = "bottom",
    gutter = 0,
    overflowPadding = 8,
    arrowPadding = 4,
    flip = true,
    closeOnInteractOutside = true,
  } = props;
  const [open, setOpenState] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
  });
  const [mounted, setMounted] = useState(open);
  const [position, setPositionState] = useState<Position | null>(null);
  const [positionedEpoch, setPositionedEpoch] = useState<number | null>(null);
  const [referenceRect, setReferenceRect] = useState<Rect | null>(null);
  const [rootRect, setRootRect] = useState<Rect | null>(null);
  const [layerRect, setLayerRect] = useState<Rect | null>(null);
  const [positionRevision, setPositionRevision] = useState(0);
  const positionRevisionRef = useRef(0);
  const isOpenRef = useRef(open);
  const openEpochRef = useRef(0);
  const anchorRef = useRef<NodesRef | null>(null);
  const triggerRef = useRef<NodesRef | null>(null);
  const layerRef = useRef<NodesRef | null>(null);
  const arrowRef = useRef<PopoverArrowGeometry | null>(null);

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
    (nextOpen: boolean) => {
      "background only";
      if (nextOpen === open) return;
      setOpenState(nextOpen);
      onOpenChange?.(nextOpen);
    },
    [onOpenChange, open, setOpenState],
  );
  const finishClose = useCallback(() => {
    "background only";
    if (isOpenRef.current) return;
    setMounted(false);
    setPositionedEpoch(null);
    setPositionState(null);
    setReferenceRect(null);
    setRootRect(null);
    setLayerRect(null);
  }, []);
  const setPosition = useCallback(
    (
      nextPosition: Position,
      nextReferenceRect: Rect,
      nextRootRect: Rect,
      nextLayerRect: Rect | null,
    ) => {
      setPositionState((previous) =>
        isSamePosition(previous, nextPosition) ? previous : nextPosition,
      );
      setReferenceRect((previous) =>
        isSameRect(previous, nextReferenceRect) ? previous : nextReferenceRect,
      );
      setRootRect((previous) => (isSameRect(previous, nextRootRect) ? previous : nextRootRect));
      setLayerRect((previous) =>
        previous === nextLayerRect || isSameRect(previous, nextLayerRect)
          ? previous
          : nextLayerRect,
      );
      setPositionedEpoch(openEpochRef.current);
    },
    [],
  );
  const resetPosition = useCallback(() => {
    setPositionState(null);
    setReferenceRect(null);
    setRootRect(null);
    setLayerRect(null);
    setPositionedEpoch(null);
  }, []);
  const requestPositionUpdate = useCallback(() => {
    positionRevisionRef.current += 1;
    setPositionRevision(positionRevisionRef.current);
  }, []);
  const side = (position?.placement ?? placement).split("-")[0] as Side;

  return useMemo(
    () => ({
      open,
      mounted,
      positioned,
      side,
      position,
      referenceRect,
      rootRect,
      layerRect,
      closeOnInteractOutside,
      placement,
      gutter,
      overflowPadding,
      arrowPadding,
      flip,
      setOpen,
      finishClose,
      requestPositionUpdate,
      openEpoch,
      positionRevision,
      anchorRef,
      triggerRef,
      layerRef,
      arrowRef,
      isOpenRef,
      openEpochRef,
      positionRevisionRef,
      setPosition,
      resetPosition,
    }),
    [
      open,
      mounted,
      positioned,
      side,
      position,
      referenceRect,
      rootRect,
      layerRect,
      closeOnInteractOutside,
      placement,
      gutter,
      overflowPadding,
      arrowPadding,
      flip,
      setOpen,
      finishClose,
      requestPositionUpdate,
      openEpoch,
      positionRevision,
      setPosition,
      resetPosition,
    ],
  );
}
