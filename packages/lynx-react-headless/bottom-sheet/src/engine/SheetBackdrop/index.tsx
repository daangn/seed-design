import type { ReactElement } from "@lynx-js/react";
// Copyright 2026 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
// Modified by SEED Design: adapt style typing to the workspace ReactLynx version.

import { runOnBackground, useMainThreadRef } from "@lynx-js/react";

import { useMemoizedFn } from "@lynx-js/lynx-ui-common";
import { PresenceState } from "@lynx-js/lynx-ui-presence";
import { useMotionValueRefEvent } from "@lynx-js/motion/mini";
import type { MainThread } from "@lynx-js/types";
import { clsx } from "clsx";

import { useSheetContext } from "../context";
import type { SheetBackdropProps } from "../types";

export function SheetBackdrop(props: SheetBackdropProps): ReactElement {
  const { clickToClose = true, onClick, children, style, className } = props;
  const { sheetProgress, setUncontrolledShow, onShowChange, presenceStateMTRef } =
    useSheetContext();
  const overlayMTRef = useMainThreadRef<MainThread.Element>(null);

  useMotionValueRefEvent(sheetProgress, "change", (v) => {
    "main thread";
    overlayMTRef.current?.setStyleProperties({
      opacity: String(v),
    });
  });

  const handleClick = useMemoizedFn(() => {
    if (clickToClose) {
      // onShowChange triggers the close animation flow via handleShowChange in SheetRoot
      onShowChange?.(false);
      // setUncontrolledShow updates state for uncontrolled mode
      setUncontrolledShow(false);
    }
    onClick?.();
  });

  function handleClickMT() {
    "main thread";
    if (presenceStateMTRef && presenceStateMTRef.current !== PresenceState.Entered) {
      return;
    }

    runOnBackground(handleClick)();
  }

  return (
    <view
      main-thread:ref={overlayMTRef}
      className={clsx("lynx-ui-sheet-backdrop", className)}
      main-thread:bindtap={handleClickMT}
      event-through={false}
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        opacity: 0,
        ...(style as React.CSSProperties),
      }}
    >
      {children}
    </view>
  );
}
