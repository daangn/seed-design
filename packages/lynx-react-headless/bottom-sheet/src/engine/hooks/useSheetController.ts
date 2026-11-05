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

  // fit 스냅은 레이아웃 측정 뒤에 결정되므로, 측정 전 요청의 애니메이션 옵션도 함께 보관한다.
  const pendingSnapMTRef = useMainThreadRef<{
    index: number;
    isEntry: boolean;
    animationConfig?: SheetTransition;
    animate?: boolean;
  } | null>(null);
  const transitionIdMTRef = useMainThreadRef(0);

  function completeSnapTransition(index: number, value: number) {
    "main thread";
    if (presenceStateMTRef.current === PresenceState.Entering) {
      onSnapChangeMT(index, value);
      entered();
    } else if (presenceStateMTRef.current === PresenceState.Entered) {
      onSnapChangeMT(index, value);
    }
    // 닫기가 시작된 뒤에는 이전 스냅 완료로 열림 상태나 스냅 콜백을 다시 반영하지 않는다.
  }

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

    if (target === -1) {
      pendingSnapMTRef.current = {
        index,
        isEntry: opts?.isEntry ?? false,
        animationConfig: opts?.animationConfig,
        animate: opts?.animate,
      };
      return;
    }

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

  function showMT(opts?: { animate?: boolean; animationConfig?: SheetTransition }) {
    "main thread";
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

  function closeMT(opts?: { animate?: boolean; animationConfig?: SheetTransition }) {
    "main thread";
    // 측정 전에 닫아도 대기 중인 fit 진입이 나중에 시트를 다시 열지 않게 한다.
    pendingSnapMTRef.current = null;
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

  function resurrectMT() {
    "main thread";
    if (presenceStateMTRef.current !== PresenceState.Leaving) {
      return;
    }

    yRef.current.stop();
    enter();

    if (onResurrected) {
      runOnBackground(onResurrected)();
    }
  }

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

  function onDragStartMT() {
    "main thread";
    ++transitionIdMTRef.current;
    pendingSnapMTRef.current = null;
    if (presenceStateMTRef.current === PresenceState.Leaving) {
      resurrectMT();
    } else {
      yRef.current.stop();
    }
    beginDragProgressMT();
  }

  function onDragEndSnapMT(index: number, opts?: { animationConfig?: SheetTransition }) {
    "main thread";
    snapToMT(index, opts);
  }

  function onDragEndCloseMT(opts?: { animationConfig?: SheetTransition }) {
    "main thread";
    const transitionId = ++transitionIdMTRef.current;
    pendingSnapMTRef.current = null;
    yRef.current.stop();
    beginCloseProgressMT();
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
    showMT,
    closeMT,
    snapToMT,
    onDragStartMT,
    onDragEndSnapMT,
    onDragEndCloseMT,
    resurrectMT,
    resolvePendingSnapMT,
  };
}
