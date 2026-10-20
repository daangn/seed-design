import type { ReactElement } from "@lynx-js/react";
// Copyright 2026 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
// Modified by SEED Design: adapt style typing to the workspace ReactLynx version.

import { useEffect, useMemo, useRef } from "@lynx-js/react";

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
  const effectiveRubberBand = rubberBand ?? getDefaultRubberBand(resolvedSide);

  // Track if show state changes are internal (from controller) vs external (from prop/context)
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

  // Handle resurrection - when user drags during close animation
  const handleResurrected = useMemoizedFn(() => {
    isInternalChangeRef.current = true;
    onShowChange?.(true);
  });

  // Core snap logic (shared between touch and gesture-handler variants)
  const {
    setSheetMTRef,
    snapTo,
    expand,
    collapse,
    close,
    show: showSheet,
    // internals for touch handling
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
    setContentMTRef,
    maxSnapSize,
    // Controller exports
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

  // Touch-based input handling (can be swapped with gesture-handler variant)
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
    // Controller handlers
    onDragStartMT,
    onDragEndSnapMT,
    onDragEndCloseMT,
  });

  // Track previous show state to detect changes
  // Initialize to false to ensure controlled mode mounts trigger showSheet()
  const prevShowRef = useRef(false);

  // React to show changes from context (e.g., controlled mode, backdrop click)
  // Only act on EXTERNAL changes, not internal state updates from controller
  useEffect(() => {
    if (prevShowRef.current !== showFromContext) {
      if (isInternalChangeRef.current) {
        // Internal change from controller - skip, already handled
        isInternalChangeRef.current = false;
      } else {
        // External change - trigger show/close
        if (showFromContext) {
          showSheet();
        } else {
          close();
        }
      }
      prevShowRef.current = showFromContext;
    }
  }, [showFromContext, showSheet, close]);

  // Register methods with SheetRoot on mount, unregister on unmount
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
          width: "150vw",
          height: "100vh",
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
        width: "100vw",
        height: "150vh",
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
