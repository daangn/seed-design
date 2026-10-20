// Copyright 2026 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
// Modified by SEED Design: own progress transitions and cancel superseded operations.

import { runOnBackground, useMainThreadRef } from "@lynx-js/react";
import type { MainThreadRef } from "@lynx-js/react";

import { PresenceState } from "@lynx-js/lynx-ui-presence";
import type { MotionValue } from "@lynx-js/motion/mini";

import { useSheetPresence } from "./useSheetPresence";
import type { SheetTransition } from "../types";

export interface SheetControllerOptions {
  onEntered?: () => void;
  onDismiss?: () => void;
  onUnmount?: () => void;
  onBeforeDismiss?: () => void;
  onResurrected?: () => void;
  presenceStateMTRef?: MainThreadRef<PresenceState>;
}

export interface SheetControllerAnimationDeps {
  yRef: MainThreadRef<MotionValue<number>>;
  animateToMT: (value: number, cb?: () => void, config?: SheetTransition) => void;
  getTargetForSnap: (index: number) => number;
  getResolvedSnapPointValues: () => number[];
  onSnapChangeMT: (index: number, value: number) => void;
  enterAnimation: SheetTransition;
  exitAnimation: SheetTransition;
  initialSnap: number;
  beginSnapProgressMT: (target: number) => void;
  beginCloseProgressMT: () => void;
  beginDragProgressMT: () => void;
}

/**
 * Centralized controller for Sheet state transitions.
 * All state transitions (enter, entered, leave, left) flow through this controller.
 * This ensures consistent state management and prevents duplicate callbacks.
 */
export function useSheetController(
  options: SheetControllerOptions,
  deps: SheetControllerAnimationDeps,
) {
  const {
    onEntered,
    onDismiss,
    onUnmount,
    onBeforeDismiss,
    onResurrected,
    presenceStateMTRef: presenceStateMTRefProp,
  } = options;

  const {
    yRef,
    animateToMT,
    getTargetForSnap,
    getResolvedSnapPointValues,
    onSnapChangeMT,
    enterAnimation,
    exitAnimation,
    initialSnap,
    beginSnapProgressMT,
    beginCloseProgressMT,
    beginDragProgressMT,
  } = deps;

  const { presenceStateMTRef, enter, entered, leave, left } = useSheetPresence(
    {
      onEntered,
      onDismiss,
      onUnmount,
      onBeforeDismiss,
    },
    presenceStateMTRefProp,
  );

  // Pending snap index and options (for 'fit' snap points that resolve after layout)
  const pendingSnapMTRef = useMainThreadRef<{
    index: number;
    isEntry: boolean;
    animationConfig?: SheetTransition;
    animate?: boolean;
  } | null>(null);
  const transitionIdMTRef = useMainThreadRef(0);

  /**
   * Complete a snap transition - handle state changes after animation
   */
  function completeSnapTransition(index: number, value: number) {
    "main thread";
    if (presenceStateMTRef.current === PresenceState.Entering) {
      onSnapChangeMT(index, value);
      entered();
    } else if (presenceStateMTRef.current === PresenceState.Entered) {
      // Already entered, just update snap index
      onSnapChangeMT(index, value);
    }
    // If Leaving/Left, close animation took over - do nothing
  }

  /**
   * Snap to a specific snap point index
   */
  function snapToMT(
    index: number,
    opts?: {
      animate?: boolean;
      animationConfig?: SheetTransition;
      isEntry?: boolean;
    },
  ) {
    "main thread";
    const transitionId = ++transitionIdMTRef.current;
    pendingSnapMTRef.current = null;
    const target = getTargetForSnap(index);
    const values = getResolvedSnapPointValues();

    // If target is -1, snap point not yet resolved (e.g., 'fit')
    // Queue for later when layout completes
    if (target === -1) {
      pendingSnapMTRef.current = {
        index,
        isEntry: opts?.isEntry ?? false,
        animationConfig: opts?.animationConfig,
        animate: opts?.animate,
      };
      return;
    }

    // If called when Left, transition to Entering first
    if (presenceStateMTRef.current === PresenceState.Left) {
      enter();
    }

    yRef.current.stop();
    beginSnapProgressMT(target);
    const defaultConfig = opts?.isEntry ? enterAnimation : undefined;

    const clampedIndex = Math.max(0, Math.min(index, values.length - 1));

    if (opts?.animate === false) {
      yRef.current.jump(target);
      completeSnapTransition(index, values[clampedIndex]);
    } else {
      animateToMT(
        target,
        () => {
          "main thread";
          if (transitionIdMTRef.current === transitionId) {
            completeSnapTransition(index, values[clampedIndex]);
          }
        },
        opts?.animationConfig ?? defaultConfig,
      );
    }
  }

  /**
   * Show the sheet - animate to initial snap point
   */
  function showMT(opts?: { animate?: boolean; animationConfig?: SheetTransition }) {
    "main thread";
    // Guard: skip if already showing or shown
    if (
      presenceStateMTRef.current === PresenceState.Entering ||
      presenceStateMTRef.current === PresenceState.Entered
    ) {
      return;
    }

    enter();
    snapToMT(initialSnap, {
      animate: opts?.animate,
      animationConfig: opts?.animationConfig,
      isEntry: true,
    });
  }

  /**
   * Close the sheet - animate to y=0 and unmount
   */
  function closeMT(opts?: { animate?: boolean; animationConfig?: SheetTransition }) {
    "main thread";
    // 측정 전에 닫아도 대기 중인 fit 진입이 나중에 시트를 다시 열지 않게 한다.
    pendingSnapMTRef.current = null;
    // Guard: skip if already closing or closed
    if (
      presenceStateMTRef.current === PresenceState.Leaving ||
      presenceStateMTRef.current === PresenceState.Left
    ) {
      return;
    }

    const transitionId = ++transitionIdMTRef.current;
    yRef.current.stop();
    beginCloseProgressMT();
    leave();
    const target = 0;

    if (opts?.animate === false) {
      yRef.current.jump(target);
      left();
    } else {
      const config = opts?.animationConfig ?? exitAnimation;
      animateToMT(
        target,
        () => {
          "main thread";
          // Only complete if still in Leaving state (not interrupted)
          if (
            transitionIdMTRef.current === transitionId &&
            presenceStateMTRef.current === PresenceState.Leaving
          ) {
            left();
          }
        },
        config,
      );
    }
  }

  /**
   * Called when user drags during close animation to resurrect the sheet
   */
  function resurrectMT() {
    "main thread";
    // Guard: only resurrect if currently closing
    if (presenceStateMTRef.current !== PresenceState.Leaving) {
      return;
    }

    yRef.current.stop();
    enter();

    // Notify background to sync React show state
    if (onResurrected) {
      runOnBackground(onResurrected)();
    }
  }

  /**
   * Called when pending snap point is resolved (e.g., 'fit' after layout)
   */
  function resolvePendingSnapMT() {
    "main thread";
    const pending = pendingSnapMTRef.current;
    if (!pending) return;

    pendingSnapMTRef.current = null;
    snapToMT(pending.index, {
      isEntry: pending.isEntry,
      animationConfig: pending.animationConfig,
      animate: pending.animate,
    });
  }

  /**
   * Called by gesture handler when user starts a vertical drag
   */
  function onDragStartMT() {
    "main thread";
    ++transitionIdMTRef.current;
    pendingSnapMTRef.current = null;
    // If currently closing, resurrect
    if (presenceStateMTRef.current === PresenceState.Leaving) {
      resurrectMT();
    } else {
      // Just stop any running animation
      yRef.current.stop();
    }
    beginDragProgressMT();
  }

  /**
   * Called by gesture handler when drag ends - snap to nearest point or close
   */
  function onDragEndSnapMT(index: number, opts?: { animationConfig?: SheetTransition }) {
    "main thread";
    snapToMT(index, opts);
  }

  /**
   * Called by gesture handler when drag ends in dismiss zone
   */
  function onDragEndCloseMT(opts?: { animationConfig?: SheetTransition }) {
    "main thread";
    const transitionId = ++transitionIdMTRef.current;
    pendingSnapMTRef.current = null;
    yRef.current.stop();
    beginCloseProgressMT();
    // Transition to close if not already
    if (
      presenceStateMTRef.current !== PresenceState.Leaving &&
      presenceStateMTRef.current !== PresenceState.Left
    ) {
      leave();
    }

    const target = 0;
    animateToMT(
      target,
      () => {
        "main thread";
        if (
          transitionIdMTRef.current === transitionId &&
          presenceStateMTRef.current === PresenceState.Leaving
        ) {
          left();
        }
      },
      opts?.animationConfig ?? exitAnimation,
    );
  }

  return {
    presenceStateMTRef,
    // Commands
    showMT,
    closeMT,
    snapToMT,
    // Gesture handlers
    onDragStartMT,
    onDragEndSnapMT,
    onDragEndCloseMT,
    resurrectMT,
    // Layout helpers
    resolvePendingSnapMT,
  };
}
