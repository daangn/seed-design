import type { ReactElement } from "@lynx-js/react";
// Copyright 2026 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
// Modified by SEED Design: adapt style typing and finish canceled drags.

import { runOnMainThread, useEffect, useMemo, useRef } from "@lynx-js/react";

import { useMemoizedFn } from "@lynx-js/lynx-ui-common";

import { SheetDragContext, useSheetContext } from "../context";
import { useSnap, useSnapTouches } from "../hooks";
import type { SheetContentProps, SheetTransition } from "../types";
import { getDefaultRubberBand } from "../utils";

const DEFAULT_SNAP_POINTS: Array<number | string> = ["fit"];
const DEFAULT_TRANSITION: SheetTransition = {
  type: "spring",
  stiffness: 200,
  damping: 60,
};

export function SheetContent(props: SheetContentProps): ReactElement {
  const {
    snapAnimation = DEFAULT_TRANSITION,
    children,
    enterAnimation,
    exitAnimation,
    className,
    style,
    innerClassName,
    innerStyle,
    ...rest
  } = props;

  const {
    sheetProgress,
    registerMethods,
    snapPoints = DEFAULT_SNAP_POINTS,
    initialSnap = 0,
    side,
    enableRTL,
    resolvedSide,
    rubberBand,
    dragDisabled = false,
    dismissThreshold = 0.15,
    handleOnly,
    enableDragToClose = true,
    screenHeight,
    screenWidth,
    layerSize,
    onSnapChange,
    onShowChange,
    claimedGestureAngles,
    presenceStateMTRef,
    onUnmount,
    onOpen,
    onClose,
    show: showFromContext,
  } = useSheetContext();
  const isHorizontal = resolvedSide === "left" || resolvedSide === "right";
  const isTop = resolvedSide === "top";
  // % snap point는 레이어 크기 없이 계산할 수 없으므로, 크기를 받기 전 진입은 fit처럼 대기시킨다.
  const waitForViewport =
    (isHorizontal ? screenWidth : screenHeight) === undefined &&
    snapPoints.some((p) => String(p).trim().endsWith("%"));
  const effectiveRubberBand = rubberBand ?? getDefaultRubberBand(resolvedSide);

  // 컨트롤러가 반영한 상태를 외부 변경으로 다시 처리하면 진입·닫기 애니메이션이 중복 실행된다.
  const isInternalChangeRef = useRef(false);

  const handleBeforeDismiss = useMemoizedFn(() => {
    isInternalChangeRef.current = true;
    onShowChange?.(false);
  });

  const handleDismissed = useMemoizedFn(() => {
    onClose?.();
  });

  const handleEntered = useMemoizedFn(() => {
    onOpen?.();
  });

  const handleResurrected = useMemoizedFn(() => {
    isInternalChangeRef.current = true;
    onShowChange?.(true);
  });

  const {
    setSheetMTRef,
    snapTo,
    expand,
    collapse,
    close,
    show: showSheet,
    yRef,
    viewportSize,
    snapOffsets,
    snapPointValues,
    minOffset,
    sheetSizeMTRef,
    maxOffset,
    getResolvedSnapOffsets,
    getResolvedSnapPointValues,
    handleSheetLayoutChangeMT,
    resolvePendingSnapMT,
    setContentMTRef,
    maxSnapSize,
    onDragStartMT,
    onDragEndSnapMT,
    onDragEndCloseMT,
  } = useSnap({
    snapPoints,
    initialSnap,
    snapAnimation,
    side,
    enableRTL,
    screenHeight,
    screenWidth,
    waitForViewport,
    onSnapChange,
    onDismiss: handleDismissed,
    onBeforeDismiss: handleBeforeDismiss,
    onEntered: handleEntered,
    enterAnimation,
    exitAnimation,
    rubberBand: effectiveRubberBand,
    sheetProgress,
    presenceStateMTRef,
    onUnmount,
    onResurrected: handleResurrected,
  });

  const { handleTouchStartMT, handleTouchMoveMT, handleTouchEndMT } = useSnapTouches({
    side,
    enableRTL,
    dragDisabled,
    rubberBand: effectiveRubberBand,
    flingEnabled: true,
    flingDeceleration: 2000,
    flingMinVelocity: 200,
    dismissThreshold,
    enableDragToClose,
    yRef,
    viewportSize,
    snapOffsets,
    snapPointValues,
    minOffset,
    maxOffset,
    sheetSizeMTRef,
    getResolvedSnapOffsets,
    getResolvedSnapPointValues,
    claimedGestureAngles,
    onDragStartMT,
    onDragEndSnapMT,
    onDragEndCloseMT,
  });

  // 레이어 크기를 받은 렌더에서 새 snap 값으로 대기 중인 진입을 실행한다.
  const resolvePendingSnap = useMemoizedFn(() => {
    runOnMainThread(resolvePendingSnapMT)();
  });
  useEffect(() => {
    if (!waitForViewport) resolvePendingSnap();
  }, [waitForViewport, resolvePendingSnap]);

  // controlled 모드의 첫 show=true에서도 진입을 실행하도록 이전 값을 false로 시작한다.
  const prevShowRef = useRef(false);

  useEffect(() => {
    if (prevShowRef.current !== showFromContext) {
      if (isInternalChangeRef.current) {
        isInternalChangeRef.current = false;
      } else {
        if (showFromContext) {
          showSheet();
        } else {
          close();
        }
      }
      prevShowRef.current = showFromContext;
    }
  }, [showFromContext, showSheet, close]);

  useEffect(() => {
    registerMethods({
      snapTo,
      expand,
      collapse,
      close,
      show: showSheet,
    });
    return () => {
      registerMethods(null);
    };
  }, [registerMethods, snapTo, expand, collapse, close, showSheet]);

  const contextValue = useMemo(
    () => ({
      dragHandlers: {
        handleTouchStartMT,
        handleTouchMoveMT,
        handleTouchEndMT,
      },
    }),
    [handleTouchStartMT, handleTouchMoveMT, handleTouchEndMT],
  );
  const hasFitSnapPoint = snapPoints.some((p) => String(p).trim() === "fit");
  // 측정 전에는 기존 viewport 단위를 쓴다. 화면 전체 LynxView에서는 두 값이 같다.
  const layerWidth = layerSize.width === undefined ? "100vw" : `${layerSize.width}px`;
  const layerHeight = layerSize.height === undefined ? "100vh" : `${layerSize.height}px`;
  const scaledLayerWidth = layerSize.width === undefined ? "150vw" : `${layerSize.width * 1.5}px`;
  const scaledLayerHeight =
    layerSize.height === undefined ? "150vh" : `${layerSize.height * 1.5}px`;

  const horizontalContent = (
    <view
      {...rest}
      className={innerClassName}
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        ...(resolvedSide === "left" ? { right: 0 } : { left: 0 }),
        height: "100%",
        ...(innerStyle as React.CSSProperties),
        ...(hasFitSnapPoint ? {} : { width: `${maxSnapSize}px` }),
      }}
      event-through={false}
      main-thread:ref={setContentMTRef}
      main-thread:bindtouchstart={handleOnly ? undefined : handleTouchStartMT}
      main-thread:bindtouchmove={handleOnly ? undefined : handleTouchMoveMT}
      main-thread:bindtouchend={handleOnly ? undefined : handleTouchEndMT}
      main-thread:bindtouchcancel={handleOnly ? undefined : handleTouchEndMT}
      main-thread:bindlayoutchange={handleSheetLayoutChangeMT}
    >
      <SheetDragContext.Provider value={contextValue}>{children}</SheetDragContext.Provider>
    </view>
  );

  if (isHorizontal) {
    return (
      <view
        className={className}
        style={{
          position: "absolute",
          top: 0,
          ...(resolvedSide === "left" ? { right: "100%" } : { left: "100%" }),
          width: scaledLayerWidth,
          height: layerHeight,
          overflow: "hidden",
          transform: "translate(0px, 0px)",
          ...(style as React.CSSProperties),
        }}
        main-thread:ref={setSheetMTRef}
        implicit-animation="false"
        event-through={true}
      >
        {horizontalContent}
      </view>
    );
  }

  return (
    <view
      className={className}
      style={{
        position: "absolute",
        left: 0,
        ...(isTop
          ? {
              bottom: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
            }
          : {
              top: "100%",
            }),
        width: layerWidth,
        height: scaledLayerHeight,
        overflow: "hidden",
        transform: "translate(0px, 0px)",
        ...(style as React.CSSProperties),
      }}
      main-thread:ref={setSheetMTRef}
      implicit-animation="false"
      event-through={false}
      main-thread:bindtouchstart={handleOnly ? undefined : handleTouchStartMT}
      main-thread:bindtouchmove={handleOnly ? undefined : handleTouchMoveMT}
      main-thread:bindtouchend={handleOnly ? undefined : handleTouchEndMT}
      main-thread:bindtouchcancel={handleOnly ? undefined : handleTouchEndMT}
    >
      <view
        {...rest}
        className={innerClassName}
        style={{
          width: "100%",
          ...(innerStyle as React.CSSProperties),
          ...(hasFitSnapPoint ? {} : { height: `${maxSnapSize}px` }),
        }}
        main-thread:ref={setContentMTRef}
        main-thread:bindlayoutchange={handleSheetLayoutChangeMT}
      >
        <SheetDragContext.Provider value={contextValue}>{children}</SheetDragContext.Provider>
      </view>
    </view>
  );
}
