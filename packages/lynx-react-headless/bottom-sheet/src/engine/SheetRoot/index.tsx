import type { ForwardRefExoticComponent, RefAttributes } from "@lynx-js/react";
// Copyright 2026 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
// Modified by SEED Design: internalized and adapted to the SEED workspace.
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMainThreadRef,
  useMemo,
  useRef,
  useState,
} from "@lynx-js/react";

import { useMemoizedFn } from "@lynx-js/lynx-ui-common";
import { PresenceState } from "@lynx-js/lynx-ui-presence";
import { useMotionValueRef } from "@lynx-js/motion/mini";

import { SheetContext } from "../context";
import type { SheetMethods } from "../context";
import type { SheetRootProps, SheetRootRef } from "../types";
import { resolveSheetSide } from "../utils";

export const SheetRoot: ForwardRefExoticComponent<SheetRootProps & RefAttributes<SheetRootRef>> =
  forwardRef<SheetRootRef, SheetRootProps>((props, ref) => {
    const {
      show,
      defaultShow = false,
      forceMount = false,
      children,
      onOpen,
      onClose,
      onShowChange,
      snapPoints,
      initialSnap,
      onSnapChange: onSnapChangeProp,
      side = "bottom",
      enableRTL = false,
      screenHeight,
      screenWidth,
      rubberBand,
      dragDisabled,
      dismissThreshold,
      handleOnly,
      enableDragToClose,
      claimedGestureAngles,
    } = props;
    const sheetProgress = useMotionValueRef<number>(0);
    const presenceStateMTRef = useMainThreadRef<PresenceState>(PresenceState.Left);
    const resolvedSide = resolveSheetSide(side, enableRTL);

    const isControlled = show !== undefined;
    const [uncontrolledShow, setUncontrolledShow] = useState<boolean>(defaultShow);
    const actualShow = isControlled ? show : uncontrolledShow;

    const [mounted, setMounted] = useState<boolean>(actualShow ? true : false);

    useEffect(() => {
      if (actualShow && !mounted) {
        setMounted(true);
      }
    }, [actualShow, mounted]);

    const sheetMethodsRef = useRef<SheetMethods | null>(null);
    const pendingActionsRef = useRef<Array<() => void>>([]);

    const handleShowChange = useMemoizedFn((newShow: boolean) => {
      if (newShow === actualShow) return;
      onShowChange?.(newShow);
      if (!isControlled) {
        setUncontrolledShow(newShow);
      }
    });

    const registerMethods = useCallback((methods: SheetMethods | null) => {
      sheetMethodsRef.current = methods;
      if (methods && pendingActionsRef.current.length > 0) {
        for (const action of pendingActionsRef.current) {
          action();
        }
        pendingActionsRef.current = [];
      }
    }, []);

    useImperativeHandle(ref, () => {
      const queueAction = (action: () => void) => {
        if (mounted && sheetMethodsRef.current) {
          action();
        } else {
          if (!mounted) setMounted(true);
          pendingActionsRef.current.push(action);
        }
      };

      return {
        snapTo: (index, opts) => {
          handleShowChange(true);
          queueAction(() => sheetMethodsRef.current?.snapTo(index, opts));
        },
        expand: (opts) => {
          handleShowChange(true);
          queueAction(() => sheetMethodsRef.current?.expand(opts));
        },
        collapse: (opts) => {
          handleShowChange(true);
          queueAction(() => sheetMethodsRef.current?.collapse(opts));
        },
        close: (opts) => {
          handleShowChange(false);
          if (mounted || actualShow) {
            queueAction(() => sheetMethodsRef.current?.close(opts));
          }
        },
        open: (opts) => {
          handleShowChange(true);
          queueAction(() => sheetMethodsRef.current?.show?.(opts));
        },
      };
    }, [handleShowChange, mounted]);

    const contextValue = useMemo(
      () => ({
        show: actualShow,
        forceMount,
        setUncontrolledShow,
        groupState: PresenceState.Entered,
        mounted,
        onUnmount: () => {
          setMounted(false);
        },
        onOpen,
        onClose,
        onShowChange: handleShowChange,
        sheetProgress,
        registerMethods,
        snapPoints,
        initialSnap,
        onSnapChange: onSnapChangeProp,
        side,
        enableRTL,
        resolvedSide,
        screenHeight,
        screenWidth,
        rubberBand,
        dragDisabled,
        dismissThreshold,
        handleOnly,
        enableDragToClose,
        presenceStateMTRef,
        claimedGestureAngles,
      }),
      [
        actualShow,
        forceMount,
        setUncontrolledShow,
        mounted,
        onOpen,
        onClose,
        handleShowChange,
        sheetProgress,
        registerMethods,
        snapPoints,
        initialSnap,
        onSnapChangeProp,
        side,
        enableRTL,
        resolvedSide,
        screenHeight,
        screenWidth,
        rubberBand,
        dragDisabled,
        dismissThreshold,
        handleOnly,
        enableDragToClose,
        presenceStateMTRef,
        claimedGestureAngles,
      ],
    );

    return <SheetContext.Provider value={contextValue}>{children}</SheetContext.Provider>;
  });
