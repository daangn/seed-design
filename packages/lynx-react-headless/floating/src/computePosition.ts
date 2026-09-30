import {
  arrow as arrowMiddleware,
  computePosition as computeFloatingPosition,
  flip,
  limitShift,
  offset,
  shift,
  size,
  type Platform,
  type Rect as FloatingRect,
} from "@floating-ui/core";

export type Side = "top" | "right" | "bottom" | "left";
export type Placement = Side | `${Side}-${"start" | "end"}`;

export interface Rect {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

export interface Position {
  /** 가용 크기는 콘텐츠 크기와 별개이며 0 이상입니다. */
  availableWidth: number;
  availableHeight: number;
  /** 콘텐츠 내부 좌표입니다. 나머지 축은 placement의 반대쪽 가장자리에 붙입니다. */
  arrow?: { left?: number; top?: number; centerOffset: number };
  left: number;
  top: number;
  width: number;
  height: number;
  placement: Placement;
  transformOrigin: string;
}

interface ReferenceElement {
  rect: FloatingRect;
}

interface FloatingElement {
  dimensions: {
    width: number;
    height: number;
  };
}

export interface PositioningOptions {
  placement: Placement;
  gutter: number;
  overflowPadding: number;
  flip?:
    | false
    | {
        fallbackStrategy?: "bestFit" | "initialPlacement";
        fallbackPlacements?: Placement[];
      };
  shift?:
    | false
    | {
        mainAxis?: boolean;
        crossAxis?: boolean;
        /** reference에서 완전히 떨어지지 않도록 이동을 제한합니다. */
        limit?: boolean;
      };
  /** 생략하면 원래 높이를 보존합니다. 너비 제한은 호출자가 적용합니다. */
  size?: {
    order: "beforeFlip" | "afterShift";
    minimumHeight?: number;
  };
  arrow?: {
    /** 회전 가능한 정사각형 화살표 컨테이너의 한 변입니다. */
    size: number;
    /** 컨테이너 크기와 별개인 화살표 끝의 돌출 길이입니다. gutter에 더합니다. */
    tipHeight: number;
    padding: number;
  };
}

export interface ComputePositionOptions extends PositioningOptions {
  reference: Rect;
  boundary: Rect;
  width: number;
  height: number;
}

function getTransformOrigin(placement: Placement) {
  const [side, align] = placement.split("-") as [Side, "start" | "end" | undefined];
  const crossOrigin = align === "start" ? "0%" : align === "end" ? "100%" : "50%";
  return side === "top"
    ? `${crossOrigin} 100%`
    : side === "bottom"
      ? `${crossOrigin} 0%`
      : side === "left"
        ? `100% ${crossOrigin}`
        : `0% ${crossOrigin}`;
}

/**
 * 모든 좌표와 크기는 동일한 화면 기준 논리 px입니다.
 * boundary의 safe area 보정과 결과의 컨테이너 상대 좌표 변환은 호출자 책임입니다.
 *
 * availableWidth로 너비를 제한했다면 줄바꿈 후 실제 높이를 다시 측정해 호출합니다.
 * native 측정·호출 주기·오래된 비동기 결과 폐기는 이 순수 계산에 포함하지 않습니다.
 */
export async function computePosition({
  reference,
  boundary,
  width,
  height,
  placement,
  gutter,
  overflowPadding,
  flip: flipOptions = {},
  shift: shiftOptions = {},
  size: sizeOptions,
  arrow: arrowOptions,
}: ComputePositionOptions): Promise<Position> {
  const referenceElement: ReferenceElement = {
    rect: {
      x: reference.left,
      y: reference.top,
      width: reference.width,
      height: reference.height,
    },
  };
  const floatingElement: FloatingElement = {
    dimensions: {
      width: Math.max(0, width),
      height: Math.max(0, height),
    },
  };
  const arrowElement = arrowOptions
    ? { width: arrowOptions.size, height: arrowOptions.size }
    : undefined;
  const clippingRect: FloatingRect = {
    x: boundary.left,
    y: boundary.top,
    width: boundary.width,
    height: boundary.height,
  };
  const maximumHeight = floatingElement.dimensions.height;
  let availableWidth = 0;
  let availableHeight = 0;
  const platform: Platform = {
    getElementRects: () => ({
      reference: referenceElement.rect,
      floating: {
        x: 0,
        y: 0,
        ...floatingElement.dimensions,
      },
    }),
    getClippingRect: () => clippingRect,
    getDimensions: (element) =>
      element === arrowElement && arrowElement ? arrowElement : floatingElement.dimensions,
    isElement: () => true,
    isRTL: () => false,
  };
  const heightMiddleware =
    sizeOptions &&
    size({
      padding: overflowPadding,
      apply({ availableHeight }) {
        floatingElement.dimensions.height = Math.min(
          maximumHeight,
          Math.max(0, sizeOptions.minimumHeight ?? 0, availableHeight),
        );
      },
    });

  const result = await computeFloatingPosition(referenceElement, floatingElement, {
    placement,
    strategy: "absolute",
    platform,
    middleware: [
      offset(gutter + (arrowOptions?.tipHeight ?? 0)),
      sizeOptions?.order === "beforeFlip" && heightMiddleware,
      flipOptions !== false &&
        flip({
          ...flipOptions,
          padding: overflowPadding,
        }),
      shiftOptions !== false &&
        shift({
          mainAxis: shiftOptions.mainAxis,
          crossAxis: shiftOptions.crossAxis,
          padding: overflowPadding,
          limiter: shiftOptions.limit ? limitShift() : undefined,
        }),
      sizeOptions?.order === "afterShift" && heightMiddleware,
      arrowElement &&
        arrowMiddleware({
          element: arrowElement,
          padding: arrowOptions?.padding,
        }),
      // flip·shift·arrow 보정 후의 제약을 반환하며, 여기서는 크기를 바꾸지 않습니다.
      size({
        padding: overflowPadding,
        apply(available) {
          availableWidth = Math.max(0, available.availableWidth);
          availableHeight = Math.max(0, available.availableHeight);
        },
      }),
    ],
  });
  const resolvedPlacement = result.placement as Placement;
  const arrow = result.middlewareData.arrow;

  return {
    left: result.x,
    top: result.y,
    width: floatingElement.dimensions.width,
    height: floatingElement.dimensions.height,
    placement: resolvedPlacement,
    transformOrigin: getTransformOrigin(resolvedPlacement),
    availableWidth,
    availableHeight,
    ...(arrow && { arrow: { left: arrow.x, top: arrow.y, centerOffset: arrow.centerOffset } }),
  };
}
